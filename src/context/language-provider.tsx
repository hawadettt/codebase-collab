'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { translations, TranslationKeys } from '@/lib/i18n';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: Record<TranslationKeys, string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>('ar');

  const setLanguage = useCallback((langCode: string) => {
    if (langCode === 'en' || langCode === 'ar') {
      setLanguageState(langCode);
    }
  }, []);
  
  const t = useMemo(() => {
    return translations[language as 'en' | 'ar'] || translations.ar;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, setLanguage, t]);

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
