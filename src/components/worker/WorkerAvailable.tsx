'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, BriefcaseBusiness, Clock3, Droplets, Hammer, MapPin, Search, Snowflake, Sparkles, X, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Logo } from '@/components/Logo';
import { useT } from '@/contexts/LanguageProvider';
import { readAvailableWorkerRequests, resolveWorkerRequest, type WorkerAvailableJob, type WorkerTrade } from '@/lib/workerData';
import { localizedText } from '@/lib/localization';

type TradeFilter = 'all' | WorkerTrade;

const tradeIcons: Record<WorkerTrade, LucideIcon> = {
  ac: Snowflake,
  electrician: Zap,
  plumber: Droplets,
  carpenter: Hammer,
};

const trades: WorkerTrade[] = ['electrician', 'ac', 'plumber', 'carpenter'];

const ur = {
  title: 'دستیاب کام', subtitle: 'قریب کی سروس درخواستیں دیکھیں اور اپنی سہولت کے مطابق قبول کریں۔', back: 'ڈیش بورڈ',
  open: 'دستیاب درخواستیں', search: 'کام، علاقہ یا تفصیل تلاش کریں', all: 'تمام کام', tomorrow: 'کل',
  electrician: 'الیکٹریشن', ac: 'اے سی ٹیکنیشن', plumber: 'پلمبر', carpenter: 'کارپنٹر',
  offer: 'تجویز کردہ معاوضہ', distance: 'فاصلہ', appointment: 'مطلوبہ وقت', posted: 'موصول', customer: 'صارف',
  accept: 'کام قبول کریں', decline: 'نظر انداز کریں', accepted: 'کام آپ کی فہرست میں شامل ہو گیا۔', declined: 'درخواست نظر انداز کر دی گئی۔',
  empty: 'اس فلٹر میں کوئی دستیاب کام نہیں۔', resolved: 'تمام درخواستیں دیکھی جا چکی ہیں۔', sameDay: 'آج دستیاب', newRequest: 'نئی سروس درخواست', detailsProvidedUrdu: 'صارف نے مسئلے کی تفصیل اردو میں فراہم کی ہے۔', quotePending: 'معاوضہ بات چیت سے طے ہوگا', distanceUnknown: 'فاصلہ دستیاب نہیں', appointmentPending: 'وقت طے ہونا باقی ہے', genericCustomer: 'صارف',
  titles: { 'Install two ceiling lights': 'دو چھت کی لائٹس لگانا', 'AC making unusual noise': 'اے سی سے غیر معمولی آواز', 'Repair leaking kitchen sink': 'کچن کے سنک کا رساؤ ٹھیک کرنا', 'Adjust wardrobe door': 'الماری کے دروازے کی درستگی', 'Check a faulty wall switch': 'خراب دیواری سوئچ کی جانچ' },
  descriptions: {
    'Two ceiling light points need installation in the living room.': 'ڈرائنگ روم میں دو چھت والی لائٹس لگوانی ہیں۔',
    'Split AC needs an inspection; the indoor unit is making a rattling sound.': 'اے سی کا اندرونی یونٹ آواز کر رہا ہے، معائنہ درکار ہے۔',
    'Water is dripping from the sink trap and needs a quick repair.': 'کچن کے سنک سے پانی ٹپک رہا ہے، مرمت درکار ہے۔',
    'One wardrobe door is misaligned and does not close smoothly.': 'الماری کا ایک دروازہ ٹھیک سے بند نہیں ہوتا۔',
    'The bedroom switch is intermittent; please inspect and repair it.': 'بیڈ روم کا سوئچ کبھی چلتا ہے کبھی نہیں، جانچ اور مرمت کریں۔',
  },
  customers: { 'Nida Khan': 'ندا خان', 'Hassan Raza': 'حسن رضا', 'Areeba Iqbal': 'عریبہ اقبال', 'Bilal Ahmed': 'بلال احمد', 'Zainab Ali': 'زینب علی' },
  areas: { Gulgasht: 'گلگشت', 'Multan Cantt': 'ملتان کینٹ', 'Bosan Road': 'بوسن روڈ', 'Model Town': 'ماڈل ٹاؤن', 'Shah Rukn-e-Alam': 'شاہ رکن عالم' },
  postedTimes: { '20 min ago': '20 منٹ پہلے', '45 min ago': '45 منٹ پہلے', '1 hour ago': 'ایک گھنٹہ پہلے', '2 hours ago': '2 گھنٹے پہلے', '3 hours ago': '3 گھنٹے پہلے' },
};

const en = {
  title: 'Available jobs', subtitle: 'Browse nearby service requests and accept work that fits your schedule.', back: 'Dashboard',
  open: 'Open requests', search: 'Search jobs, areas, or details', all: 'All jobs', tomorrow: 'Tomorrow',
  electrician: 'Electrician', ac: 'AC technician', plumber: 'Plumber', carpenter: 'Carpenter',
  offer: 'Offered amount', distance: 'Distance', appointment: 'Requested time', posted: 'Posted', customer: 'Customer',
  accept: 'Accept job', decline: 'Dismiss', accepted: 'Job added to My Jobs.', declined: 'Request dismissed.',
  empty: 'No available jobs match this filter.', resolved: 'You’ve reviewed all available requests.', sameDay: 'Today', newRequest: 'New service request', detailsProvidedUrdu: 'The customer provided the issue details in Urdu.', quotePending: 'To be discussed', distanceUnknown: 'Not calculated', appointmentPending: 'To be arranged', genericCustomer: 'Customer',
  titles: { 'Install two ceiling lights': 'Install two ceiling lights', 'AC making unusual noise': 'AC making unusual noise', 'Repair leaking kitchen sink': 'Repair leaking kitchen sink', 'Adjust wardrobe door': 'Adjust wardrobe door', 'Check a faulty wall switch': 'Check a faulty wall switch' },
  descriptions: {
    'Two ceiling light points need installation in the living room.': 'Two ceiling light points need installation in the living room.',
    'Split AC needs an inspection; the indoor unit is making a rattling sound.': 'Split AC needs an inspection; the indoor unit is making a rattling sound.',
    'Water is dripping from the sink trap and needs a quick repair.': 'Water is dripping from the sink trap and needs a quick repair.',
    'One wardrobe door is misaligned and does not close smoothly.': 'One wardrobe door is misaligned and does not close smoothly.',
    'The bedroom switch is intermittent; please inspect and repair it.': 'The bedroom switch is intermittent; please inspect and repair it.',
  },
  customers: { 'Nida Khan': 'Nida Khan', 'Hassan Raza': 'Hassan Raza', 'Areeba Iqbal': 'Areeba Iqbal', 'Bilal Ahmed': 'Bilal Ahmed', 'Zainab Ali': 'Zainab Ali' },
  areas: { Gulgasht: 'Gulgasht', 'Multan Cantt': 'Multan Cantt', 'Bosan Road': 'Bosan Road', 'Model Town': 'Model Town', 'Shah Rukn-e-Alam': 'Shah Rukn-e-Alam' },
  postedTimes: { '20 min ago': '20 min ago', '45 min ago': '45 min ago', '1 hour ago': '1 hour ago', '2 hours ago': '2 hours ago', '3 hours ago': '3 hours ago' },
};

export function WorkerAvailable() {
  const { language } = useT();
  const copy = language === 'ur' ? ur : en;
  const [requests, setRequests] = useState<WorkerAvailableJob[] | null>(null);
  const [filter, setFilter] = useState<TradeFilter>('all');
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setRequests(readAvailableWorkerRequests());
  }, []);

  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return (requests ?? []).filter((request) => {
      const matchesTrade = filter === 'all' || request.trade === filter;
      const localizedTitle = language === 'ur' ? copy.titles[request.title as keyof typeof copy.titles] : request.title;
      const localizedDescription = language === 'ur' ? copy.descriptions[request.description as keyof typeof copy.descriptions] : request.description;
      const localizedArea = language === 'ur' ? copy.areas[request.area as keyof typeof copy.areas] : request.area;
      const localizedCustomer = language === 'ur' ? copy.customers[request.customer as keyof typeof copy.customers] : request.customer;
      const matchesQuery = !normalizedQuery || [request.title, request.description, request.area, request.customer, localizedTitle, localizedDescription, localizedArea, localizedCustomer].some((value) => value.toLowerCase().includes(normalizedQuery));
      return matchesTrade && matchesQuery;
    });
  }, [copy, filter, language, query, requests]);

  function resolveRequest(request: WorkerAvailableJob, decision: 'accepted' | 'declined') {
    resolveWorkerRequest(request, decision);
    setRequests((current) => current?.filter((item) => item.id !== request.id) ?? []);
    setNotice(decision === 'accepted' ? copy.accepted : copy.declined);
    window.setTimeout(() => setNotice(''), 2800);
  }

  const selectedTradeName = (trade: WorkerTrade) => copy[trade];

  return <main className="min-h-screen bg-[#0c1020] text-white">
    <header className="border-b border-white/[0.07] bg-[#101426]/90">
      <div className="mx-auto flex min-h-[72px] max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/worker/dashboard" aria-label="FIXORA dashboard"><Logo size={42} /></Link>
        <div className="flex items-center gap-2 sm:gap-4"><LanguageToggle /><Link href="/worker/dashboard" className="hidden min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-white/55 transition hover:bg-white/[0.06] hover:text-white sm:inline-flex">{language === 'ur' ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}{copy.back}</Link></div>
      </div>
    </header>
    <div className="mx-auto max-w-5xl px-4 pb-12 pt-6 sm:px-6 sm:pt-9">
      <Link href="/worker/dashboard" className="mb-5 inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-white/45 transition hover:text-cyan"><ArrowLeft size={15} />{copy.back}</Link>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><span className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] text-cyan"><Sparkles size={13} />FIXORA WORKSPACE</span><h1 className="text-2xl font-bold leading-relaxed sm:text-3xl">{copy.title}</h1><p className="mt-1 text-sm leading-7 text-white/50">{copy.subtitle}</p></div><div className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3"><strong className="text-lg">{requests?.length ?? '—'}</strong><span className="ms-2 text-[11px] text-white/45">{copy.open}</span></div></div>

      <label className="mb-4 flex min-h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-white/40"><Search size={17} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/35" /></label>
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">{(['all', ...trades] as TradeFilter[]).map((value) => <button key={value} type="button" onClick={() => setFilter(value)} aria-pressed={filter === value} className={`min-h-10 shrink-0 rounded-xl border px-3 text-[10px] font-semibold transition ${filter === value ? 'border-cyan/30 bg-cyan/10 text-cyan' : 'border-white/[0.07] bg-white/[0.025] text-white/45 hover:border-white/20 hover:text-white'}`}>{value === 'all' ? copy.all : selectedTradeName(value)}</button>)}</div>

      {notice && <p role="status" className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] px-4 py-3 text-xs text-emerald-200"><BadgeCheck size={15} />{notice}</p>}
      {requests === null ? <div className="grid gap-4" aria-label={language === 'ur' ? 'درخواستیں لوڈ ہو رہی ہیں' : 'Loading requests'}><div className="h-48 animate-pulse rounded-2xl bg-white/[0.04]" /><div className="h-48 animate-pulse rounded-2xl bg-white/[0.04]" /></div> : visible.length === 0 ? <div className="grid min-h-56 place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-sm text-white/45"><p><BriefcaseBusiness size={28} className="mx-auto mb-3 text-cyan" />{requests.length === 0 ? copy.resolved : copy.empty}</p></div> : <div className="grid gap-4">
        {visible.map((request) => {
          const Icon = tradeIcons[request.trade];
          const title = request.sourceRequestId ? copy.newRequest : language === 'ur' ? copy.titles[request.title as keyof typeof copy.titles] || request.title : request.title;
          const description = request.sourceRequestId
            ? localizedText(language, request.description, request.descriptionEn, copy.detailsProvidedUrdu)
            : language === 'ur' ? copy.descriptions[request.description as keyof typeof copy.descriptions] || request.description : request.description;
          const area = language === 'ur' ? copy.areas[request.area as keyof typeof copy.areas] || request.area : request.area;
          const postedTime = copy.postedTimes[request.time as keyof typeof copy.postedTimes] || request.time;
          return <article key={request.id} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035]">
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-cyan/15 bg-cyan/[0.08] text-cyan"><Icon size={21} /></span>
              <div className="min-w-0 flex-1"><div className="mb-1 flex flex-wrap items-center gap-2"><span className="text-[10px] font-bold tracking-wide text-cyan">#{request.id}</span><span className="rounded-full bg-cyan/10 px-2.5 py-1 text-[9px] font-semibold text-cyan">{selectedTradeName(request.trade)}</span><span className="rounded-full bg-orange/10 px-2.5 py-1 text-[9px] font-semibold text-orange">{request.sourceRequestId ? copy.appointmentPending : request.appointmentTime.startsWith('Tomorrow · ') ? copy.tomorrow : copy.sameDay}</span></div><h2 className="text-sm font-bold leading-6 sm:text-base">{title}</h2><p className="mt-1 text-[11px] leading-5 text-white/45">{description}</p></div>
              <div className="shrink-0 rounded-xl bg-emerald-300/[0.07] px-4 py-3 sm:min-w-36"><span className="block text-[9px] text-white/40">{copy.offer}</span><strong className="mt-1 block text-sm text-emerald-200">{request.sourceRequestId ? copy.quotePending : request.price}</strong></div>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-white/[0.06] bg-[#101426]/40 px-4 py-3 text-[10px] sm:grid-cols-4 sm:px-5">
              <span className="inline-flex items-center gap-2 text-white/55"><MapPin size={13} className="text-cyan" /><span>{area}<span className="ms-1 text-white/35">· {request.sourceRequestId ? copy.distanceUnknown : request.distance}</span></span></span>
              <span className="inline-flex items-center gap-2 text-white/55"><Clock3 size={13} className="text-cyan" />{request.sourceRequestId ? copy.appointmentPending : request.appointmentTime.startsWith('Tomorrow · ') ? `${copy.tomorrow} · ${request.appointmentTime.slice(11)}` : request.appointmentTime}</span>
              <span className="col-span-2 inline-flex items-center gap-2 text-white/55 sm:col-span-1"><BriefcaseBusiness size={13} className="text-cyan" />{request.sourceRequestId ? copy.genericCustomer : language === 'ur' ? copy.customers[request.customer as keyof typeof copy.customers] || request.customer : request.customer}</span>
              <span className="col-span-2 text-white/30 sm:col-span-1">{postedTime}</span>
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-white/[0.06] p-3 sm:flex-row sm:items-center sm:justify-end sm:p-4">
              <button type="button" onClick={() => resolveRequest(request, 'declined')} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-[10px] font-semibold text-white/45 transition hover:bg-white/[0.05] hover:text-white"><X size={13} />{copy.decline}</button>
              <button type="button" onClick={() => resolveRequest(request, 'accepted')} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue to-cyan px-4 text-[10px] font-bold text-white shadow-lg shadow-blue/10 transition hover:brightness-110">{copy.accept}<ArrowUpRight size={13} /></button>
            </div>
          </article>;
        })}
      </div>}
    </div>
  </main>;
}
