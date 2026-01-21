'use client';

import React, { useState, useRef } from "react";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Upload } from "lucide-react";
import { useLanguage } from "@/context/language-provider";

export function Header() {
  const { t } = useLanguage();
  const [logo, setLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogo(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };
  
  return (
    <header 
        className="sticky top-0 z-10 flex h-40 shrink-0 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6"
        style={{
            '--neon-glow-color': 'hsl(var(--primary))'
        } as React.CSSProperties}
    >
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <div className="hidden items-center gap-4 md:flex">
            <div 
                className="group relative h-24 w-24 cursor-pointer rounded-lg bg-primary/10 flex items-center justify-center" 
                onClick={handleLogoClick}
            >
                {logo ? (
                    <Image src={logo} alt="Company Logo" layout="fill" className="rounded-lg object-cover" />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center">
                        <Upload className="h-8 w-8 text-primary" />
                    </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Upload className="h-8 w-8 text-white" />
                </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

            <div>
                <h1 
                    className="font-body text-2xl font-bold text-primary drop-shadow-[0_0_8px_var(--neon-glow-color)] whitespace-nowrap"
                >
                    شركة مفتاح النيل للاستثمار والتجارة الدولية (ذ.م.م)
                </h1>
                <p className="font-headline text-base font-bold text-primary/90 tracking-[0.2em]">
                    Nile Key for Investment and International Trade LLC
                </p>
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
