'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { translations, TranslationKeys } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { translateText } from '@/ai/flows/translate-text';

type Language = 'ar' | 'en' | 'ai';

type AiTranslationsCache = {
  [langCode: string]: Record<TranslationKeys, string> | undefined;
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Record<TranslationKeys, string>;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');
  const [isTranslating, setIsTranslating] = useState(false);
  const [aiTranslationsCache, setAiTranslationsCache] = useState<AiTranslationsCache>({});
  const { toast } = useToast();

  const handleSetLanguage = async (lang: Language) => {
    if (lang === 'ai') {
      const browserLang = navigator.language.split('-')[0] || 'en';

      if (aiTranslationsCache[browserLang]) {
        setLanguageState('ai');
        return;
      }
      
      setIsTranslating(true);
      try {
        const targetLanguageName = new Intl.DisplayNames(['en'], { type: 'language' }).of(browserLang);
        if (!targetLanguageName) {
          throw new Error(`Could not determine language name for code: ${browserLang}`);
        }

        const result = await translateText({
          content: translations.en,
          targetLanguage: targetLanguageName,
        });
        
        setAiTranslationsCache(prevCache => ({
          ...prevCache,
          [browserLang]: result as Record<TranslationKeys, string>,
        }));
        setLanguageState('ai');

      } catch (error) {
        console.error("AI translation failed:", error);
        toast({
          variant: "destructive",
          title: "AI Translation Failed",
          description: "Could not translate content. Falling back to English.",
        });
        setLanguageState('en');
      } finally {
        setIsTranslating(false);
      }
    } else {
      setLanguageState(lang);
    }
  };
  
  const t = useMemo(() => {
    if (language === 'ai') {
      // This is safe because `language` is only set to 'ai' on the client side.
      // To be extra safe and avoid hydration mismatches, we ensure this only runs on the client.
      if (typeof window !== 'undefined') {
        const browserLang = navigator.language.split('-')[0] || 'en';
        return aiTranslationsCache[browserLang] || translations.en;
      }
      // For SSR, if language was 'ai' for some reason, fallback to a default.
      return translations.ar;
    }
    return translations[language] || translations.ar;
  }, [language, aiTranslationsCache]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
