'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowUpLeft, ArrowUpRight, Banknote, Bell, BriefcaseBusiness, CalendarDays,
  Check, CheckCircle2, Clock3, Droplets, Hammer, MapPin, Menu, Snowflake,
  Star, TrendingUp, Wrench, X, Zap, type LucideIcon,
} from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthProvider';
import { useT } from '@/contexts/LanguageProvider';

type IconComponent = LucideIcon;
type Trade = 'ac' | 'electrician' | 'plumber' | 'carpenter';
type JobStatus = 'upcoming' | 'inProgress' | 'completed';

const tradeIcons: Record<Trade, IconComponent> = {
  ac: Snowflake,
  electrician: Zap,
  plumber: Droplets,
  carpenter: Hammer,
};

const jobs: { id: string; trade: Trade; title: string; customer: string; area: string; time: string; status: JobStatus }[] = [
  { id: 'J-1042', trade: 'ac', title: 'AC service and cooling check', customer: 'Ahmed Raza', area: 'Gulgasht', time: '09:30', status: 'inProgress' },
  { id: 'J-1048', trade: 'electrician', title: 'Ceiling fan installation', customer: 'Fatima Noor', area: 'Model Town', time: '12:00', status: 'upcoming' },
  { id: 'J-1051', trade: 'plumber', title: 'Kitchen tap repair', customer: 'Ali Hassan', area: 'Bosan Road', time: '15:30', status: 'upcoming' },
];

const initialRequests: { id: string; trade: Trade; title: string; area: string; distance: string; price: string; time: string }[] = [
  { id: 'R-208', trade: 'electrician', title: 'Install two ceiling lights', area: 'Multan Cantt', distance: '2.4 km', price: 'PKR 2,500', time: '20 min ago' },
  { id: 'R-211', trade: 'ac', title: 'AC making unusual noise', area: 'Shah Rukn-e-Alam', distance: '4.1 km', price: 'PKR 3,000', time: '45 min ago' },
];

const ur = {
  title: 'ورکر ڈیش بورڈ', overview: 'آج کا خلاصہ', greeting: 'السلام علیکم، عثمان!', subtitle: 'آج آپ کے لیے یہ کام اور مواقع موجود ہیں۔',
  online: 'آن لائن', offline: 'آف لائن', available: 'آپ نئے کام کی درخواستیں وصول کر رہے ہیں', unavailable: 'آپ کو فی الحال نئی درخواستیں نہیں ملیں گی',
  todayJobs: 'آج کے کام', weekJobs: 'اس ہفتے مکمل', rating: 'آپ کی ریٹنگ', requests: 'نئی درخواستیں', schedule: 'آج کا شیڈول', scheduleNav: 'شیڈول', seeAll: 'تمام کام دیکھیں',
  pending: 'زیرِ انتظار درخواستیں', nearby: 'قریب کے نئے کام', earnings: 'آمدنی کا خلاصہ', today: 'آج', thisWeek: 'اس ہفتے', thisMonth: 'اس ماہ',
  performance: 'کارکردگی', completion: 'کام مکمل کرنے کی شرح', response: 'جواب دینے کی رفتار', satisfaction: 'صارفین کا اطمینان',
  inProgress: 'جاری ہے', upcoming: 'آنے والا', completed: 'مکمل', accept: 'قبول کریں', accepted: 'درخواست قبول ہو گئی', noRequests: 'فی الحال کوئی نئی درخواست نہیں',
  home: 'ڈیش بورڈ', jobs: 'میرے کام', newRequests: 'درخواستیں', earningsNav: 'آمدنی', logout: 'لاگ آؤٹ', todayLabel: 'آج',
  trades: { ac: 'اے سی ٹیکنیشن', electrician: 'الیکٹریشن', plumber: 'پلمبر', carpenter: 'کارپنٹر' },
  jobTitles: { 'AC service and cooling check': 'اے سی سروس اور کولنگ چیک', 'Ceiling fan installation': 'چھت والا پنکھا لگانا', 'Kitchen tap repair': 'کچن کے نل کی مرمت' },
  requestTitles: { 'Install two ceiling lights': 'دو چھت کی لائٹس لگانا', 'AC making unusual noise': 'اے سی سے غیر معمولی آواز' },
  customers: { 'Ahmed Raza': 'احمد رضا', 'Fatima Noor': 'فاطمہ نور', 'Ali Hassan': 'علی حسن' },
  areas: { Gulgasht: 'گلگشت', 'Model Town': 'ماڈل ٹاؤن', 'Bosan Road': 'بوسن روڈ', 'Multan Cantt': 'ملتان کینٹ', 'Shah Rukn-e-Alam': 'شاہ رکن عالم' },
};

const en = {
  title: 'Worker dashboard', overview: 'TODAY AT A GLANCE', greeting: 'Good morning, Usman!', subtitle: 'Here’s what is lined up for you today.',
  online: 'Online', offline: 'Offline', available: 'You’re receiving new job requests', unavailable: 'You won’t receive new requests right now',
  todayJobs: 'Today’s jobs', weekJobs: 'Completed this week', rating: 'Your rating', requests: 'New requests', schedule: 'Today’s schedule', scheduleNav: 'Schedule', seeAll: 'View all jobs',
  pending: 'Pending requests', nearby: 'New work nearby', earnings: 'Earnings overview', today: 'Today', thisWeek: 'This week', thisMonth: 'This month',
  performance: 'Performance', completion: 'Job completion', response: 'Response time', satisfaction: 'Customer satisfaction',
  inProgress: 'In progress', upcoming: 'Upcoming', completed: 'Completed', accept: 'Accept job', accepted: 'Request accepted', noRequests: 'No new requests right now',
  home: 'Overview', jobs: 'My jobs', newRequests: 'Requests', earningsNav: 'Earnings', logout: 'Log out', todayLabel: 'Today',
  trades: { ac: 'AC technician', electrician: 'Electrician', plumber: 'Plumber', carpenter: 'Carpenter' },
  jobTitles: { 'AC service and cooling check': 'AC service and cooling check', 'Ceiling fan installation': 'Ceiling fan installation', 'Kitchen tap repair': 'Kitchen tap repair' },
  requestTitles: { 'Install two ceiling lights': 'Install two ceiling lights', 'AC making unusual noise': 'AC making unusual noise' },
  customers: { 'Ahmed Raza': 'Ahmed Raza', 'Fatima Noor': 'Fatima Noor', 'Ali Hassan': 'Ali Hassan' },
  areas: { Gulgasht: 'Gulgasht', 'Model Town': 'Model Town', 'Bosan Road': 'Bosan Road', 'Multan Cantt': 'Multan Cantt', 'Shah Rukn-e-Alam': 'Shah Rukn-e-Alam' },
};

export function WorkerDashboard() {
  const { language } = useT();
  const { logout } = useAuth();
  const router = useRouter();
  const copy = language === 'ur' ? ur : en;
  const [isOnline, setIsOnline] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(initialRequests);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('fixora-worker-online');
    if (saved === 'true' || saved === 'false') setIsOnline(saved === 'true');
  }, []);

  function toggleAvailability() {
    const next = !isOnline;
    setIsOnline(next);
    localStorage.setItem('fixora-worker-online', String(next));
  }

  function acceptRequest(id: string) {
    setPendingRequests((current) => current.filter((request) => request.id !== id));
    setNotice(copy.accepted);
    window.setTimeout(() => setNotice(''), 2800);
  }

  const navItems = [
    { id: 'overview', label: copy.home, icon: CalendarDays },
    { id: 'today-jobs', label: copy.jobs, icon: BriefcaseBusiness },
    { id: 'schedule', label: copy.scheduleNav, icon: CalendarDays },
    { id: 'pending-requests', label: copy.newRequests, icon: Bell },
    { id: 'earnings', label: copy.earningsNav, icon: Banknote },
  ];

  return <div className="min-h-screen bg-[#0c1020] text-white">
    <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#101426]/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <a href="#overview" className="flex shrink-0 items-center" aria-label="FIXORA worker dashboard"><Logo size={42} /></a>
          <div className="hidden h-8 w-px bg-white/10 sm:block" />
          <span className="hidden truncate text-sm font-semibold text-white/80 sm:block">{copy.title}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block"><LanguageToggle /></div>
          <span className="grid h-10 w-10 place-items-center rounded-full border border-cyan/20 bg-cyan/10 text-xs font-bold text-cyan" aria-label="Usman, worker profile">U</span>
          <button type="button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/75 md:hidden">
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
          <button type="button" onClick={() => { logout(); router.replace('/login'); }} className="hidden min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-white/60 transition hover:bg-white/[0.06] hover:text-white md:inline-flex">
            <span>{copy.logout}</span>
          </button>
        </div>
      </div>
      <nav aria-label="Worker dashboard" className={`${menuOpen ? 'block' : 'hidden'} border-t border-white/[0.06] px-4 py-3 md:block md:border-0 md:px-6 md:py-0 lg:px-10`}>
        <div className="mx-auto flex max-w-[1440px] gap-2 overflow-x-auto pb-1 md:gap-6">
          {navItems.map(({ id, label, icon: Icon }) => <Link key={id} href={id === 'today-jobs' ? '/worker/jobs' : id === 'schedule' ? '/worker/schedule' : `#${id}`} onClick={() => setMenuOpen(false)} className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-white/55 transition hover:bg-white/[0.06] hover:text-white md:rounded-none md:px-1 md:pb-4 md:pt-1">
            <Icon size={15} /><span>{label}</span>{id === 'pending-requests' && pendingRequests.length > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-orange px-1 text-[10px] font-bold text-[#101426]">{pendingRequests.length}</span>}
          </Link>)}
          <div className="ms-auto hidden md:block"><span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-[11px] text-white/45">{copy.todayLabel} · Multan</span></div>
        </div>
        {menuOpen && <div className="pt-3 sm:hidden"><LanguageToggle /></div>}
      </nav>
    </header>

    <main id="overview" className="mx-auto max-w-[1440px] px-4 pb-12 pt-6 sm:px-6 sm:pt-9 lg:px-10">
      <section className="relative mb-6 overflow-hidden rounded-3xl border border-cyan/15 bg-gradient-to-br from-[#1c3156] via-[#172849] to-[#211b3b] p-5 sm:mb-7 sm:p-8 lg:p-9">
        <div className="pointer-events-none absolute -end-10 -top-24 h-64 w-64 rounded-full bg-cyan/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-[0.17em] text-cyan sm:text-[11px]"><span className="h-1.5 w-1.5 rounded-full bg-cyan" />{copy.overview}</div>
            <h1 className="text-2xl font-bold leading-relaxed sm:text-3xl">{copy.greeting}</h1>
            <p className="mt-1 max-w-xl text-sm leading-7 text-white/55">{copy.subtitle}</p>
          </div>
          <button type="button" onClick={toggleAvailability} aria-pressed={isOnline} className={`flex min-h-[76px] w-full items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-start transition sm:w-auto sm:min-w-[255px] sm:px-5 ${isOnline ? 'border-emerald-300/20 bg-emerald-300/[0.07]' : 'border-white/10 bg-white/[0.04]'}`}>
            <span><span className={`mb-1 flex items-center gap-2 text-sm font-bold ${isOnline ? 'text-emerald-200' : 'text-white/70'}`}><span className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'animate-pulse bg-emerald-300' : 'bg-white/30'}`} />{isOnline ? copy.online : copy.offline}</span><span className="block text-[11px] leading-5 text-white/50">{isOnline ? copy.available : copy.unavailable}</span></span>
            <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${isOnline ? 'bg-emerald-400' : 'bg-white/20'}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${isOnline ? 'start-6' : 'start-1'}`} /></span>
          </button>
        </div>
      </section>

      <section aria-label={copy.overview} className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {[
          { label: copy.todayJobs, value: '3', note: language === 'ur' ? 'آج شیڈول ہیں' : 'scheduled today', icon: BriefcaseBusiness, tone: 'text-cyan bg-cyan/10' },
          { label: copy.weekJobs, value: '18', note: language === 'ur' ? 'گزشتہ ہفتے سے 3 زیادہ' : '3 more than last week', icon: CheckCircle2, tone: 'text-emerald-300 bg-emerald-300/10' },
          { label: copy.rating, value: '4.9', note: language === 'ur' ? '128 صارفین کی رائے' : 'from 128 reviews', icon: Star, tone: 'text-amber-300 bg-amber-300/10' },
          { label: copy.requests, value: String(pendingRequests.length), note: language === 'ur' ? 'آپ کے لیے دستیاب' : 'waiting for you', icon: Bell, tone: 'text-orange bg-orange/10' },
        ].map(({ label, value, note, icon: Icon, tone }) => <article key={label} className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-2"><span className="text-[11px] leading-5 text-white/55 sm:text-xs">{label}</span><span className={`grid h-9 w-9 place-items-center rounded-xl ${tone}`}><Icon size={17} /></span></div>
          <div className="flex items-end justify-between gap-1"><strong className="text-2xl font-bold tracking-tight sm:text-[28px]">{value}</strong><span className="pb-1 text-[9px] text-white/35 sm:text-[10px]">{note}</span></div>
        </article>)}
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section id="today-jobs" className="scroll-mt-36 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="text-base font-bold sm:text-lg">{copy.schedule}</h2><p className="mt-1 text-[11px] text-white/40">{language === 'ur' ? 'آج کے لیے تین کام' : '3 appointments on your schedule'}</p></div><Link href="/worker/jobs" className="inline-flex min-h-10 items-center gap-1 rounded-xl px-2 text-[11px] font-semibold text-cyan hover:bg-cyan/10">{copy.seeAll} {language === 'ur' ? <ArrowUpLeft size={14} /> : <ArrowUpRight size={14} />}</Link></div>
          <div className="grid gap-3">
            {jobs.map((job) => {
              const Icon = tradeIcons[job.trade];
              const status = job.status === 'inProgress' ? copy.inProgress : job.status === 'completed' ? copy.completed : copy.upcoming;
              return <article key={job.id} className="flex gap-3 rounded-xl border border-white/[0.06] bg-[#101426]/70 p-3 sm:gap-4 sm:p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan/15 bg-cyan/[0.08] text-cyan"><Icon size={19} /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1"><h3 className="text-xs font-bold leading-6 sm:text-sm">{language === 'ur' ? copy.jobTitles[job.title as keyof typeof copy.jobTitles] : job.title}</h3><span className={`rounded-full px-2 py-1 text-[9px] font-semibold ${job.status === 'inProgress' ? 'bg-cyan/10 text-cyan' : job.status === 'completed' ? 'bg-emerald-300/10 text-emerald-200' : 'bg-orange/10 text-orange'}`}>{status}</span></div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-white/45"><span className="inline-flex items-center gap-1"><Clock3 size={12} />{job.time}</span><span className="inline-flex items-center gap-1"><MapPin size={12} />{language === 'ur' ? copy.areas[job.area as keyof typeof copy.areas] : job.area}</span><span>{language === 'ur' ? copy.customers[job.customer as keyof typeof copy.customers] : job.customer}</span></div>
                </div>
              </article>;
            })}
          </div>
        </section>

        <section id="pending-requests" className="scroll-mt-36 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="text-base font-bold sm:text-lg">{copy.pending}</h2><p className="mt-1 text-[11px] text-white/40">{copy.nearby}</p></div><span className="grid h-8 min-w-8 place-items-center rounded-full bg-orange/10 px-2 text-xs font-bold text-orange">{pendingRequests.length}</span></div>
          {notice && <div role="status" className="mb-3 flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] px-3 py-2 text-[11px] text-emerald-200"><Check size={14} />{notice}</div>}
          {pendingRequests.length === 0 ? <div className="grid min-h-48 place-items-center rounded-xl border border-dashed border-white/10 px-5 text-center text-xs text-white/45"><p><CheckCircle2 size={25} className="mx-auto mb-2 text-emerald-300" />{copy.noRequests}</p></div> : <div className="grid gap-3">
            {pendingRequests.map((request) => {
              const Icon = tradeIcons[request.trade];
              return <article key={request.id} className="rounded-xl border border-white/[0.06] bg-[#101426]/70 p-3 sm:p-4">
                <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange/10 text-orange"><Icon size={18} /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><h3 className="text-xs font-bold leading-6 sm:text-sm">{language === 'ur' ? copy.requestTitles[request.title as keyof typeof copy.requestTitles] : request.title}</h3><strong className="whitespace-nowrap text-xs text-emerald-200">{request.price}</strong></div><div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-white/45"><span className="inline-flex items-center gap-1"><MapPin size={12} />{language === 'ur' ? copy.areas[request.area as keyof typeof copy.areas] : request.area} · {request.distance}</span><span>{request.time}</span></div></div></div>
                <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3"><span className="text-[10px] text-white/40">{language === 'ur' ? copy.trades[request.trade] : copy.trades[request.trade]}</span><button type="button" onClick={() => acceptRequest(request.id)} className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-blue px-3 text-[10px] font-bold text-white transition hover:brightness-110 sm:px-4">{copy.accept}<ArrowUpRight size={13} /></button></div>
              </article>;
            })}
          </div>}
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section id="earnings" className="scroll-mt-36 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 sm:p-6">
          <div className="mb-5 flex items-start justify-between"><div><h2 className="text-base font-bold sm:text-lg">{copy.earnings}</h2><p className="mt-1 text-[11px] text-white/40">{language === 'ur' ? 'آپ کی محنت کا صلہ' : 'Keep track of your work'}</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-300/10 text-emerald-200"><Banknote size={19} /></span></div>
          <div className="grid grid-cols-3 divide-x divide-white/[0.07] rounded-xl bg-[#101426]/70 py-4 [direction:ltr]">
            {[{ label: copy.today, value: 'PKR 4,500' }, { label: copy.thisWeek, value: 'PKR 28,750' }, { label: copy.thisMonth, value: 'PKR 86,200' }].map((item) => <div key={item.label} className="px-2 text-center [direction:rtl]"><span className="block text-[9px] text-white/40 sm:text-[10px]">{item.label}</span><strong className="mt-2 block text-xs font-bold text-white sm:text-sm">{item.value}</strong></div>)}
          </div>
          <div className="mt-5 flex h-24 items-end justify-between gap-2 px-1" aria-label={language === 'ur' ? 'ہفتہ وار آمدنی کا گراف' : 'Weekly earnings chart'}>
            {[42, 64, 49, 78, 56, 92, 70].map((height, index) => <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className={`w-full max-w-8 rounded-t-md ${index === 5 ? 'bg-cyan' : 'bg-blue/45'}`} style={{ height: `${height}%` }} /><span className="text-[9px] text-white/35">{language === 'ur' ? ['پیر','منگل','بدھ','جمعرات','جمعہ','ہفتہ','اتوار'][index] : ['M','T','W','T','F','S','S'][index]}</span></div>)}
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 sm:p-6">
          <div className="mb-5 flex items-start justify-between"><div><h2 className="text-base font-bold sm:text-lg">{copy.performance}</h2><p className="mt-1 text-[11px] text-white/40">{language === 'ur' ? 'گزشتہ 30 دن' : 'Your last 30 days'}</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan/10 text-cyan"><TrendingUp size={18} /></span></div>
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-amber-300/10 bg-amber-300/[0.04] p-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-amber-300/10 text-amber-300"><Star size={18} fill="currentColor" /></span><div><strong className="text-lg">4.9 <span className="text-sm text-amber-300">/ 5</span></strong><p className="text-[10px] text-white/40">{language === 'ur' ? '128 تصدیق شدہ جائزے' : '128 verified reviews'}</p></div><span className="ms-auto text-[10px] font-semibold text-emerald-200">+0.2</span></div>
          {[{ label: copy.completion, value: 96, icon: CheckCircle2 }, { label: copy.response, value: 88, icon: Clock3 }, { label: copy.satisfaction, value: 98, icon: Star }].map(({ label, value, icon: Icon }) => <div key={label} className="mb-4 last:mb-0"><div className="mb-2 flex items-center justify-between gap-2 text-[10px]"><span className="inline-flex items-center gap-2 text-white/55"><Icon size={13} className="text-cyan" />{label}</span><strong className="text-white/80">{value}%</strong></div><div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]"><div className="h-full rounded-full bg-gradient-to-r from-blue to-cyan" style={{ width: `${value}%` }} /></div></div>)}
          <p className="mt-5 flex items-center gap-2 text-[10px] text-white/40"><Clock3 size={13} />{language === 'ur' ? 'اوسط جواب: 8 منٹ' : 'Average response: 8 min'} <span className="text-emerald-200">{language === 'ur' ? '· بہترین' : '· Great'}</span></p>
        </section>
      </div>

      <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] pt-5 text-[10px] text-white/35 sm:flex-row"><span>© FIXORA · Multan</span><span className="inline-flex items-center gap-1.5"><Wrench size={12} />{language === 'ur' ? 'آپ کے ہنر سے، بہتر گھر' : 'Better homes, powered by your skills'}</span></footer>
    </main>
  </div>;
}
