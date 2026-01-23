'use client';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-provider";
import { Book, Star, Landmark, FileText, CheckCircle, Ship } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function ExportersGuidePageContent() {
  const { t } = useLanguage();

  const guideSections = [
    {
      title: t.guideIntroTitle,
      content: t.guideIntroContent,
      icon: <Star className="h-5 w-5 text-primary" />
    },
    {
      title: t.guideCodificationTitle,
      content: t.guideCodificationContent,
      icon: <Landmark className="h-5 w-5 text-primary" />
    },
    {
      title: t.guideDocumentsTitle,
      content: t.guideDocumentsContent,
      icon: <FileText className="h-5 w-5 text-primary" />
    },
    {
      title: t.guideNafezaTitle,
      content: t.guideNafezaContent,
      icon: <CheckCircle className="h-5 w-5 text-primary" />
    },
    {
      title: t.guideStandardsTitle,
      content: t.guideStandardsContent,
      icon: <Star className="h-5 w-5 text-primary" />
    },
    {
      title: t.guideLogisticsTitle,
      content: t.guideLogisticsContent,
      icon: <Ship className="h-5 w-5 text-primary" />
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Book className="h-6 w-6" /> {t.exportersGuideTitle}
        </CardTitle>
        <CardDescription>{t.exportersGuideDescription}</CardDescription>
      </CardHeader>
      <CardContent>
         <Accordion type="single" collapsible className="w-full">
          {guideSections.map((section, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-lg">
                <div className="flex items-center gap-3 text-start">
                  {section.icon}
                  <span>{section.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 text-base text-muted-foreground whitespace-pre-line">
                {section.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}


export default function ExportersGuidePage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <ExportersGuidePageContent />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
