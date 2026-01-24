
'use client';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useLanguage } from '@/context/language-provider';
import { governorates } from '@/lib/governorates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, BadgeCheck, Loader2, PlusCircle, Building2, Search, Info } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Badge } from './ui/badge';
import { nfsaPackingStations, type NfsaSupplierSample } from '@/lib/nfsa-data';

type NfsaSupplier = {
  id: string;
  supplierName: string;
  governorate: string;
  activityType: string;
  products: string[];
  approvalDate: { seconds: number; nanoseconds: number; } | string; // Allow string for sample data
  status: string;
};

export function NfsaWhitelistDashboard() {
  const { language, t } = useLanguage();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const [nameFilter, setNameFilter] = useState('');
  const [govFilter, setGovFilter] = useState('all');
  const [activityFilter, setActivityFilter] = useState('');

  const nfsaSuppliersQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'users', user.uid, 'nfsaSuppliers'), orderBy('approvalDate', 'desc'));
  }, [firestore, user]);

  const { data: userSuppliers, isLoading: isLoadingSuppliers } = useCollection<NfsaSupplier>(nfsaSuppliersQuery);

  const usingSampleData = !userSuppliers || userSuppliers.length === 0;

  const suppliers = useMemo(() => {
    if (usingSampleData) {
      return nfsaPackingStations.map((s, i) => ({ ...s, id: `sample-${i}` }));
    }
    return userSuppliers;
  }, [userSuppliers, usingSampleData]);


  const filteredSuppliers = useMemo(() => {
    if (!suppliers) return [];
    return suppliers.filter(s => {
      const nameMatch = s.supplierName.toLowerCase().includes(nameFilter.toLowerCase());
      const govMatch = !govFilter || govFilter === 'all' ? true : (language === 'ar' ? s.governorate === govFilter : governorates.find(g => g.ar === s.governorate)?.en === govFilter);
      const activityMatch = activityFilter ? s.activityType.toLowerCase().includes(activityFilter.toLowerCase()) : true;
      
      const normalizedGov = language === 'ar' ? s.governorate : governorates.find(g => g.ar === s.governorate)?.en;

      return nameMatch && (govFilter === 'all' || normalizedGov === govFilter) && activityMatch;
    });
  }, [suppliers, nameFilter, govFilter, activityFilter, language]);
  
  if (isUserLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
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
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BadgeCheck className="h-6 w-6 text-green-500" /> {t.nfsaWhitelistTitle}
        </CardTitle>
        <CardDescription>{t.nfsaWhitelistDescription}</CardDescription>
        {usingSampleData && !isLoadingSuppliers && (
           <Alert className="mt-4">
             <Info className="h-4 w-4" />
             <AlertTitle>{t.sampleDataTitle}</AlertTitle>
             <AlertDescription>{t.sampleDataDescription}</AlertDescription>
           </Alert>
        )}
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          <Input
            placeholder={t.filterByNamePlaceholder}
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="max-w-sm"
          />
          <Select value={govFilter} onValueChange={setGovFilter}>
            <SelectTrigger className="max-w-sm">
              <SelectValue placeholder={t.filterByGovPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'ar' ? 'كل المحافظات' : 'All Governorates'}</SelectItem>
              {governorates.map(gov => (
                <SelectItem key={gov.code} value={language === 'ar' ? gov.ar : gov.en}>
                  {language === 'ar' ? gov.ar : gov.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder={t.filterByActivityPlaceholder}
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            className="max-w-sm"
          />
          <Button asChild className="ms-auto">
            <Link href="/suppliers/whitelist/new">
              <PlusCircle className="me-2" />
              <span>{t.addNfsaSupplierButton}</span>
            </Link>
          </Button>
        </div>

        {isLoadingSuppliers ? (
          <div className="flex h-60 items-center justify-center text-muted-foreground">
            <Loader2 className="mx-2 h-4 w-4 animate-spin" /> {t.loadingSuppliers}
          </div>
        ) : filteredSuppliers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.tableHeaderSupplierName}</TableHead>
                <TableHead>{t.tableHeaderGovernorate}</TableHead>
                <TableHead>{t.tableHeaderActivity}</TableHead>
                <TableHead>{t.tableHeaderProducts}</TableHead>
                <TableHead>{t.tableHeaderApprovalDate}</TableHead>
                <TableHead>{t.tableHeaderStatus}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map(supplier => {
                const dateToFormat = typeof supplier.approvalDate === 'string'
                  ? parseISO(supplier.approvalDate)
                  : new Date(supplier.approvalDate.seconds * 1000);
                
                const governorateDisplay = language === 'ar' ? supplier.governorate : (governorates.find(g => g.ar === supplier.governorate)?.en || supplier.governorate);

                return (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.supplierName}</TableCell>
                    <TableCell>{governorateDisplay}</TableCell>
                    <TableCell>{supplier.activityType}</TableCell>
                    <TableCell>{supplier.products?.join(', ')}</TableCell>
                    <TableCell>{format(dateToFormat, "PPP", { locale: language === 'ar' ? ar : enUS })}</TableCell>
                    <TableCell>
                      <Badge variant={supplier.status === t.statusActive || supplier.status === 'ساري' ? 'default' : 'destructive'}>
                        {supplier.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
            <div className="flex h-60 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                <Search className="h-12 w-12" />
                <h3 className="font-semibold">{t.noFilterResultsTitle}</h3>
                <p className="max-w-xs text-sm">{t.noFilterResultsDescription}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

