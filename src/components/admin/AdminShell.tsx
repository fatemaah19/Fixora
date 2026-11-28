'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ClipboardCheck, LayoutDashboard, LogOut, Menu, MessageSquareWarning, ShieldCheck, UsersRound, X } from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useAuth } from '@/contexts/AuthProvider';
import { useT } from '@/contexts/LanguageProvider';

const navItems = [
  { href: '/admin/dashboard', key: 'overview', icon: LayoutDashboard },
  { href: '/admin/workers', key: 'workers', icon: UsersRound },
  { href: '/admin/complaints', key: 'complaints', icon: MessageSquareWarning },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { language } = useT();
  const [menuOpen, setMenuOpen] = useState(false);
  const ur = language === 'ur';
  const labels = ur
    ? { overview: 'جائزہ', workers: 'کاریگروں کی درخواستیں', complaints: 'شکایات', section: 'ایڈمن پینل', admin: 'ایڈمن', logout: 'لاگ آؤٹ', menu: 'مینو کھولیں', close: 'مینو بند کریں' }
    : { overview: 'Overview', workers: 'Worker applications', complaints: 'Support complaints', section: 'ADMIN PANEL', admin: 'Administrator', logout: 'Log out', menu: 'Open menu', close: 'Close menu' };
  const activeLabel = pathname.startsWith('/admin/workers') ? labels.workers : pathname.startsWith('/admin/complaints') ? labels.complaints : labels.overview;

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  return <div dir={ur ? 'rtl' : 'ltr'} className="flex min-h-screen bg-[#090d18] text-white">
    {menuOpen && <button aria-label={labels.close} onClick={() => setMenuOpen(false)} className="fixed inset-0 z-40 bg-black/70 lg:hidden" />}
    <aside
      className={`fixed inset-y-0 z-50 flex w-[min(84vw,19rem)] flex-col border-white/[0.08] bg-[#0d1220] p-5 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:z-auto lg:w-72 lg:shrink-0 lg:translate-x-0 lg:border-e ${menuOpen ? 'translate-x-0' : ur ? 'translate-x-[105%]' : '-translate-x-[105%]'}`}
      style={{ insetInlineStart: 0 }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-5">
        <Link href="/admin/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan/20 bg-cyan/10 text-cyan"><ShieldCheck size={23} /></span>
          <span><strong className="block text-sm font-extrabold tracking-[0.12em]">FIXORA</strong><small className="text-[10px] text-white/45">{labels.admin}</small></span>
        </Link>
        <button onClick={() => setMenuOpen(false)} aria-label={labels.close} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white/65 lg:hidden"><X size={18} /></button>
      </div>
      <p className="mb-3 mt-7 px-3 text-[9px] font-bold tracking-[0.18em] text-cyan/70">{labels.section}</p>
      <nav className="grid gap-2">
        {navItems.map(({ href, key, icon: Icon }) => {
          const active = key === 'workers' ? pathname.startsWith(href) : pathname === href;
          return <Link key={href} href={href} onClick={() => setMenuOpen(false)} aria-current={active ? 'page' : undefined} className={`flex min-h-12 items-center gap-3 rounded-xl px-3 text-xs font-semibold transition ${active ? 'border border-cyan/20 bg-cyan/10 text-white' : 'text-white/55 hover:bg-white/[0.04] hover:text-white'}`}>
            <Icon size={17} className={active ? 'text-cyan' : ''} /><span>{labels[key as 'overview' | 'workers' | 'complaints']}</span>
          </Link>;
        })}
      </nav>
      <div className="mt-auto grid gap-3 border-t border-white/[0.08] pt-5">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.035] p-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-blue/15 text-blue"><ClipboardCheck size={16} /></span><span><strong className="block text-[11px]">{labels.admin}</strong><small className="text-[9px] text-white/40">{ur ? 'ڈیمو اکاؤنٹ' : 'Demo account'}</small></span></div>
        <button onClick={handleLogout} className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-xs font-semibold text-white/50 transition hover:bg-white/[0.04] hover:text-white"><LogOut size={16} />{labels.logout}</button>
      </div>
    </aside>
    <main className="min-h-screen min-w-0 flex-1 lg:ms-0">
      <header className="sticky top-0 z-30 flex min-h-[68px] items-center justify-between gap-3 border-b border-white/[0.07] bg-[#090d18]/90 px-4 backdrop-blur-xl sm:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={() => setMenuOpen(true)} aria-label={labels.menu} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 text-white/70 lg:hidden"><Menu size={19} /></button>
          <div className="truncate text-[10px] text-white/40 sm:text-xs"><span>FIXORA</span><span className="mx-2">/</span><strong className="text-white/80">{activeLabel}</strong></div>
        </div>
        <LanguageToggle />
      </header>
      <div className="mx-auto w-full max-w-[1440px] p-4 sm:p-6 lg:p-8">{children}</div>
    </main>
  </div>;
}
