
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Share2, Bell } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function Header() {
  const { isMobile } = useSidebar();
  
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-headline text-lg font-semibold md:text-xl">
          لوحة تحكم الشحنات
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm">
          <Share2 className="ml-2 h-4 w-4" />
          مشاركة
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">الإشعارات</span>
        </Button>
      </div>
    </header>
  );
}
