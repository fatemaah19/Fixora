'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import ur from '@/locales/ur.json';
import en from '@/locales/en.json';
import type { Language } from '@/lib/types';

type Dictionary = typeof ur;
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: (key: string) => string };
const dictionaries: Record<Language, Dictionary> = { ur, en: en as Dictionary };
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ur');
  useEffect(() => {
    const saved = localStorage.getItem('fixora-language');
    if (saved === 'ur' || saved === 'en') setLanguageState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.dataset.language = language;
  }, [language]);
  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    localStorage.setItem('fixora-language', next);
  }, []);
  const t = useCallback((key: string) => {
    const value = key.split('.').reduce<unknown>((node, part) => node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined, dictionaries[language]);
    return typeof value === 'string' ? value : key;
  }, [language]);
  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useT() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useT must be used within LanguageProvider');
  return context;
}
