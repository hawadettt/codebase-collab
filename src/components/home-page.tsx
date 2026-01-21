'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-provider";
import { Ship, Plane, Truck, FileBadge2, Warehouse, ShieldCheck } from "lucide-react";
import { SidebarProvider } from "./ui/sidebar";
import { Header } from "./layout/header";
import { AppSidebar } from "./layout/app-sidebar";

export function HomePage() {
  const { t } = useLanguage();

  const services = [
    {
      title: t.serviceSeaFreightTitle,
      description: t.serviceSeaFreightDesc,
      icon: <Ship className="h-5 w-5 text-primary" />
    },
    {
      title: t.serviceAirFreightTitle,
      description: t.serviceAirFreightDesc,
      icon: <Plane className="h-5 w-5 text-primary" />
    },
    {
      title: t.serviceLandFreightTitle,
      description: t.serviceLandFreightDesc,
      icon: <Truck className="h-5 w-5 text-primary" />
    },
    {
      title: t.serviceCustomsTitle,
      description: t.serviceCustomsDesc,
      icon: <FileBadge2 className="h-5 w-5 text-primary" />
    },
    {
      title: t.serviceStorageTitle,
      description: t.serviceStorageDesc,
      icon: <Warehouse className="h-5 w-5 text-primary" />
    },
    {
      title: t.serviceDocsTitle,
      description: t.serviceDocsDesc,
      icon: <ShieldCheck className="h-5 w-5 text-primary" />
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-3xl">{t.homeTitle}</CardTitle>
                  <CardDescription className="text-base">{t.homeDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {services.map((service, index) => (
                      <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-lg">
                          <div className="flex items-center gap-3">
                            {service.icon}
                            <span>{service.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 text-base text-muted-foreground">
                          {service.description}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
