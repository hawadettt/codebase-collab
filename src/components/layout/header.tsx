
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Share2, Bell } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const collabAvatars = [
  PlaceHolderImages.find(img => img.id === 'collab1'),
  PlaceHolderImages.find(img => img.id === 'collab2'),
  PlaceHolderImages.find(img => img.id === 'collab3'),
].filter(Boolean);

export function Header() {
  const { isMobile } = useSidebar();
  
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-headline text-lg font-semibold md:text-xl">
          {isMobile ? "app.tsx" : "File: /src/components/app.tsx"}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2 overflow-hidden">
            {collabAvatars.map((avatar, index) => avatar && (
              <Avatar key={index} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={avatar.imageUrl} data-ai-hint={avatar.imageHint} />
                  <AvatarFallback>{`C${index + 1}`}</AvatarFallback>
              </Avatar>
            ))}
        </div>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  );
}
