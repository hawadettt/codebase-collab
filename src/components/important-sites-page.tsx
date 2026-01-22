'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-provider";
import { ExternalLink, Globe } from "lucide-react";

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
        <CardContent className="grid gap-6">
          {sites.map((site, index) => (
            <a 
              key={index} 
              href={site.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{site.title}</span>
                  <ExternalLink className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{site.description}</p>
              </CardContent>
            </a>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
