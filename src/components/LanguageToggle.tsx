'use client';
import { Languages } from 'lucide-react';
import { useT } from '@/contexts/LanguageProvider';
export function LanguageToggle() {
  const { language, setLanguage, t } = useT();
  return <div className="inline-flex min-h-12 items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] p-1" aria-label="Language selector">
    <Languages className="ms-2 h-4 w-4 text-cyan" aria-hidden="true" />
    <button type="button" onClick={() => setLanguage('en')} aria-pressed={language === 'en'} className={`min-h-10 rounded-full px-3 text-sm font-semibold transition ${language === 'en' ? 'bg-blue text-white' : 'text-muted hover:text-white'}`}>{t('common.english')}</button>
    <button type="button" onClick={() => setLanguage('ur')} aria-pressed={language === 'ur'} className={`min-h-10 rounded-full px-3 text-sm font-semibold transition ${language === 'ur' ? 'bg-blue text-white' : 'text-muted hover:text-white'}`}>{t('common.urdu')}</button>
  </div>;
}
