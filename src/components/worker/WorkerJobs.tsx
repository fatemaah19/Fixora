'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Banknote, BriefcaseBusiness, Check,
  CheckCircle2, Clock3, Droplets, Hammer, MapPin, Navigation, Snowflake, Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Logo } from '@/components/Logo';
import { useT } from '@/contexts/LanguageProvider';
import { mockWorkerJobs, WORKER_JOBS_STORAGE_KEY, type WorkerJob, type WorkerTrade as Trade, type WorkerJobStatus as JobStatus } from '@/lib/workerData';

type JobFilter = 'all' | 'active' | 'completed';

const tradeIcons: Record<Trade, LucideIcon> = {
  ac: Snowflake,
  electrician: Zap,
  plumber: Droplets,
  carpenter: Hammer,
};

const ur = {
  title: 'میرے کام', subtitle: 'اپنے کام دیکھیں اور ہر مرحلے کو اپ ڈیٹ کریں۔', back: 'ڈیش بورڈ',
  all: 'تمام', active: 'جاری کام', completed: 'مکمل', activeJobs: 'جاری کام', empty: 'اس فہرست میں کوئی کام نہیں',
  job: 'کام', customer: 'صارف', location: 'مقام', amount: 'طے شدہ رقم', today: 'آج', yesterday: 'گزشتہ روز', tomorrow: 'کل',
  accepted: 'قبول شدہ', on_the_way: 'راستے میں', in_progress: 'کام جاری', completedStatus: 'مکمل',
  next: { accepted: 'راستے میں ہوں', on_the_way: 'کام شروع کریں', in_progress: 'کام مکمل کریں' },
  updated: 'کام کی حالت اپ ڈیٹ ہو گئی', steps: ['قبول شدہ', 'راستے میں', 'کام جاری', 'مکمل'],
  trades: { ac: 'اے سی ٹیکنیشن', electrician: 'الیکٹریشن', plumber: 'پلمبر', carpenter: 'کارپنٹر' },
  titles: { 'AC service and cooling check': 'اے سی سروس اور کولنگ چیک', 'Ceiling fan installation': 'چھت والا پنکھا لگانا', 'Kitchen tap repair': 'کچن کے نل کی مرمت', 'Bedroom door adjustment': 'بیڈ روم کے دروازے کی درستگی', 'Install two ceiling lights': 'دو چھت کی لائٹس لگانا', 'AC making unusual noise': 'اے سی سے غیر معمولی آواز', 'Repair leaking kitchen sink': 'کچن کے سنک کا رساؤ ٹھیک کرنا', 'Adjust wardrobe door': 'الماری کے دروازے کی درستگی', 'Check a faulty wall switch': 'خراب دیواری سوئچ کی جانچ' },
  customers: { 'Ahmed Raza': 'احمد رضا', 'Fatima Noor': 'فاطمہ نور', 'Ali Hassan': 'علی حسن', 'Sara Malik': 'سارہ ملک', 'Nida Khan': 'ندا خان', 'Hassan Raza': 'حسن رضا', 'Areeba Iqbal': 'عریبہ اقبال', 'Bilal Ahmed': 'بلال احمد', 'Zainab Ali': 'زینب علی' },
  areas: { Gulgasht: 'گلگشت', 'Model Town': 'ماڈل ٹاؤن', 'Bosan Road': 'بوسن روڈ', 'Multan Cantt': 'ملتان کینٹ', 'Shah Rukn-e-Alam': 'شاہ رکن عالم' },
};

const en = {
  title: 'My jobs', subtitle: 'Review your work and update each job as you go.', back: 'Dashboard',
  all: 'All', active: 'Active', completed: 'Completed', activeJobs: 'active jobs', empty: 'No jobs in this list',
  job: 'Job', customer: 'Customer', location: 'Location', amount: 'Agreed amount', today: 'Today', yesterday: 'Yesterday', tomorrow: 'Tomorrow',
  accepted: 'Accepted', on_the_way: 'On the way', in_progress: 'In progress', completedStatus: 'Completed',
  next: { accepted: 'I’m on my way', on_the_way: 'Start the job', in_progress: 'Mark complete' },
  updated: 'Job status updated', steps: ['Accepted', 'On the way', 'In progress', 'Completed'],
  trades: { ac: 'AC technician', electrician: 'Electrician', plumber: 'Plumber', carpenter: 'Carpenter' },
  titles: { 'AC service and cooling check': 'AC service and cooling check', 'Ceiling fan installation': 'Ceiling fan installation', 'Kitchen tap repair': 'Kitchen tap repair', 'Bedroom door adjustment': 'Bedroom door adjustment', 'Install two ceiling lights': 'Install two ceiling lights', 'AC making unusual noise': 'AC making unusual noise', 'Repair leaking kitchen sink': 'Repair leaking kitchen sink', 'Adjust wardrobe door': 'Adjust wardrobe door', 'Check a faulty wall switch': 'Check a faulty wall switch' },
  customers: { 'Ahmed Raza': 'Ahmed Raza', 'Fatima Noor': 'Fatima Noor', 'Ali Hassan': 'Ali Hassan', 'Sara Malik': 'Sara Malik', 'Nida Khan': 'Nida Khan', 'Hassan Raza': 'Hassan Raza', 'Areeba Iqbal': 'Areeba Iqbal', 'Bilal Ahmed': 'Bilal Ahmed', 'Zainab Ali': 'Zainab Ali' },
  areas: { Gulgasht: 'Gulgasht', 'Model Town': 'Model Town', 'Bosan Road': 'Bosan Road', 'Multan Cantt': 'Multan Cantt', 'Shah Rukn-e-Alam': 'Shah Rukn-e-Alam' },
};

const order: JobStatus[] = ['accepted', 'on_the_way', 'in_progress', 'completed'];

export function WorkerJobs() {
  const { language } = useT();
  const copy = language === 'ur' ? ur : en;
  const [jobs, setJobs] = useState<WorkerJob[] | null>(null);
  const [filter, setFilter] = useState<JobFilter>('all');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WORKER_JOBS_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) as WorkerJob[] : null;
      setJobs(Array.isArray(parsed) ? parsed : mockWorkerJobs);
    } catch {
      setJobs(mockWorkerJobs);
    }
  }, []);

  const visibleJobs = useMemo(() => {
    if (!jobs) return [];
    if (filter === 'completed') return jobs.filter((job) => job.status === 'completed');
    if (filter === 'active') return jobs.filter((job) => job.status !== 'completed');
    return jobs;
  }, [filter, jobs]);

  function advanceJob(id: string) {
    setJobs((current) => {
      if (!current) return current;
      const updated = current.map((job) => {
        if (job.id !== id) return job;
        const currentStep = order.indexOf(job.status);
        return { ...job, status: order[Math.min(currentStep + 1, order.length - 1)] };
      });
      localStorage.setItem(WORKER_JOBS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    setNotice(copy.updated);
    window.setTimeout(() => setNotice(''), 2600);
  }

  const counts: Record<JobFilter, number> = {
    all: jobs?.length ?? 0,
    active: jobs?.filter((job) => job.status !== 'completed').length ?? 0,
    completed: jobs?.filter((job) => job.status === 'completed').length ?? 0,
  };

  return <main className="min-h-screen bg-[#0c1020] text-white">
    <header className="border-b border-white/[0.07] bg-[#101426]/90">
      <div className="mx-auto flex min-h-[72px] max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/worker/dashboard" aria-label="FIXORA dashboard"><Logo size={42} /></Link>
        <div className="flex items-center gap-2 sm:gap-4"><LanguageToggle /><Link href="/worker/dashboard" className="hidden min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-white/55 transition hover:bg-white/[0.06] hover:text-white sm:inline-flex">{language === 'ur' ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}{copy.back}</Link></div>
      </div>
    </header>
    <div className="mx-auto max-w-5xl px-4 pb-12 pt-6 sm:px-6 sm:pt-9">
      <Link href="/worker/dashboard" className="mb-5 inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-white/45 transition hover:text-cyan"><ArrowLeft size={15} />{copy.back}</Link>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><span className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] text-cyan"><BriefcaseBusiness size={13} />FIXORA WORKSPACE</span><h1 className="text-2xl font-bold leading-relaxed sm:text-3xl">{copy.title}</h1><p className="mt-1 text-sm leading-7 text-white/50">{copy.subtitle}</p></div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-start"><strong className="text-lg">{counts.active}</strong><span className="ms-2 text-xs text-white/45">{copy.activeJobs}</span></div>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.025] p-2">
        {(['all', 'active', 'completed'] as JobFilter[]).map((value) => <button key={value} type="button" onClick={() => setFilter(value)} aria-pressed={filter === value} className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-xs font-semibold transition ${filter === value ? 'bg-blue text-white' : 'text-white/50 hover:bg-white/[0.05] hover:text-white'}`}>
          {copy[value]}<span className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] ${filter === value ? 'bg-white/20 text-white' : 'bg-white/[0.07] text-white/45'}`}>{counts[value]}</span>
        </button>)}
      </div>

      {notice && <p role="status" className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] px-4 py-3 text-xs text-emerald-200"><Check size={15} />{notice}</p>}
      {jobs === null ? <div className="grid gap-4" aria-label={language === 'ur' ? 'کام لوڈ ہو رہے ہیں' : 'Loading jobs'}><div className="h-48 animate-pulse rounded-2xl bg-white/[0.04]" /><div className="h-48 animate-pulse rounded-2xl bg-white/[0.04]" /></div> : visibleJobs.length === 0 ? <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-sm text-white/45"><p><CheckCircle2 size={28} className="mx-auto mb-3 text-emerald-300" />{copy.empty}</p></div> : <div className="grid gap-4">
        {visibleJobs.map((job) => {
          const Icon = tradeIcons[job.trade];
          const currentStep = order.indexOf(job.status);
          return <article key={job.id} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035]">
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">
              <div className="flex min-w-0 flex-1 gap-3"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-cyan/15 bg-cyan/[0.08] text-cyan"><Icon size={21} /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-bold tracking-wide text-cyan">#{job.id}</span><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${job.status === 'completed' ? 'bg-emerald-300/10 text-emerald-200' : 'bg-blue/10 text-blue-200'}`}>{copy[job.status === 'completed' ? 'completedStatus' : job.status]}</span></div><h2 className="mt-1 text-sm font-bold leading-6 sm:text-base">{language === 'ur' ? copy.titles[job.title as keyof typeof copy.titles] : job.title}</h2><p className="text-[11px] text-white/45">{language === 'ur' ? copy.trades[job.trade] : copy.trades[job.trade]}</p></div></div>
              <div className="flex shrink-0 items-center gap-2 rounded-xl bg-[#101426]/75 px-3 py-2 text-xs font-bold text-emerald-200 sm:min-w-32 sm:justify-center"><Banknote size={15} />{job.price}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-white/[0.06] bg-[#101426]/40 px-4 py-3 text-[10px] sm:grid-cols-3 sm:px-5">
              <span className="inline-flex items-center gap-2 text-white/50"><span className="grid h-7 w-7 place-items-center rounded-lg bg-white/[0.05] text-cyan"><BriefcaseBusiness size={13} /></span><span><span className="block text-white/30">{copy.customer}</span>{language === 'ur' ? copy.customers[job.customer as keyof typeof copy.customers] : job.customer}</span></span>
              <span className="inline-flex items-center gap-2 text-white/50"><span className="grid h-7 w-7 place-items-center rounded-lg bg-white/[0.05] text-cyan"><MapPin size={13} /></span><span><span className="block text-white/30">{copy.location}</span>{language === 'ur' ? copy.areas[job.area as keyof typeof copy.areas] : job.area}</span></span>
              <span className="col-span-2 inline-flex items-center gap-2 text-white/50 sm:col-span-1"><span className="grid h-7 w-7 place-items-center rounded-lg bg-white/[0.05] text-cyan"><Clock3 size={13} /></span><span><span className="block text-white/30">{copy.job}</span>{job.time === 'Yesterday' ? copy.yesterday : job.time.startsWith('Tomorrow · ') ? `${copy.tomorrow} · ${job.time.slice(11)}` : `${copy.today} · ${job.time}`}</span></span>
            </div>
            <div className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
              <ol aria-label={language === 'ur' ? 'کام کی پیش رفت' : 'Job progress'} className="mb-4 grid grid-cols-4 gap-1">
                {order.map((step, index) => <li key={step} className="min-w-0 text-center"><span className={`mx-auto mb-2 grid h-7 w-7 place-items-center rounded-full border text-[10px] ${index <= currentStep ? 'border-cyan/40 bg-cyan/10 text-cyan' : 'border-white/10 bg-white/[0.03] text-white/30'}`}>{index < currentStep ? <Check size={13} /> : index + 1}</span><span className={`block truncate text-[8px] leading-4 sm:text-[10px] ${index <= currentStep ? 'text-white/70' : 'text-white/30'}`}>{copy.steps[index]}</span></li>)}
              </ol>
              {job.status !== 'completed' && <button type="button" onClick={() => advanceJob(job.id)} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue to-cyan px-4 text-xs font-bold text-white shadow-lg shadow-blue/10 transition hover:brightness-110 sm:w-auto sm:min-w-48"><Navigation size={15} />{copy.next[job.status]}<ArrowUpRight size={14} /></button>}
              {job.status === 'completed' && <div className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-emerald-200"><CheckCircle2 size={16} />{copy.completedStatus}</div>}
            </div>
          </article>;
        })}
      </div>}
    </div>
  </main>;
}
