'use client';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, House, UserRound } from 'lucide-react';
import { TopBar } from '@/components/TopBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { useT } from '@/contexts/LanguageProvider';
export default function SignupPage() {
  const { t, language } = useT(); const rtl = language === 'ur';
  const cards = [
    {href:'/signup/user', title:t('signup.userTitle'), description:t('signup.userDescription'), icon:House, accent:'text-cyan', bg:'bg-cyan/10'},
    {href:'/signup/worker', title:t('signup.workerTitle'), description:t('signup.workerDescription'), icon:BriefcaseBusiness, accent:'text-orange', bg:'bg-orange/10'},
  ];
  return <main className="min-h-screen px-4 py-5 sm:px-8 sm:py-8"><div className="mx-auto max-w-5xl"><TopBar/><div className="mx-auto max-w-3xl py-14"><div className="mb-10 text-center"><div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue/15 text-cyan"><UserRound size={32}/></div><h1 className="text-3xl font-bold sm:text-4xl">{t('signup.title')}</h1><p className="mt-3 text-muted">{t('signup.subtitle')}</p></div><div className="grid gap-5 sm:grid-cols-2">{cards.map(({href,title,description,icon:Icon,accent,bg})=><Link key={href} href={href} className="group focus-visible:outline-none"><GlassCard className="h-full min-h-64 transition duration-200 group-hover:-translate-y-1 group-hover:border-cyan/40 group-hover:bg-white/10 group-focus-visible:ring-2 group-focus-visible:ring-cyan"><div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${bg} ${accent}`}><Icon size={34}/></div><h2 className="text-2xl font-bold">{title}</h2><p className="mt-3 leading-8 text-muted">{description}</p><div className="mt-7 flex justify-end text-cyan">{rtl?<ArrowLeft/>:<ArrowRight/>}</div></GlassCard></Link>)}</div><p className="mt-8 text-center text-sm text-muted">{t('signup.already')} <Link href="/login" className="font-bold text-cyan hover:underline">{t('signup.login')}</Link></p></div></div></main>;
}
