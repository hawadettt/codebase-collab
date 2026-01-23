'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-provider";
import { ExternalLink, Globe, Shield, Search, Database, Code, Briefcase, Building2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "./ui/button";
import type { TranslationKeys } from "@/lib/i18n";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertTriangle } from "lucide-react";
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';


type Site = {
  titleKey: TranslationKeys;
  descriptionKey: TranslationKeys;
  url: string;
}

type SiteWithMultipleUrls = {
    titleKey: TranslationKeys;
    descriptionKey: TranslationKeys;
    urls: { label: string; url: string }[];
}

type Category = {
  id: string;
  titleKey: TranslationKeys;
  descriptionKey: TranslationKeys;
  icon: React.ReactNode;
  sites: (Site | SiteWithMultipleUrls)[];
}

const iconComponents: { [key: string]: React.ReactNode } = {
  Globe: <Globe className="h-8 w-8" />,
  Shield: <Shield className="h-8 w-8" />,
  Search: <Search className="h-8 w-8" />,
  Database: <Database className="h-8 w-8" />,
  Code: <Code className="h-8 w-8" />,
  Briefcase: <Briefcase className="h-8 w-8" />,
  Building2: <Building2 className="h-8 w-8" />,
  Default: <Globe className="h-8 w-8" />,
};

function isMultiUrl(site: Site | SiteWithMultipleUrls): site is SiteWithMultipleUrls {
    return 'urls' in site;
}


const ALL_CATEGORIES: Category[] = [
  {
    id: 'sovereign',
    titleKey: 'sitesCategorySovereign',
    descriptionKey: 'importantSitesDescription', // Re-using general description
    icon: <Shield className="h-8 w-8" />,
    sites: [
      { titleKey: 'siteNafezaTitle', descriptionKey: 'siteNafezaDesc', url: 'https://www.nafeza.gov.eg' },
      { titleKey: 'siteCapqTitle', descriptionKey: 'siteCapqDesc', url: 'https://www.capq.gov.eg' },
      { titleKey: 'siteCargoXTitle', descriptionKey: 'siteCargoXDesc', url: 'https://cargox.help' },
      { titleKey: 'siteAecTitle', descriptionKey: 'siteAecDesc', url: 'https://aec-egypt.org' },
    ]
  },
  {
    id: 'logistics',
    titleKey: 'sitesCategoryLogistics',
    descriptionKey: 'importantSitesDescription',
    icon: <Search className="h-8 w-8" />,
    sites: [
      { titleKey: 'siteTradlinxTitle', descriptionKey: 'siteTradlinxDesc', url: 'https://blogs.tradlinx.com' },
      { titleKey: 'siteSearatesTitle', descriptionKey: 'siteSearatesDesc', url: 'https://www.searates.com' },
      { titleKey: 'siteProject44Title', descriptionKey: 'siteProject44Desc', url: 'https://developers.project44.com' },
    ]
  },
  {
    id: 'market-intel',
    titleKey: 'sitesCategoryMarketIntel',
    descriptionKey: 'importantSitesDescription',
    icon: <Database className="h-8 w-8" />,
    sites: [
      { titleKey: 'siteTridgeTitle', descriptionKey: 'siteTridgeDesc', url: 'https://www.tridge.com' },
      { titleKey: 'siteHsCodesTitle', descriptionKey: 'siteHsCodesDesc', urls: [
          { label: 'Flexport', url: 'https://www.flexport.com/hs-code' },
          { label: 'Egypte-Market', url: 'https://www.egypte-market.com' }
      ] },
    ]
  },
  {
    id: 'technical',
    titleKey: 'sitesCategoryTechnical',
    descriptionKey: 'importantSitesDescription',
    icon: <Code className="h-8 w-8" />,
    sites: [
      { titleKey: 'siteFirestoreBestPracticesTitle', descriptionKey: 'siteFirestoreBestPracticesDesc', url: 'https://firebase.google.com/docs/firestore/best-practices' },
      { titleKey: 'siteAgriErpTitle', descriptionKey: 'siteAgriErpDesc', url: 'https://www.agrierp.com' },
      { titleKey: 'siteDribbbleFarmerUiTitle', descriptionKey: 'siteDribbbleFarmerUiDesc', urls: [
          { label: 'Farmer UI', url: 'https://dribbble.com/search/farmer-ui' },
          { label: 'Agriculture Dashboard', url: 'https://dribbble.com/search/agriculture-dashboard' }
      ] },
    ]
  }
];

function CustomCategoryDisplay({ categoryId }: { categoryId: string }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { t } = useLanguage();

    const categoryRef = useMemoFirebase(() => {
        if (!user || !categoryId) return null;
        return doc(firestore, 'users', user.uid, 'siteCategories', categoryId) as DocumentReference<any>;
    }, [firestore, user, categoryId]);

    const { data: category, isLoading } = useDoc<any>(categoryRef);

    if (isLoading) {
        return <Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>;
    }
    
    if (!category) {
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Category Not Found</AlertTitle>
                <AlertDescription>
                    The custom category '{categoryId}' does not exist or you don't have permission to view it.
                </AlertDescription>
            </Alert>
        )
    }
    
    const IconComponent = iconComponents[category.icon] || iconComponents.Default;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl flex items-center gap-3">
                    {IconComponent}
                    {category.title}
                </CardTitle>
                <CardDescription className="text-base">{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center">
                    <p className="text-muted-foreground">{t.featureComingSoonSites}</p>
                </div>
            </CardContent>
        </Card>
    );
}


export function ImportantSitesPage() {
  const params = useParams();
  const { t } = useLanguage();
  const categoryId = params.categoryId as string;

  const category = ALL_CATEGORIES.find(c => c.id === categoryId);

  if (!category) {
    return <CustomCategoryDisplay categoryId={categoryId} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-3">
            {category.icon}
            {t[category.titleKey]}
          </CardTitle>
          <CardDescription className="text-base">{t[category.descriptionKey]}</CardDescription>
        </CardHeader>
        <CardContent>
           <Accordion type="single" collapsible className="w-full space-y-2">
              {category.sites.map((site, siteIndex) => (
                 <AccordionItem value={`site-${siteIndex}`} key={siteIndex} className="border-b-0 rounded-md border bg-muted/30">
                    <AccordionTrigger className="px-4 py-3 text-base font-medium hover:no-underline text-start">
                      {t[site.titleKey]}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 px-4 pb-4 text-sm">
                       <p className="text-muted-foreground">{t[site.descriptionKey]}</p>
                       {isMultiUrl(site) ? (
                           <div className="flex gap-2">
                            {site.urls.map((link, linkIndex) => (
                                <Button asChild variant="outline" size="sm" key={linkIndex}>
                                    <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer">
                                        {link.label}
                                        <ExternalLink className="ms-2 h-4 w-4" />
                                    </a>
                                </Button>
                            ))}
                           </div>
                       ) : (
                        <Button asChild variant="outline" size="sm">
                            <a href={site.url.startsWith('http') ? site.url : `https://${site.url}`} target="_blank" rel="noopener noreferrer">
                                {t.visitSiteButton}
                                <ExternalLink className="ms-2 h-4 w-4" />
                            </a>
                        </Button>
                       )}
                    </AccordionContent>
                 </AccordionItem>
              ))}
           </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
