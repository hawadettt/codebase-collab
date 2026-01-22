'use client';

import { useTheme } from "@/context/theme-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/context/language-provider";
import { Languages, Settings } from "lucide-react";

const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
];

export function SettingsPage() {
  const { setTheme, theme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

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
              onValueChange={(value) => setTheme(value as any)}
              className="grid max-w-md grid-cols-2 gap-4 md:grid-cols-3"
            >
              <div>
                <RadioGroupItem value="light" id="light" className="peer sr-only" />
                <Label
                  htmlFor="light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                   <div className="flex h-16 w-full items-center justify-center rounded-md bg-background text-foreground">
                    {t.settingsThemeLight}
                  </div>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                <Label
                  htmlFor="dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex h-16 w-full items-center justify-center rounded-md bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark">
                    {t.settingsThemeDark}
                  </div>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="system" id="system" className="peer sr-only" />
                <Label
                  htmlFor="system"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex h-16 w-full items-center justify-center rounded-md bg-sidebar text-sidebar-foreground">
                    {t.settingsThemeSystem}
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  {t.settingsLanguageTitle}
                </h3>
            </div>
            <RadioGroup
              value={language}
              onValueChange={(value) => setLanguage(value)}
              className="grid max-w-md grid-cols-2 gap-4"
            >
               {supportedLanguages.map(lang => (
                <div key={lang.code}>
                    <RadioGroupItem value={lang.code} id={lang.code} className="peer sr-only" />
                    <Label
                    htmlFor={lang.code}
                    className="flex h-12 items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                    {lang.name}
                    </Label>
                </div>
                ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
