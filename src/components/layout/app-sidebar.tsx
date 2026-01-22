"use client";

import Link from "next/link";
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
  Home,
  Truck,
  LayoutDashboard,
  Settings,
  LogOut,
  LogIn,
  Users,
  Building2,
  Briefcase,
  Globe,
  ChevronRight,
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/language-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
];

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
        <div className="flex flex-col gap-2">
            <div className="px-2 text-xs font-medium text-muted-foreground">{t.chooseLanguage}</div>
            <div className="px-2">
              <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'ar')}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder={t.chooseLanguage} />
                  </SelectTrigger>
                  <SelectContent align="center">
                      {supportedLanguages.map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
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
                  <Home />
                  <span>{t.sidebarHome}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/services">
                <SidebarMenuButton isActive={pathname === '/services'} size="sm">
                  <Briefcase />
                  <span>{t.sidebarServices}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard">
                <SidebarMenuButton isActive={pathname === '/dashboard'} size="sm">
                  <LayoutDashboard />
                  <span>{t.sidebarDashboard}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/shipments">
                <SidebarMenuButton isActive={pathname === '/shipments'} size="sm">
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
            <SidebarMenuItem>
              <Collapsible defaultOpen={pathname.startsWith('/important-sites')}>
                <CollapsibleTrigger className="w-full group">
                   <SidebarMenuButton
                      isActive={pathname.startsWith('/important-sites')}
                      size="sm"
                      className="justify-between"
                      asChild={false}
                   >
                     <div className="flex items-center gap-2">
                        <Globe />
                        <span>{t.sidebarImportantSites}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                   </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-1">
                  <SidebarMenu className="pl-7">
                      <SidebarMenuItem>
                        <Link href="/important-sites/sovereign">
                          <SidebarMenuButton isActive={pathname === '/important-sites/sovereign'} size="sm">
                            <span>{t.sitesCategorySovereign}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <Link href="/important-sites/logistics">
                          <SidebarMenuButton isActive={pathname === '/important-sites/logistics'} size="sm">
                            <span>{t.sitesCategoryLogistics}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <Link href="/important-sites/market-intel">
                          <SidebarMenuButton isActive={pathname === '/important-sites/market-intel'} size="sm">
                            <span>{t.sitesCategoryMarketIntel}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <Link href="/important-sites/technical">
                          <SidebarMenuButton isActive={pathname === '/important-sites/technical'} size="sm">
                            <span>{t.sitesCategoryTechnical}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/settings">
              <SidebarMenuButton isActive={pathname === '/settings'} size="sm">
                <Settings />
                <span>{t.sidebarSettings}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
