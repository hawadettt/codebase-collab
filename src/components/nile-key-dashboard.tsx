
"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PlusCircle, Loader2, Package, AlertTriangle, Truck, DollarSign, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp, query, orderBy } from "firebase/firestore";
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

const shipmentSchema = z.object({
  shipmentType: z.string().min(1, "Shipment type is required"),
  weight: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().positive("Weight must be positive")),
  containerNumber: z.string().min(1, "Container number is required"),
  quantity: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().int().positive("Quantity must be positive")),
  price: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().positive("Price must be positive")),
  customer: z.string().min(1, "Customer name is required"),
  status: z.enum(["قيد التجهيز", "في الميناء", "تم الشحن"]),
});

type Shipment = z.infer<typeof shipmentSchema> & { id: string; createdAt: { seconds: number, nanoseconds: number } };

export default function NileKeyDashboard() {
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof shipmentSchema>>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      shipmentType: "",
      weight: 0,
      containerNumber: "",
      quantity: 0,
      price: 0,
      customer: "",
      status: "قيد التجهيز",
    },
  });

  const shipmentsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'users', user.uid, 'shipments'), orderBy('createdAt', 'desc'));
  }, [firestore, user]);

  const { data: shipments, isLoading: isLoadingShipments } = useCollection<Shipment>(shipmentsQuery);

  const stats = useMemo(() => {
    if (!shipments) {
      return {
        totalShipments: 0,
        totalValue: 0,
        inTransit: 0,
        shipped: 0,
      };
    }
    const totalValue = shipments.reduce((sum, s) => sum + s.price, 0);
    const inTransit = shipments.filter(s => s.status === 'قيد التجهيز' || s.status === 'في الميناء').length;
    const shipped = shipments.filter(s => s.status === 'تم الشحن').length;
    return {
      totalShipments: shipments.length,
      totalValue,
      inTransit,
      shipped,
    };
  }, [shipments]);

  const handleAddShipment = async (values: z.infer<typeof shipmentSchema>) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not Authenticated",
        description: "You must be logged in to add a shipment.",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const collectionRef = collection(firestore, 'users', user.uid, 'shipments');
      await addDocumentNonBlocking(collectionRef, {
        ...values,
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Shipment Added",
        description: "Your new shipment has been recorded successfully.",
      });
      form.reset();
    } catch (error) {
      console.error("Failed to add shipment:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Could not save the shipment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-full flex-col">
            <Header />
            <main className="flex-1 overflow-auto p-4 md:p-6">
              {isUserLoading ? (
                <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : user ? (
                <div className="flex flex-col gap-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{isLoadingShipments ? <Skeleton className="h-8 w-16" /> : stats.totalShipments}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Shipment Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{isLoadingShipments ? <Skeleton className="h-8 w-32" /> : `$${stats.totalValue.toLocaleString()}`}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Shipments In Transit</CardTitle>
                        <Truck className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{isLoadingShipments ? <Skeleton className="h-8 w-16" /> : stats.inTransit}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Shipments Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{isLoadingShipments ? <Skeleton className="h-8 w-16" /> : stats.shipped}</div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-1 flex flex-col">
                      <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><PlusCircle className="h-6 w-6"/> Add New Shipment</CardTitle>
                        <CardDescription>Enter the details for a new shipment.</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handleAddShipment)} className="space-y-4">
                            <FormField control={form.control} name="shipmentType" render={({ field }) => (
                              <FormItem><FormLabel>Shipment Type</FormLabel><FormControl><Input placeholder="e.g., Lettuce, Tomatoes" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="customer" render={({ field }) => (
                              <FormItem><FormLabel>Customer</FormLabel><FormControl><Input placeholder="Customer Name" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <div className="grid grid-cols-2 gap-4">
                              <FormField control={form.control} name="weight" render={({ field }) => (
                                <FormItem><FormLabel>Weight (kg)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name="quantity" render={({ field }) => (
                                <FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                            </div>
                            <FormField control={form.control} name="price" render={({ field }) => (
                              <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="containerNumber" render={({ field }) => (
                              <FormItem><FormLabel>Container Number</FormLabel><FormControl><Input placeholder="e.g., MSKU1234567" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="status" render={({ field }) => (
                              <FormItem><FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                                  <SelectContent>
                                    <SelectItem value="قيد التجهيز">قيد التجهيز</SelectItem>
                                    <SelectItem value="في الميناء">في الميناء</SelectItem>
                                    <SelectItem value="تم الشحن">تم الشحن</SelectItem>
                                  </SelectContent>
                                </Select><FormMessage />
                              </FormItem>
                            )} />
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Add Shipment
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                    <Card className="lg:col-span-2 flex flex-col">
                      <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><Truck className="h-6 w-6"/> Your Shipments</CardTitle>
                        <CardDescription>A list of all your recorded shipments.</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        {isLoadingShipments ? (
                          <div className="flex h-full items-center justify-center text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading shipments...</div>
                        ) : shipments && shipments.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {shipments.map((shipment) => (
                                <TableRow key={shipment.id}>
                                  <TableCell className="font-medium">{shipment.shipmentType}</TableCell>
                                  <TableCell>{shipment.customer}</TableCell>
                                  <TableCell>{shipment.createdAt ? format(new Date(shipment.createdAt.seconds * 1000), "PPP") : 'N/A'}</TableCell>
                                  <TableCell><Badge variant={shipment.status === 'تم الشحن' ? 'default' : 'secondary'}>{shipment.status}</Badge></TableCell>
                                  <TableCell className="text-right">${shipment.price.toLocaleString()}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="flex h-full items-center justify-center">
                              <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
                                <Package className="h-12 w-12" />
                                <h3 className="font-semibold">No shipments yet</h3>
                                <p className="max-w-xs text-sm">Add your first shipment using the form on the left.</p>
                              </div>
                            </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h2 className="mt-4 text-xl font-semibold">Please Log In</h2>
                    <p className="mt-2 text-muted-foreground">You need to be logged in to manage your shipments.</p>
                    <Button asChild className="mt-4">
                      <a href="/login">Login / Sign Up</a>
                    </Button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
