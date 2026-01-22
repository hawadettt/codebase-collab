'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-provider";
import { ExternalLink, Globe } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "./ui/button";

type Site = {
  title: string;
  description: string;
  url: string;
}

export function ImportantSitesPage() {
  const { t } = useLanguage();

  const sites: Site[] = [
    {
      title: t.siteNafezaTitle,
      description: t.siteNafezaDesc,
      url: 'https://www.nafeza.gov.eg'
    },
    {
      title: t.siteGoeicTitle,
      description: t.siteGoeicDesc,
      url: 'https://goeic.gov.eg/'
    },
    {
      title: t.siteCustomsTitle,
      description: t.siteCustomsDesc,
      url: 'https://www.customs.gov.eg/'
    },
    {
      title: t.siteGafiTitle,
      description: t.siteGafiDesc,
      url: 'https://www.gafi.gov.eg/'
    },
    {
      title: t.siteExpolinkTitle,
      description: t.siteExpolinkDesc,
      url: 'https://expolink.org/'
    },
    {
      title: t.siteAecTitle,
      description: t.siteAecDesc,
      url: 'http://www.aecegypt.com/'
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
            {sites.map((site, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center gap-3 text-start">
                    {site.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2 text-base">
                  <p className="text-muted-foreground">{site.description}</p>
                   <Button asChild variant="outline">
                      <a href={site.url} target="_blank" rel="noopener noreferrer">
                        {t.visitSiteButton}
                        <ExternalLink className="ms-2 h-4 w-4" />
                      </a>
                   </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
