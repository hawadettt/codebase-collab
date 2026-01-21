
"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Truck,
  LayoutDashboard,
  Settings,
  LogOut,
  LogIn,
  Users,
  Building2
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/language-provider";
import { Separator } from "@/components/ui/separator";

const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

export function AppSidebar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: t.logoutSuccessTitle,
        description: t.logoutSuccessDescription,
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        variant: "destructive",
        title: t.logoutFailTitle,
        description: t.logoutFailDescription,
      });
    }
  };

  return (
    <Sidebar side={language === 'ar' ? 'right' : 'left'}>
      <SidebarHeader>
        <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-1 text-center">
                <div className="text-xs font-medium text-muted-foreground">{t.chooseLanguage}</div>
                <div className="flex items-center rounded-md border bg-background/50 p-1">
                    <Button variant={language === 'en' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setLanguage('en')}>English</Button>
                    <Separator orientation="vertical" className="h-4" />
                    <Button variant={language === 'ar' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setLanguage('ar')}>العربية</Button>
                </div>
            </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <div className="p-2">
        {isUserLoading ? (
            <div className="flex items-center gap-3 px-2 py-2">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-28" />
                </div>
            </div>
            ) : user ? (
            <div className="flex items-center gap-3 px-2 py-2">
                <Avatar className="h-9 w-9">
                {user?.photoURL && <AvatarImage src={user.photoURL} />}
                {!user?.photoURL && userAvatar && <AvatarImage src={userAvatar.imageUrl} data-ai-hint={userAvatar.imageHint} />}
                <AvatarFallback>{user?.email?.[0].toUpperCase() ?? 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.displayName ?? t.sidebarUser}</span>
                <span className="text-xs text-muted-foreground">{user?.email ?? "user@example.com"}</span>
                </div>
                <LogOut onClick={handleLogout} className="ms-auto h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground" />
            </div>
            ) : (
            <div className="px-2 py-2">
                <Link href="/login" passHref>
                <Button className="w-full">
                    <LogIn className="mx-2 h-4 w-4" />
                    {t.sidebarLoginButton}
                </Button>
                </Link>
            </div>
        )}
      </div>
      <SidebarSeparator />
      <SidebarContent className="p-2">
        <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/">
                <SidebarMenuButton isActive={pathname === '/'} size="sm">
                  <LayoutDashboard />
                  <span>{t.sidebarDashboard}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/">
                <SidebarMenuButton isActive={pathname === '/'} size="sm">
                  <Truck />
                  <span>{t.sidebarShipments}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/suppliers">
                <SidebarMenuButton isActive={pathname === '/suppliers'} size="sm">
                  <Building2 />
                  <span>{t.sidebarSuppliers}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/customers">
                <SidebarMenuButton isActive={pathname === '/customers'} size="sm">
                  <Users />
                  <span>{t.sidebarCustomers}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm">
              <Settings />
              <span>{t.sidebarSettings}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
