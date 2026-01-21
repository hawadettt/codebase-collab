
"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PlusCircle, Loader2, Package, AlertTriangle, Truck, DollarSign, CheckCircle, Bot, Languages, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp, query, orderBy } from "firebase/firestore";
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";
import { generateExportContract, type GenerateExportContractInput } from "@/ai/flows/generate-export-contract";
import { diplomaticTranslate, type DiplomaticTranslateInput } from "@/ai/flows/diplomatic-translator";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/language-provider";

export default function NileKeyDashboard() {
  const { language, t } = useLanguage();
  const shipmentStatusEnum = z.enum([t.shipmentStatusOption1, t.shipmentStatusOption2, t.shipmentStatusOption3]);

  const shipmentSchema = z.object({
    shipmentType: z.string().min(1, t.formShipmentTypeRequired),
    weight: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().positive(t.formWeightPositive)),
    containerNumber: z.string().min(1, t.formContainerNumberRequired),
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
  const [isGeneratingContract, setIsGeneratingContract] = useState(false);
  const [contractText, setContractText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationInput, setTranslationInput] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const form = useForm<z.infer<typeof shipmentSchema>>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      shipmentType: "",
      weight: 0,
      containerNumber: "",
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

  const stats = useMemo(() => {
    if (!shipments) return { totalShipments: 0, totalValue: 0, inTransit: 0, shipped: 0 };
    const totalValue = shipments.reduce((sum, s) => sum + s.price, 0);
    const inTransit = shipments.filter(s => s.status === t.shipmentStatusOption1 || s.status === t.shipmentStatusOption2).length;
    const shipped = shipments.filter(s => s.status === t.shipmentStatusOption3).length;
    return { totalShipments: shipments.length, totalValue, inTransit, shipped };
  }, [shipments, t]);

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
      form.reset({ ...form.getValues(), status: t.shipmentStatusOption1 });
    } catch (error) {
      console.error("Failed to add shipment:", error);
      toast({ variant: "destructive", title: t.addShipmentFailTitle, description: t.addShipmentFailDescription });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGenerateContract = async () => {
    setIsGeneratingContract(true);
    setContractText("");
    try {
      const input: GenerateExportContractInput = { language: language === 'ar' ? 'Arabic' : 'English' };
      const result = await generateExportContract(input);
      setContractText(result.contractText);
    } catch (error) {
      console.error("Failed to generate contract:", error);
      toast({ variant: "destructive", title: t.generateContractFailTitle, description: t.generateContractFailDescription });
    } finally {
      setIsGeneratingContract(false);
    }
  };

  const handleTranslate = async () => {
    if (!translationInput.trim()) return;
    setIsTranslating(true);
    setTranslatedText("");
    try {
      const input: DiplomaticTranslateInput = {
        text: translationInput,
        targetLanguage: language === 'ar' ? 'English' : 'Arabic',
        context: 'business email',
      };
      const result = await diplomaticTranslate(input);
      setTranslatedText(result.translatedText);
    } catch (error) {
      console.error("Failed to translate:", error);
      toast({ variant: "destructive", title: t.translateFailTitle, description: t.translateFailDescription });
    } finally {
      setIsTranslating(false);
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
                        <CardTitle className="text-sm font-medium">{t.statsTotalShipments}</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{isLoadingShipments ? <Skeleton className="h-8 w-16" /> : stats.totalShipments}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t.statsTotalValue}</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{isLoadingShipments ? <Skeleton className="h-8 w-32" /> : `$${stats.totalValue.toLocaleString()}`}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t.statsInTransit}</CardTitle>
                        <Truck className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{isLoadingShipments ? <Skeleton className="h-8 w-16" /> : stats.inTransit}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t.statsShipped}</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{isLoadingShipments ? <Skeleton className="h-8 w-16" /> : stats.shipped}</div>
                      </CardContent>
                    </Card>
                  </div>
                  
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
                                <TableHead className="text-left">{t.tableHeaderPrice}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {shipments.map((shipment) => (
                                <TableRow key={shipment.id}>
                                  <TableCell className="font-medium">{shipment.shipmentType}</TableCell>
                                  <TableCell>{shipment.customer}</TableCell>
                                  <TableCell>{shipment.createdAt ? format(new Date(shipment.createdAt.seconds * 1000), "PPP", { locale: language === 'ar' ? ar : enUS }) : 'N/A'}</TableCell>
                                  <TableCell><Badge variant={shipment.status === t.shipmentStatusOption3 ? 'default' : 'secondary'}>{shipment.status}</Badge></TableCell>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField control={form.control} name="shipmentType" render={({ field }) => (
                                <FormItem><FormLabel>{t.formShipmentType}</FormLabel><FormControl><Input placeholder={t.formShipmentTypePlaceholder} {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name="customer" render={({ field }) => (
                                <FormItem><FormLabel>{t.formCustomer}</FormLabel><FormControl><Input placeholder={t.formCustomerPlaceholder} {...field} /></FormControl><FormMessage /></FormItem>
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
                              <FormField control={form.control} name="containerNumber" render={({ field }) => (
                                <FormItem><FormLabel>{t.formContainerNumber}</FormLabel><FormControl><Input placeholder={t.formContainerNumberPlaceholder} {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                            </div>
                             <FormField control={form.control} name="status" render={({ field }) => (
                              <FormItem><FormLabel>{t.formStatus}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue placeholder={t.formStatusPlaceholder} /></SelectTrigger></FormControl>
                                  <SelectContent>
                                    <SelectItem value={t.shipmentStatusOption1}>{t.shipmentStatusOption1}</SelectItem>
                                    <SelectItem value={t.shipmentStatusOption2}>{t.shipmentStatusOption2}</SelectItem>
                                    <SelectItem value={t.shipmentStatusOption3}>{t.shipmentStatusOption3}</SelectItem>
                                  </SelectContent>
                                </Select><FormMessage />
                              </FormItem>
                            )} />
                            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                              {isSubmitting && <Loader2 className="mx-2 h-4 w-4 animate-spin" />}
                              {t.addShipmentButton}
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="font-headline flex items-center gap-2">
                        <Bot className="h-6 w-6" />
                        {t.aiLabTitle}
                      </CardTitle>
                      <CardDescription>{t.aiLabDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2"><FileText /> {t.contractGeneratorTitle}</h4>
                        <p className="text-sm text-muted-foreground">{t.contractGeneratorDescription}</p>
                        <Button onClick={handleGenerateContract} disabled={isGeneratingContract}>
                          {isGeneratingContract && <Loader2 className="mx-2 h-4 w-4 animate-spin" />}
                          {t.contractGeneratorButton}
                        </Button>
                      </div>
                      {(isGeneratingContract || contractText) && (
                        <div className="rounded-md border bg-background p-4">
                          <h4 className="mb-2 font-semibold text-foreground">{t.resultsTitle}</h4>
                          {isGeneratingContract ? (
                            <div className="flex items-center justify-center p-8">
                              <Loader2 className="h-8 w-8 animate-spin text-primary" />
                              <p className="mx-4 text-muted-foreground">{t.geminiAnalyzing}</p>
                            </div>
                          ) : (
                            <Textarea readOnly value={contractText} className="h-auto min-h-[300px] w-full resize-y bg-muted/30 font-code text-sm" rows={20} />
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2"><Languages /> {t.diplomaticTranslatorTitle}</h4>
                        <p className="text-sm text-muted-foreground">{t.diplomaticTranslatorDescription}</p>
                        <div className="space-y-4">
                          <Textarea value={translationInput} onChange={(e) => setTranslationInput(e.target.value)} placeholder={t.translatorInputPlaceholder} className="min-h-[100px]" />
                          <Button onClick={handleTranslate} disabled={isTranslating}>
                            {isTranslating && <Loader2 className="mx-2 h-4 w-4 animate-spin" />}
                            {t.translatorButton}
                          </Button>
                        </div>
                      </div>
                       {(isTranslating || translatedText) && (
                          <div className="rounded-md border bg-background p-4">
                             <h4 className="mb-2 font-semibold text-foreground">{t.resultsTitle}</h4>
                            {isTranslating ? (
                              <div className="flex items-center justify-center p-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="mx-4 text-muted-foreground">{t.geminiAnalyzing}</p>
                              </div>
                            ) : (
                              <Textarea readOnly value={translatedText} className="h-auto min-h-[100px] w-full resize-y bg-muted/30 font-code text-sm" rows={8}/>
                            )}
                          </div>
                        )}
                    </CardContent>
                  </Card>

                </div>
              ) : (
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
              )}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
