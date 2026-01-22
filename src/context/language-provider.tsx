'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { translations, TranslationKeys } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { translateText } from '@/ai/flows/translate-text';

type AiTranslationsCache = {
  [langCode: string]: Record<TranslationKeys, string> | undefined;
};

// Map language codes to their English names for the AI prompt
const languageNames: { [key: string]: string } = {
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  ru: 'Russian',
  zh: 'Chinese',
  ja: 'Japanese',
  pt: 'Portuguese',
  hi: 'Hindi',
};

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: Record<TranslationKeys, string>;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>('ar');
  const [isTranslating, setIsTranslating] = useState(false);
  const [aiTranslationsCache, setAiTranslationsCache] = useState<AiTranslationsCache>({});
  const { toast } = useToast();

  const setLanguage = useCallback(async (langCode: string) => {
    // If it's a built-in language, just switch
    if (langCode === 'en' || langCode === 'ar') {
      setLanguageState(langCode);
      return;
    }

    // If it's an AI-translated language that's already in cache, switch
    if (aiTranslationsCache[langCode]) {
      setLanguageState(langCode);
      return;
    }
    
    // If it's a new AI language, perform translation
    const targetLanguageName = languageNames[langCode];
    if (!targetLanguageName) {
      console.error(`Unsupported AI language code: ${langCode}`);
      toast({
        variant: "destructive",
        title: "Unsupported Language",
        description: "The selected language is not supported for AI translation.",
      });
      return;
    }

    setIsTranslating(true);
    try {
      const result = await translateText({
        content: translations.en,
        targetLanguage: targetLanguageName,
      });
      
      setAiTranslationsCache(prevCache => ({
        ...prevCache,
        [langCode]: result as Record<TranslationKeys, string>,
      }));
      setLanguageState(langCode);

    } catch (error) {
      console.error("AI translation failed:", error);
      toast({
        variant: "destructive",
        title: "AI Translation Failed",
        description: "Could not translate content. Falling back to previous language.",
      });
      // Don't change the language state on failure
    } finally {
      setIsTranslating(false);
    }
  }, [aiTranslationsCache, toast]);
  
  const t = useMemo(() => {
    if (language === 'en' || language === 'ar') {
      return translations[language];
    }
    return aiTranslationsCache[language] || translations.en; // Fallback to English if translation not ready
  }, [language, aiTranslationsCache]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
    isTranslating
  }), [language, setLanguage, t, isTranslating]);

  return (
    <LanguageContext.Provider value={value}>
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
