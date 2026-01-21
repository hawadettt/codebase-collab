'use client';

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Leaf } from "lucide-react";
import { useLanguage } from "@/context/language-provider";

export function Header() {
  const { t } = useLanguage();
  
  return (
    <header className="sticky top-0 z-10 flex h-20 shrink-0 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <div className="hidden items-center gap-3 md:flex">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 ">
              <Leaf className="h-7 w-7 text-primary" />
            </div>
            <div>
                <h1 className="font-headline text-base font-bold text-foreground md:text-lg">
                    شركة مفتاح النيل للاستثمار والتجارة الدولية (ذ.م.م)
                </h1>
                <p className="text-sm text-muted-foreground">Nile Key for Investment and International Trade LLC</p>
            </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">{t.headerNotifications}</span>
        </Button>
      </div>
    </header>
  );
}
