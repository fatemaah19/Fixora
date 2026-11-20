'use client';

import { useT } from '@/contexts/LanguageProvider';

export function Logo({ compact = false }: { compact?: boolean }) {
  const { t } = useT();
  return <div className="flex items-center gap-3" aria-label="Fixora">
    <svg viewBox="0 0 52 52" className="h-12 w-12 shrink-0" role="img" aria-label="Fixora house and wrench logo">
      <defs><linearGradient id="fixora-mark" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="var(--fx-cyan)"/><stop offset="1" stopColor="var(--fx-blue)"/></linearGradient></defs>
      <path d="M7 23 26 8l19 15v21H7Z" fill="none" stroke="url(#fixora-mark)" strokeWidth="3.2" strokeLinejoin="round"/>
      <path d="M18 43V29h16v14" fill="none" stroke="var(--fx-orange)" strokeWidth="3" strokeLinejoin="round"/>
      <path d="m31 13 4-4 5 5-4 4-3-1-9 9-3-3 9-9Z" fill="var(--fx-cyan)"/>
    </svg>
    {!compact && <div className="leading-tight"><div className="font-display text-2xl font-bold tracking-tight">Fixora</div><div className="font-urdu text-sm text-muted">{t('brand.name')}</div></div>}
  </div>;
}
