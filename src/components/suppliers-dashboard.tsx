'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Loader2, Building2, Bot, Search, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { searchSuppliers, type SearchSuppliersInput, type SearchSuppliersOutput } from '@/ai/flows/search-suppliers';
import { useLanguage } from '@/context/language-provider';
import { Textarea } from './ui/textarea';

export function SuppliersDashboard() {
  const { language, t } = useLanguage();

  const supplierSchema = z.object({
    farmName: z.string().min(1, t.formFarmNameRequired),
    codificationCode: z.string().optional(),
    cropVarieties: z.string().min(1, t.formCropTypeRequired).transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
    certificationStatus: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
    location: z.string().min(1, t.formLocationRequired),
    gpsLocation: z.string().optional(),
    capacity: z.preprocess((a) => a ? parseFloat(z.string().parse(a)) : undefined, z.number().positive().optional()),
    contactNumber: z.string().min(1, t.formContactNumberRequired),
  });

  type Supplier = z.infer<typeof supplierSchema> & { id: string; createdAt: { seconds: number, nanoseconds: number } };

  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchSuppliersOutput | null>(null);

  const form = useForm<z.infer<typeof supplierSchema>>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      farmName: '',
      codificationCode: '',
      cropVarieties: [],
      certificationStatus: [],
      location: '',
      gpsLocation: '',
      capacity: undefined,
      contactNumber: '',
    },
  });

  const suppliersQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'users', user.uid, 'suppliers'), orderBy('createdAt', 'desc'));
  }, [firestore, user]);

  const { data: suppliers, isLoading: isLoadingSuppliers } = useCollection<Supplier>(suppliersQuery);

  const handleAddSupplier = async (values: z.infer<typeof supplierSchema>) => {
    if (!user) {
      toast({ variant: 'destructive', title: t.authErrorTitle, description: t.authErrorDescription });
      return;
    }
    setIsSubmitting(true);
    try {
      const collectionRef = collection(firestore, 'users', user.uid, 'suppliers');
      await addDocumentNonBlocking(collectionRef, { ...values, createdAt: serverTimestamp() });
      toast({ title: t.addSupplierSuccessTitle, description: t.addSupplierSuccessDescription });
      form.reset();
    } catch (error) {
      console.error('Failed to add supplier:', error);
      toast({ variant: 'destructive', title: t.addSupplierFailTitle, description: t.addSupplierFailDescription });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResults(null);
    try {
      const input: SearchSuppliersInput = { query: searchQuery };
      const result = await searchSuppliers(input);
      setSearchResults(result);
    } catch (error) {
      console.error('Failed to search suppliers:', error);
      toast({ variant: 'destructive', title: t.aiSearchFailTitle, description: t.aiSearchFailDescription });
    } finally {
      setIsSearching(false);
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
          <CardTitle className="font-headline flex items-center gap-2">
            <Building2 className="h-6 w-6" /> {t.suppliersTitle}
          </CardTitle>
          <CardDescription>{t.suppliersDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSuppliers ? (
            <div className="flex h-40 items-center justify-center text-muted-foreground">
              <Loader2 className="mx-2 h-4 w-4 animate-spin" /> {t.loadingSuppliers}
            </div>
          ) : suppliers && suppliers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.tableHeaderFarmName}</TableHead>
                  <TableHead>{t.tableHeaderCodificationCode}</TableHead>
                  <TableHead>{t.tableHeaderLocation}</TableHead>
                  <TableHead>{t.tableHeaderContact}</TableHead>
                  <TableHead>{t.tableHeaderDate}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.farmName}</TableCell>
                    <TableCell>{supplier.codificationCode}</TableCell>
                    <TableCell>{supplier.location}</TableCell>
                    <TableCell>{supplier.contactNumber}</TableCell>
                    <TableCell>
                      {supplier.createdAt ? format(new Date(supplier.createdAt.seconds * 1000), 'PPP', { locale: language === 'ar' ? ar : enUS }) : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <Building2 className="h-12 w-12" />
              <h3 className="font-semibold">{t.noSuppliersTitle}</h3>
              <p className="max-w-xs text-sm">{t.noSuppliersDescription}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <PlusCircle className="h-6 w-6" /> {t.addSupplierTitle}
          </CardTitle>
          <CardDescription>{t.addSupplierDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddSupplier)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <FormField control={form.control} name="farmName" render={({ field }) => (
                    <FormItem><FormLabel>{t.formFarmName}</FormLabel><FormControl><Input placeholder={t.formFarmNamePlaceholder} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="codificationCode" render={({ field }) => (
                    <FormItem><FormLabel>{t.formCodificationCode}</FormLabel><FormControl><Input placeholder="e.g. 12345" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem><FormLabel>{t.formLocation}</FormLabel><FormControl><Input placeholder={t.formLocationPlaceholder} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="gpsLocation" render={({ field }) => (
                    <FormItem><FormLabel>{t.formGpsLocation}</FormLabel><FormControl><Input placeholder="e.g. 30.0444, 31.2357" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="capacity" render={({ field }) => (
                    <FormItem><FormLabel>{t.formCapacity}</FormLabel><FormControl><Input type="number" placeholder="e.g. 5000" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="contactNumber" render={({ field }) => (
                    <FormItem><FormLabel>{t.formContactNumber}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                 <FormField control={form.control} name="cropVarieties" render={({ field }) => (
                    <FormItem><FormLabel>{t.formCropVarieties}</FormLabel><FormControl><Textarea placeholder={t.formCropTypePlaceholder} {...field} /></FormControl><CardDescription>{t.formCommaSeparated}</CardDescription><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="certificationStatus" render={({ field }) => (
                    <FormItem><FormLabel>{t.formCertificationStatus}</FormLabel><FormControl><Textarea placeholder="e.g. GLOBALG.A.P, ISO 22000" {...field} /></FormControl><CardDescription>{t.formCommaSeparated}</CardDescription><FormMessage /></FormItem>
                )} />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mx-2 h-4 w-4 animate-spin" />}
                {t.addSupplierButton}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Bot className="h-6 w-6" /> {t.aiSupplierSearchTitle}
          </CardTitle>
          <CardDescription>{t.aiSupplierSearchDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.aiSearchSupplierPlaceholder}
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? <Loader2 className="mx-2 h-4 w-4 animate-spin" /> : <Search className="mx-2 h-4 w-4" />}
                {t.aiSearchButton}
              </Button>
            </div>

            {(isSearching || searchResults) && (
            <div className="rounded-md border bg-background p-4">
              <h4 className="mb-2 font-semibold text-foreground">{t.resultsTitle}</h4>
              {isSearching ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mx-4 text-muted-foreground">{t.geminiAnalyzing}</p>
                </div>
              ) : searchResults && searchResults.suppliers.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.suppliers.map((supplier, index) => (
                    <div key={index} className="rounded-md border p-4">
                      <h5 className="font-bold">{supplier.farmName}</h5>
                      <p className="text-sm text-muted-foreground">{t.tableHeaderCropType}: {supplier.cropVarieties}</p>
                      <p className="text-sm text-muted-foreground">{t.tableHeaderLocation}: {supplier.location}</p>
                      <p className="text-sm text-muted-foreground">{t.tableHeaderContact}: {supplier.contactNumber}</p>
                      <a href={supplier.source} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">{t.aiSource}</a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t.aiNoResults}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
