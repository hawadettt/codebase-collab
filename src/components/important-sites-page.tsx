'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-provider";
import { ExternalLink, Globe, Shield, Search, Database, Code } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "./ui/button";
import type { TranslationKeys } from "@/lib/i18n";

type Site = {
  titleKey: TranslationKeys;
  descriptionKey: TranslationKeys;
  url: string;
}

type Category = {
  titleKey: TranslationKeys;
  icon: React.ReactNode;
  sites: Site[];
}

export function ImportantSitesPage() {
  const { t } = useLanguage();

  const categories: Category[] = [
    {
      titleKey: 'sitesCategorySovereign',
      icon: <Shield className="h-5 w-5 text-primary" />,
      sites: [
        { titleKey: 'siteNafezaTitle', descriptionKey: 'siteNafezaDesc', url: 'https://www.nafeza.gov.eg' },
        { titleKey: 'siteCapqTitle', descriptionKey: 'siteCapqDesc', url: 'https://www.capq.gov.eg' },
        { titleKey: 'siteCargoXTitle', descriptionKey: 'siteCargoXDesc', url: 'https://cargox.help' },
        { titleKey: 'siteAecTitle', descriptionKey: 'siteAecDesc', url: 'https://aec-egypt.org' },
      ]
    },
    {
      titleKey: 'sitesCategoryLogistics',
      icon: <Search className="h-5 w-5 text-primary" />,
      sites: [
        { titleKey: 'siteTradlinxTitle', descriptionKey: 'siteTradlinxDesc', url: 'https://blogs.tradlinx.com' },
        { titleKey: 'siteSearatesTitle', descriptionKey: 'siteSearatesDesc', url: 'https://www.searates.com' },
        { titleKey: 'siteProject44Title', descriptionKey: 'siteProject44Desc', url: 'https://developers.project44.com' },
      ]
    },
    {
      titleKey: 'sitesCategoryMarketIntel',
      icon: <Database className="h-5 w-5 text-primary" />,
      sites: [
        { titleKey: 'siteTridgeTitle', descriptionKey: 'siteTridgeDesc', url: 'https://www.tridge.com' },
        { titleKey: 'siteFlexportTitle', descriptionKey: 'siteFlexportDesc', url: 'https://www.flexport.com' },
        { titleKey: 'siteEgypteMarketTitle', descriptionKey: 'siteEgypteMarketDesc', url: 'https://www.egypte-market.com' },
      ]
    },
    {
      titleKey: 'sitesCategoryTechnical',
      icon: <Code className="h-5 w-5 text-primary" />,
      sites: [
        { titleKey: 'siteFirestoreBestPracticesTitle', descriptionKey: 'siteFirestoreBestPracticesDesc', url: 'https://firebase.google.com/docs/firestore/best-practices' },
        { titleKey: 'siteAgriErpTitle', descriptionKey: 'siteAgriErpDesc', url: 'https://www.agrierp.com' },
        { titleKey: 'siteDribbbleFarmerUiTitle', descriptionKey: 'siteDribbbleFarmerUiDesc', url: 'https://dribbble.com/search/farmer-ui' },
        { titleKey: 'siteDribbbleAgriDashboardTitle', descriptionKey: 'siteDribbbleAgriDashboardDesc', url: 'https://dribbble.com/search/agriculture-dashboard' },
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <Globe className="h-8 w-8" />
            {t.importantSitesTitle}
          </CardTitle>
          <CardDescription className="text-base">{t.importantSitesDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {categories.map((category, catIndex) => (
              <AccordionItem value={`category-${catIndex}`} key={catIndex}>
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                   <div className="flex items-center gap-3 text-start">
                    {category.icon}
                    <span>{t[category.titleKey]}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                   <Accordion type="single" collapsible className="w-full space-y-2 px-4">
                      {category.sites.map((site, siteIndex) => (
                         <AccordionItem value={`site-${catIndex}-${siteIndex}`} key={siteIndex} className="border-b-0 rounded-md border bg-muted/30">
                            <AccordionTrigger className="px-4 py-3 text-base font-medium hover:no-underline">
                              {t[site.titleKey]}
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 px-4 pb-4 text-sm">
                               <p className="text-muted-foreground">{t[site.descriptionKey]}</p>
                               <Button asChild variant="outline" size="sm">
                                  <a href={site.url} target="_blank" rel="noopener noreferrer">
                                    {t.visitSiteButton}
                                    <ExternalLink className="ms-2 h-4 w-4" />
                                  </a>
                              </Button>
                            </AccordionContent>
                         </AccordionItem>
                      ))}
                   </Accordion>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
