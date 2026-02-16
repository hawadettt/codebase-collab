'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-provider";
import { ExternalLink, Globe, Shield, Search, Database, Code, Briefcase, Building2, AlertTriangle, PlusCircle, Trash2, Loader2, Landmark, Sprout, Plane } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useCollection, useDoc, useFirestore, useUser } from '@/firebase';
import { collection, doc, DocumentReference, query, orderBy } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';
import React, { useState, useMemo } from 'react';
import { DeleteCategoryAlert } from './delete-category-alert';
import { AddSiteDialog } from './add-site-dialog';
import { defaultSiteCategories } from '@/lib/default-sites';
import type { TranslationKeys } from '@/lib/i18n';

const iconComponents: { [key: string]: React.ReactNode } = {
  Globe: <Globe className="h-8 w-8" />,
  Shield: <Shield className="h-8 w-8" />,
  Search: <Search className="h-8 w-8" />,
  Database: <Database className="h-8 w-8" />,
  Code: <Code className="h-8 w-8" />,
  Briefcase: <Briefcase className="h-8 w-8" />,
  Building2: <Building2 className="h-8 w-8" />,
  Landmark: <Landmark className="h-8 w-8" />,
  Sprout: <Sprout className="h-8 w-8" />,
  Plane: <Plane className="h-8 w-8" />,
  Default: <Globe className="h-8 w-8" />,
};

export function ImportantSitesPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const { user } = useUser();
  const firestore = useFirestore();
  const { t } = useLanguage();
  const router = useRouter();

  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);
  const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false);

  // Check if the user has ANY custom categories to decide the data source
  const customCategoriesQuery = useMemo(() => {
    if (!user) return null;
    return query(collection(firestore, 'users', user.uid, 'siteCategories'));
  }, [user, firestore]);
  const { data: customCategories, isLoading: isLoadingCustom } = useCollection<any>(customCategoriesQuery);

  const isDefaultMode = useMemo(() => {
    if (isLoadingCustom) return undefined; // Undefined while loading
    return !customCategories || customCategories.length === 0;
  }, [customCategories, isLoadingCustom]);

  // --- Firestore Data Hooks (only run if not in default mode) ---
  const categoryDocRef = useMemo(() => {
    if (isDefaultMode !== false || !user || !categoryId) return null;
    return doc(firestore, 'users', user.uid, 'siteCategories', categoryId) as DocumentReference<any>;
  }, [firestore, user, categoryId, isDefaultMode]);
  const { data: firestoreCategory, isLoading: isLoadingFirestoreCategory } = useDoc<any>(categoryDocRef);

  const sitesQuery = useMemo(() => {
    if (isDefaultMode !== false || !user || !categoryId) return null;
    return query(collection(firestore, 'users', user.uid, 'siteCategories', categoryId, 'sites'), orderBy('title', 'asc'));
  }, [firestore, user, categoryId, isDefaultMode]);
  const { data: firestoreSites, isLoading: isLoadingFirestoreSites } = useCollection<any>(sitesQuery);
  
  // --- Default Data (retrieved synchronously) ---
  const defaultCategoryData = useMemo(() => {
    if (isDefaultMode !== true) return null;
    return defaultSiteCategories.find(c => c.id === categoryId);
  }, [categoryId, isDefaultMode]);

  // --- Loading State ---
  const isLoading = isDefaultMode === undefined || (isDefaultMode === false && (isLoadingFirestoreCategory || isLoadingFirestoreSites));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  // --- Determine final data to render ---
  const category = isDefaultMode ? defaultCategoryData : firestoreCategory;
  const sites = isDefaultMode ? defaultCategoryData?.sites : firestoreSites;
  
  if (!category) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Category Not Found</AlertTitle>
        <AlertDescription>
          The requested category does not exist or you do not have permission to view it.
        </AlertDescription>
      </Alert>
    );
  }
  
  const IconComponent = iconComponents[category.icon] || iconComponents.Default;
  const title = isDefaultMode ? t[category.titleKey as TranslationKeys] : category.title;
  const description = isDefaultMode ? t[category.descriptionKey as TranslationKeys] : category.description;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className='flex-1'>
              <CardTitle className="font-headline text-3xl flex items-center gap-3">
                {IconComponent}
                {title}
              </CardTitle>
              <CardDescription className="text-base pt-2">{description}</CardDescription>
            </div>
            {!isDefaultMode && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setIsAddSiteOpen(true)}>
                  <PlusCircle className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsDeleteCategoryOpen(true)}>
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {sites && sites.map((site, siteIndex) => {
                const siteTitle = isDefaultMode ? t[site.titleKey as TranslationKeys] : site.title;
                const siteDescription = isDefaultMode ? t[site.descriptionKey as TranslationKeys] : site.description;
                return (
                    <AccordionItem value={`site-${siteIndex}`} key={site.id || site.url} className="border-b-0 rounded-md border bg-muted/30">
                        <AccordionTrigger className="px-4 py-3 text-base font-medium hover:no-underline text-start">
                            {siteTitle}
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 px-4 pb-4 text-sm">
                            <p className="text-muted-foreground">{siteDescription}</p>
                            <Button asChild variant="outline" size="sm">
                            <a href={site.url.startsWith('http') ? site.url : `https://${site.url}`} target="_blank" rel="noopener noreferrer">
                                {t.visitSiteButton}
                                <ExternalLink className="ms-2 h-4 w-4" />
                            </a>
                            </Button>
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
            {(!sites || sites.length === 0) && (
                 <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center">
                    <p className="text-muted-foreground">{isDefaultMode ? "This default category has no sites." : "Add your first site to this category by clicking the '+' icon above."}</p>
                </div>
            )}
          </Accordion>
        </CardContent>
      </Card>
      {!isDefaultMode && (
        <>
            <AddSiteDialog
                isOpen={isAddSiteOpen}
                onOpenChange={setIsAddSiteOpen}
                categoryId={categoryId}
            />
            <DeleteCategoryAlert
                isOpen={isDeleteCategoryOpen}
                onOpenChange={setIsDeleteCategoryOpen}
                categoryId={categoryId}
                onDeleted={() => router.push('/important-sites')}
            />
        </>
      )}
    </>
  );
}
