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
  PlusCircle,
  Search,
  Database,
  Code,
  Shield,
  Landmark,
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
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
import { collection, query, orderBy } from "firebase/firestore";

const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
];

const iconComponents: { [key: string]: React.ReactNode } = {
  Globe: <Globe className="h-4 w-4" />,
  Shield: <Shield className="h-4 w-4" />,
  Search: <Search className="h-4 w-4" />,
  Database: <Database className="h-4 w-4" />,
  Code: <Code className="h-4 w-4" />,
  Briefcase: <Briefcase className="h-4 w-4" />,
  Building2: <Building2 className="h-4 w-4" />,
  Landmark: <Landmark className="h-4 w-4" />,
  Default: <ChevronRight className="h-4 w-4" />,
};

type SiteCategory = {
  id: string;
  title: string;
  icon: string;
}

export function AppSidebar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const pathname = usePathname();

  const customCategoriesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'users', user.uid, 'siteCategories'), orderBy('createdAt', 'asc'));
  }, [firestore, user]);

  const { data: customCategories } = useCollection<SiteCategory>(customCategoriesQuery);


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
            <div className="flex items-center gap-3 rounded-md border border-transparent p-2">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-28" />
                </div>
            </div>
            ) : user ? (
            <div className="flex items-center gap-3 rounded-md border border-sidebar-border/50 bg-sidebar-accent p-2">
                <Avatar className="h-9 w-9">
                {user?.photoURL && <AvatarImage src={user.photoURL} />}
                {!user?.photoURL && userAvatar && <AvatarImage src={userAvatar.imageUrl} data-ai-hint={userAvatar.imageHint} />}
                <AvatarFallback>{user?.email?.[0].toUpperCase() ?? 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-medium">{user?.displayName ?? t.sidebarUser}</span>
                <span className="truncate text-xs text-muted-foreground">{user?.email ?? "user@example.com"}</span>
                </div>
                <LogOut onClick={handleLogout} className="ms-auto h-5 w-5 flex-shrink-0 cursor-pointer text-muted-foreground hover:text-foreground" />
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
              <Collapsible defaultOpen={pathname.startsWith('/shipments')}>
                <CollapsibleTrigger asChild>
                   <SidebarMenuButton
                      isActive={pathname.startsWith('/shipments')}
                      size="sm"
                      className="w-full justify-between group"
                   >
                     <div className="flex items-center gap-2">
                        <Truck />
                        <span>{t.sidebarShipments}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                   </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-1">
                  <SidebarMenu className="pl-7">
                      <SidebarMenuItem>
                        <Link href="/shipments">
                          <SidebarMenuButton isActive={pathname === '/shipments'} size="sm">
                            <span>{t.sidebarViewAll}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <Link href="/shipments/new">
                          <SidebarMenuButton isActive={pathname === '/shipments/new'} size="sm">
                            <span>{t.sidebarAddNew}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Collapsible defaultOpen={pathname.startsWith('/suppliers')}>
                <CollapsibleTrigger asChild>
                   <SidebarMenuButton
                      isActive={pathname.startsWith('/suppliers')}
                      size="sm"
                      className="w-full justify-between group"
                   >
                     <div className="flex items-center gap-2">
                        <Building2 />
                        <span>{t.sidebarSuppliers}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                   </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-1">
                  <SidebarMenu className="pl-7">
                      <SidebarMenuItem>
                        <Link href="/suppliers">
                          <SidebarMenuButton isActive={pathname === '/suppliers'} size="sm">
                            <span>{t.sidebarViewAll}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <Link href="/suppliers/new">
                          <SidebarMenuButton isActive={pathname === '/suppliers/new'} size="sm">
                            <span>{t.sidebarAddNew}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Collapsible defaultOpen={pathname.startsWith('/customers')}>
                <CollapsibleTrigger asChild>
                   <SidebarMenuButton
                      isActive={pathname.startsWith('/customers')}
                      size="sm"
                      className="w-full justify-between group"
                   >
                     <div className="flex items-center gap-2">
                        <Users />
                        <span>{t.sidebarCustomers}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                   </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-1">
                  <SidebarMenu className="pl-7">
                      <SidebarMenuItem>
                        <Link href="/customers">
                          <SidebarMenuButton isActive={pathname === '/customers'} size="sm">
                            <span>{t.sidebarViewAll}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <Link href="/customers/new">
                          <SidebarMenuButton isActive={pathname === '/customers/new'} size="sm">
                            <span>{t.sidebarAddNew}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Collapsible defaultOpen={pathname.startsWith('/important-sites')}>
                <CollapsibleTrigger asChild>
                   <SidebarMenuButton
                      isActive={pathname.startsWith('/important-sites')}
                      size="sm"
                      className="w-full justify-between group"
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
                        <Link href="/important-sites/egyptian-government">
                          <SidebarMenuButton isActive={pathname === '/important-sites/egyptian-government'} size="sm">
                            <Landmark className="h-4 w-4" />
                            <span>{t.sitesCategoryEgyptianGovernment}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <Link href="/important-sites/sovereign">
                          <SidebarMenuButton isActive={pathname === '/important-sites/sovereign'} size="sm">
                            <Shield className="h-4 w-4" />
                            <span>{t.sitesCategorySovereign}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <Link href="/important-sites/logistics">
                          <SidebarMenuButton isActive={pathname === '/important-sites/logistics'} size="sm">
                            <Search className="h-4 w-4" />
                            <span>{t.sitesCategoryLogistics}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <Link href="/important-sites/market-intel">
                          <SidebarMenuButton isActive={pathname === '/important-sites/market-intel'} size="sm">
                            <Database className="h-4 w-4" />
                            <span>{t.sitesCategoryMarketIntel}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <Link href="/important-sites/technical">
                          <SidebarMenuButton isActive={pathname === '/important-sites/technical'} size="sm">
                            <Code className="h-4 w-4" />
                            <span>{t.sitesCategoryTechnical}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                      {customCategories && customCategories.map(category => (
                        <SidebarMenuItem key={category.id}>
                            <Link href={`/important-sites/${category.id}`}>
                              <SidebarMenuButton isActive={pathname === `/important-sites/${category.id}`} size="sm">
                                  {iconComponents[category.icon] || iconComponents.Default}
                                  <span>{category.title}</span>
                              </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                      ))}
                      <SidebarMenuItem>
                        <Link href="/important-sites/new">
                          <SidebarMenuButton isActive={pathname === '/important-sites/new'} size="sm">
                            <PlusCircle className="h-4 w-4" />
                            <span>{t.sidebarAddNewCategory}</span>
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
