'use client';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useLanguage } from '@/context/language-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { AlertTriangle, BadgeCheck, Loader2, PlusCircle, Building2, Search } from 'lucide-react';
import { Badge } from './ui/badge';

type NfsaSupplier = {
  id: string;
  supplierName: string;
  address: string;
  activityType: string;
  phoneNumber?: string;
  notes?: string;
};

export function NfsaWhitelistDashboard() {
  const { language, t } = useLanguage();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const [nameFilter, setNameFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [activityFilter, setActivityFilter] = useState('');

  const nfsaSuppliersQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'users', user.uid, 'nfsaSuppliers'), orderBy('supplierName', 'asc'));
  }, [firestore, user]);

  const { data: dbSuppliers, isLoading: isLoadingSuppliers } = useCollection<NfsaSupplier>(nfsaSuppliersQuery);

  const filteredSuppliers = useMemo(() => {
    if (!dbSuppliers) {
      return [];
    }
    return dbSuppliers.filter(s => {
      const nameMatch = s.supplierName.toLowerCase().includes(nameFilter.toLowerCase());
      const addressMatch = s.address.toLowerCase().includes(addressFilter.toLowerCase());
      const activityMatch = s.activityType.toLowerCase().includes(activityFilter.toLowerCase());
      return nameMatch && addressMatch && activityMatch;
    });
  }, [dbSuppliers, nameFilter, addressFilter, activityFilter]);
  
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
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          <Input
            placeholder={t.filterByNamePlaceholder}
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="max-w-sm"
          />
          <Input
            placeholder={t.filterByAddressPlaceholder}
            value={addressFilter}
            onChange={(e) => setAddressFilter(e.target.value)}
            className="max-w-sm"
          />
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
        ) : dbSuppliers && dbSuppliers.length > 0 ? (
          filteredSuppliers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.tableHeaderSupplierName}</TableHead>
                  <TableHead>{t.tableHeaderAddress}</TableHead>
                  <TableHead>{t.tableHeaderActivity}</TableHead>
                  <TableHead>{t.tableHeaderPhoneNumber}</TableHead>
                  <TableHead>{t.tableHeaderNotes}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map(supplier => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.supplierName}</TableCell>
                      <TableCell>{supplier.address}</TableCell>
                      <TableCell>{supplier.activityType}</TableCell>
                      <TableCell>{supplier.phoneNumber || '-'}</TableCell>
                      <TableCell>{supplier.notes || '-'}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          ) : (
             <div className="flex h-60 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                <Search className="h-12 w-12" />
                <h3 className="font-semibold">{t.noFilterResultsTitle}</h3>
                <p className="max-w-xs text-sm">{t.noFilterResultsDescription}</p>
            </div>
          )
        ) : (
          <div className="flex h-60 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <Building2 className="h-12 w-12" />
            <h3 className="font-semibold">{t.noNfsaSuppliersTitle}</h3>
            <p className="max-w-xs text-sm">{t.noNfsaSuppliersDescription}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
