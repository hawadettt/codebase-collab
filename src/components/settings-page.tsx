'use client';

import { useTheme } from "@/context/theme-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/context/language-provider";
import { Languages, Settings, User, Mail, Phone, Globe, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
];

export function SettingsPage() {
  const { setTheme, theme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Settings className="h-6 w-6" />
            {t.settingsTitle}
          </CardTitle>
          <CardDescription>{t.settingsDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-semibold">{t.settingsThemeTitle}</h3>
            <RadioGroup
              value={theme}
              onValueChange={setTheme}
              className="grid max-w-md grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="light" id="light" className="peer sr-only" />
                <Label
                  htmlFor="light"
                  className="flex h-12 cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                   <div className="flex items-center justify-center rounded-md bg-background text-foreground">
                    {t.settingsThemeLight}
                  </div>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                <Label
                  htmlFor="dark"
                  className="flex h-12 cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex items-center justify-center rounded-md bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark">
                    {t.settingsThemeDark}
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator/>

          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  {t.settingsLanguageTitle}
                </h3>
            </div>
            <RadioGroup
              value={language}
              onValueChange={(value) => setLanguage(value as 'en' | 'ar')}
              className="grid max-w-md grid-cols-2 gap-4"
            >
               {supportedLanguages.map(lang => (
                <div key={lang.code}>
                    <RadioGroupItem value={lang.code} id={lang.code} className="peer sr-only" />
                    <Label
                    htmlFor={lang.code}
                    className="flex h-12 cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                    {lang.name}
                    </Label>
                </div>
                ))}
            </RadioGroup>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                {t.settingsUserDataTitle}
              </h3>
              <p className="text-sm text-muted-foreground">{t.settingsUserDataDescription}</p>
            </div>
            
            {isUserLoading ? (
              <div className="space-y-4 rounded-md border p-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-8 w-2/3" />
              </div>
            ) : user ? (
              <div className="rounded-md border p-4">
                {isProfileLoading ? (
                   <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <div className="w-full space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-40" /></div>
                    </div>
                     <div className="flex items-center gap-4">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <div className="w-full space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-40" /></div>
                    </div>
                     <div className="flex items-center gap-4">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <div className="w-full space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-40" /></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <User className="h-5 w-5 text-muted-foreground mt-1" />
                        <div className="flex-1">
                            <Label>{t.formUserNameLabel}</Label>
                            <p className="text-sm">{userProfile?.userName || user.displayName || t.userDataNotSet}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Mail className="h-5 w-5 text-muted-foreground mt-1" />
                        <div className="flex-1">
                            <Label>{t.formEmailLabel}</Label>
                            <p className="text-sm">{user.email}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Phone className="h-5 w-5 text-muted-foreground mt-1" />
                        <div className="flex-1">
                            <Label>{t.formWhatsapp}</Label>
                            <p className="text-sm">{userProfile?.whatsapp || t.userDataNotSet}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Phone className="h-5 w-5 text-muted-foreground mt-1" />
                        <div className="flex-1">
                            <Label>{t.formMobileLabel}</Label>
                            <p className="text-sm">{userProfile?.mobile || t.userDataNotSet}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Globe className="h-5 w-5 text-muted-foreground mt-1" />
                        <div className="flex-1">
                            <Label>{t.formCountry}</Label>
                            <p className="text-sm">{userProfile?.country || t.userDataNotSet}</p>
                        </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 rounded-md border p-6 text-center">
                <AlertTriangle className="h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">{t.loginToViewProfile}</p>
                <Button asChild size="sm" className="mt-2">
                  <a href="/login">{t.sidebarLoginButton}</a>
                </Button>
              </div>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
