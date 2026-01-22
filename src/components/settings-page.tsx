'use client';

import { useTheme } from "@/context/theme-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/context/language-provider";
import { Languages, Settings, User, Mail, Phone, Globe, AlertTriangle, Edit, MapPin, Loader2, Briefcase, Tag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useUser, useFirestore, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, updateDoc, DocumentReference } from 'firebase/firestore';
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { useState } from "react";
import { EditProfileFieldDialog } from "./edit-profile-field-dialog";
import { countries } from "@/lib/countries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useToast } from "@/hooks/use-toast";

type UserProfile = {
    userName?: string;
    companyName?: string;
    companyType?: string;
    email?: string;
    whatsapp?: string;
    mobile?: string;
    country?: string;
    gpsLocation?: string;
};

export function SettingsPage() {
  const { setTheme, theme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [editingField, setEditingField] = useState<'userName' | 'companyName' | 'whatsapp' | 'mobile' | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid) as DocumentReference<UserProfile>;
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);
  
  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    if (!userProfileRef) {
      toast({ variant: 'destructive', title: t.profileUpdateFailed, description: "User not authenticated." });
      return Promise.reject(new Error("User not authenticated."));
    }
    setIsUpdating(true);
    try {
      await updateDoc(userProfileRef, data);
      toast({ title: t.profileUpdatedSuccess });
    } catch (error: any) {
      console.error("Profile update failed:", error);
      
      const permissionError = new FirestorePermissionError({
        path: userProfileRef.path,
        operation: 'update',
        requestResourceData: data,
      });
      errorEmitter.emit('permission-error', permissionError);

      toast({
        variant: "destructive",
        title: t.profileUpdateFailed,
        description: error.message || t.profileUpdateError,
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getCountryFlag = (countryName?: string) => {
    const country = countries.find(c => c.name === countryName);
    return country ? country.flag : '🏳️';
  }

  const companyTypes = [
    { value: 'Exporter', label: t.companyTypeExporter },
    { value: 'Importer', label: t.companyTypeImporter },
    { value: 'Freight Forwarder', label: t.companyTypeFreightForwarder },
    { value: 'Producer/Farm', label: t.companyTypeProducerFarm },
    { value: 'Other', label: t.companyTypeOther },
  ];

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
                  className="flex h-10 cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
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
                  className="flex h-10 cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
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
              <div>
                <RadioGroupItem value="en" id="en" className="peer sr-only" />
                <Label
                  htmlFor="en"
                  className="flex h-10 cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  English
                </Label>
              </div>
              <div>
                <RadioGroupItem value="ar" id="ar" className="peer sr-only" />
                <Label
                  htmlFor="ar"
                  className="flex h-10 cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  العربية
                </Label>
              </div>
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
                    <div className="flex items-center gap-4"><Skeleton className="h-6 w-6 rounded-full" /><div className="w-full space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-40" /></div></div>
                    <div className="flex items-center gap-4"><Skeleton className="h-6 w-6 rounded-full" /><div className="w-full space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-40" /></div></div>
                    <div className="flex items-center gap-4"><Skeleton className="h-6 w-6 rounded-full" /><div className="w-full space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-40" /></div></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                        <div className="flex items-center">
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <Label>{t.formUserNameLabel}</Label>
                            </div>
                            <div className="ml-auto">
                                <Button variant="ghost" size="icon" onClick={() => setEditingField('userName')} disabled={isUpdating}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="pl-7 text-sm text-muted-foreground">{userProfile?.userName || t.userDataNotSet}</p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-muted-foreground" />
                                <Label>{t.formCompanyNameLabel}</Label>
                            </div>
                            <div className="ml-auto">
                                <Button variant="ghost" size="icon" onClick={() => setEditingField('companyName')} disabled={isUpdating}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="pl-7 text-sm text-muted-foreground">{userProfile?.companyName || t.userDataNotSet}</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Tag className="h-5 w-5 text-muted-foreground" />
                            <Label>{t.formCompanyTypeLabel}</Label>
                        </div>
                        <div className="pl-7">
                            <Select
                              value={userProfile?.companyType || ''}
                              onValueChange={async (value) => {
                                try { await handleUpdateProfile({ companyType: value }) } catch (e) { /* error handled in function */ }
                              }}
                              disabled={isUpdating}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={t.selectCompanyTypePlaceholder}>
                                    {isUpdating ? <Loader2 className="mx-2 h-4 w-4 animate-spin" /> : (companyTypes.find(c => c.value === userProfile?.companyType)?.label || userProfile?.companyType || t.userDataNotSet)}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {companyTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-muted-foreground" />
                            <Label>{t.formCountry}</Label>
                        </div>
                        <div className="pl-7">
                            <Select
                              value={userProfile?.country || ''}
                              onValueChange={async (value) => {
                                try { await handleUpdateProfile({ country: value }) } catch (e) { /* error handled in function */ }
                              }}
                              disabled={isUpdating}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={t.selectCountry}>
                                  <div className="flex items-center gap-2">
                                     {isUpdating ? <Loader2 className="mx-2 h-4 w-4 animate-spin" /> : <span>{getCountryFlag(userProfile?.country)}</span>}
                                     <span>{userProfile?.country || t.userDataNotSet}</span>
                                  </div>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country.code} value={country.name}>
                                    <div className="flex items-center gap-2">
                                      <span>{country.flag}</span>
                                      <span>{country.name} ({country.dial_code})</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center">
                            <div className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <Label>{t.formMobileLabel}</Label>
                            </div>
                            <div className="ml-auto">
                                <Button variant="ghost" size="icon" onClick={() => setEditingField('mobile')} disabled={isUpdating}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="pl-7 text-sm text-muted-foreground">{userProfile?.mobile || t.userDataNotSet}</p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center">
                            <div className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <Label>{t.formWhatsapp}</Label>
                            </div>
                             <div className="ml-auto">
                                <Button variant="ghost" size="icon" onClick={() => setEditingField('whatsapp')} disabled={isUpdating}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="pl-7 text-sm text-muted-foreground">{userProfile?.whatsapp || t.userDataNotSet}</p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <Label>{t.formEmailLabel}</Label>
                        </div>
                        <p className="pl-7 text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    
                    <Card className="flex flex-col items-center justify-center p-6 bg-muted/50 h-48">
                        <MapPin className="h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">{t.mapPlaceholderTitle}</p>
                        <p className="text-sm text-muted-foreground">{t.mapPlaceholderDescription}</p>
                    </Card>
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
      
      <EditProfileFieldDialog
        fieldName={editingField}
        currentValue={editingField ? userProfile?.[editingField] : ''}
        isOpen={!!editingField}
        onClose={() => setEditingField(null)}
        onSave={handleUpdateProfile}
      />
    </div>
  );
}
