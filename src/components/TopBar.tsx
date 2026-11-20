import Link from 'next/link';
import { Logo } from './Logo';
import { LanguageToggle } from './LanguageToggle';
export function TopBar() { return <header className="relative z-10 flex w-full items-center justify-between gap-3"><Link href="/login" aria-label="Fixora home"><Logo /></Link><LanguageToggle /></header>; }
