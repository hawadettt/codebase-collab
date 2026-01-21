
'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PlusCircle, Loader2, Package, AlertTriangle, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp, query, orderBy } from "firebase/firestore";
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { useLanguage } from "@/context/language-provider";
import { Switch } from "./ui/switch";

export function ShipmentsDashboard() {
  const { language, t } = useLanguage();
  const shipmentStatusEnum = z.enum([t.shipmentStatusOption1, t.shipmentStatusOption2, t.shipmentStatusOption4, t.shipmentStatusOption5]);
  const transportTypeEnum = z.enum(['Air', 'Land', 'Sea']);

  const shipmentSchema = z.object({
    shipmentType: z.string().min(1, t.formShipmentTypeRequired),
    weight: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().positive(t.formWeightPositive)),
    containerNumber: z.string().min(1, t.formContainerNumberRequired),
    trackingNumber: z.string().min(1, t.formTrackingNumberRequired),
    acidNumber: z.string().optional(),
    carrierDetails: z.string().optional(),
    isTemperatureControlled: z.boolean().default(false),
    transportType: transportTypeEnum,
    quantity: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().int().positive(t.formQuantityPositive)),
    price: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().positive(t.formPricePositive)),
    customer: z.string().min(1, t.formCustomerRequired),
    status: shipmentStatusEnum,
  });
  
  type Shipment = z.infer<typeof shipmentSchema> & { id: string; createdAt: { seconds: number, nanoseconds: number } };

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
      trackingNumber: "",
      acidNumber: "",
      carrierDetails: "",
      isTemperatureControlled: false,
      transportType: "Sea",
      quantity: 0,
      price: 0,
      customer: "",
      status: t.shipmentStatusOption1,
    },
  });

  const shipmentsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'users', user.uid, 'shipments'), orderBy('createdAt', 'desc'));
  }, [firestore, user]);

  const { data: shipments, isLoading: isLoadingShipments } = useCollection<Shipment>(shipmentsQuery);

  const handleAddShipment = async (values: z.infer<typeof shipmentSchema>) => {
    if (!user) {
      toast({ variant: "destructive", title: t.authErrorTitle, description: t.authErrorDescription });
      return;
    }
    setIsSubmitting(true);
    try {
      const collectionRef = collection(firestore, 'users', user.uid, 'shipments');
      await addDocumentNonBlocking(collectionRef, { ...values, createdAt: serverTimestamp() });
      toast({ title: t.addShipmentSuccessTitle, description: t.addShipmentSuccessDescription });
      form.reset();
    } catch (error) {
      console.error("Failed to add shipment:", error);
      toast({ variant: "destructive", title: t.addShipmentFailTitle, description: t.addShipmentFailDescription });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading) {
      return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  if (!user) {
      return (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">{t.loginRequiredTitle}</h2>
              <p className="mt-2 text-muted-foreground">{t.loginRequiredDescription}</p>
              <Button asChild className="mt-4">
                <a href="/login">{t.sidebarLoginButton}</a>
              </Button>
            </div>
          </div>
      )
  }

  return (
      <div className="flex flex-col gap-6">
        <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><Truck className="h-6 w-6"/> {t.shipmentsTitle}</CardTitle>
              <CardDescription>{t.shipmentsDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {isLoadingShipments ? (
                <div className="flex h-full items-center justify-center text-muted-foreground"><Loader2 className="mx-2 h-4 w-4 animate-spin" /> {t.loadingShipments}</div>
              ) : shipments && shipments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.tableHeaderType}</TableHead>
                      <TableHead>{t.tableHeaderCustomer}</TableHead>
                      <TableHead>{t.tableHeaderDate}</TableHead>
                      <TableHead>{t.tableHeaderStatus}</TableHead>
                      <TableHead>{t.tableHeaderAcidNumber}</TableHead>
                      <TableHead>{t.tableHeaderTracking}</TableHead>
                      <TableHead className="text-left">{t.tableHeaderPrice}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-medium">{shipment.shipmentType}</TableCell>
                        <TableCell>{shipment.customer}</TableCell>
                        <TableCell>{shipment.createdAt ? format(new Date(shipment.createdAt.seconds * 1000), "PPP", { locale: language === 'ar' ? ar : enUS }) : 'N/A'}</TableCell>
                        <TableCell><Badge variant={shipment.status === t.shipmentStatusOption5 ? 'default' : 'secondary'}>{shipment.status}</Badge></TableCell>
                        <TableCell>{shipment.acidNumber}</TableCell>
                        <TableCell>{shipment.trackingNumber}</TableCell>
                        <TableCell className="text-left">${shipment.price.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-full items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
                      <Package className="h-12 w-12" />
                      <h3 className="font-semibold">{t.noShipmentsTitle}</h3>
                      <p className="max-w-xs text-sm">{t.noShipmentsDescription}</p>
                    </div>
                  </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><PlusCircle className="h-6 w-6"/> {t.addShipmentTitle}</CardTitle>
              <CardDescription>{t.addShipmentDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddShipment)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField control={form.control} name="shipmentType" render={({ field }) => (
                      <FormItem><FormLabel>{t.formShipmentType}</FormLabel><FormControl><Input placeholder={t.formShipmentTypePlaceholder} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="customer" render={({ field }) => (
                      <FormItem><FormLabel>{t.formCustomer}</FormLabel><FormControl><Input placeholder={t.formCustomerPlaceholder} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="trackingNumber" render={({ field }) => (
                      <FormItem><FormLabel>{t.formTrackingNumber}</FormLabel><FormControl><Input placeholder={t.formTrackingNumberPlaceholder} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="containerNumber" render={({ field }) => (
                      <FormItem><FormLabel>{t.formContainerNumber}</FormLabel><FormControl><Input placeholder={t.formContainerNumberPlaceholder} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="acidNumber" render={({ field }) => (
                      <FormItem><FormLabel>{t.formAcidNumber}</FormLabel><FormControl><Input placeholder="e.g., 123456789" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="carrierDetails" render={({ field }) => (
                      <FormItem><FormLabel>{t.formCarrierDetails}</FormLabel><FormControl><Input placeholder="e.g., Maersk, CMA CGM" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="weight" render={({ field }) => (
                      <FormItem><FormLabel>{t.formWeight}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="quantity" render={({ field }) => (
                      <FormItem><FormLabel>{t.formQuantity}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="price" render={({ field }) => (
                      <FormItem><FormLabel>{t.formPrice}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                      <FormField control={form.control} name="transportType" render={({ field }) => (
                      <FormItem><FormLabel>{t.formTransportType}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder={t.formTransportTypePlaceholder} /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Land">{t.transportTypeLand}</SelectItem>
                            <SelectItem value="Air">{t.transportTypeAir}</SelectItem>
                            <SelectItem value="Sea">{t.transportTypeSea}</SelectItem>
                          </SelectContent>
                        </Select><FormMessage />
                      </FormItem>
                    )} />
                      <FormField control={form.control} name="status" render={({ field }) => (
                      <FormItem><FormLabel>{t.formStatus}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder={t.formStatusPlaceholder} /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value={t.shipmentStatusOption1}>{t.shipmentStatusOption1}</SelectItem>
                            <SelectItem value={t.shipmentStatusOption2}>{t.shipmentStatusOption2}</SelectItem>
                            <SelectItem value={t.shipmentStatusOption4}>{t.shipmentStatusOption4}</SelectItem>
                            <SelectItem value={t.shipmentStatusOption5}>{t.shipmentStatusOption5}</SelectItem>
                          </SelectContent>
                        </Select><FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="isTemperatureControlled" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-8">
                        <div className="space-y-0.5">
                            <FormLabel>{t.formIsTemperatureControlled}</FormLabel>
                        </div>
                        <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        </FormItem>
                    )} />
                  </div>
                  <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mx-2 h-4 w-4 animate-spin" />}
                    {t.addShipmentButton}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
      </div>
  );
}
