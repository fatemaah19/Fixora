'use client';

import { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, Check, Clock3, Search, ShieldCheck, UserRoundCheck, UserRoundX, X } from 'lucide-react';
import { getWorkers, updateWorkerStatus } from '@/lib/api';
import { useT } from '@/contexts/LanguageProvider';
import { trades } from '@/lib/mockData';
import { localizedText } from '@/lib/localization';
import { applyWorkerStatusOverrides, saveWorkerStatusOverride } from '@/lib/adminData';
import type { Worker, WorkerStatus } from '@/lib/types';

type Filter = 'all' | WorkerStatus;

export function AdminWorkers() {
  const { language } = useT();
  const ur = language === 'ur';
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [filter, setFilter] = useState<Filter>('pending');
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorkers().then((items) => setWorkers(applyWorkerStatusOverrides(items))).finally(() => setLoading(false));
  }, []);

  const copy = ur
    ? { eyebrow: 'ایڈمن پینل', title: 'کاریگروں کی درخواستیں', subtitle: 'نئے کاریگروں کی معلومات دیکھیں اور منظوری کا فیصلہ کریں۔', search: 'نام، مہارت یا علاقہ تلاش کریں', all: 'تمام', pending: 'زیرِ جائزہ', approved: 'منظور شدہ', rejected: 'مسترد', experience: 'سال تجربہ', approve: 'منظور کریں', reject: 'مسترد کریں', empty: 'اس فہرست میں کوئی کاریگر نہیں۔', loading: 'درخواستیں لوڈ ہو رہی ہیں…', approvedNotice: 'کاریگر کی درخواست منظور ہوگئی۔', rejectedNotice: 'کاریگر کی درخواست مسترد ہوگئی۔', phone: 'رابطہ نمبر', review: 'جائزہ درکار', help: 'منظوری سے پہلے پروفائل، مہارت اور علاقے کی تصدیق کریں۔' }
    : { eyebrow: 'ADMIN PANEL', title: 'Worker applications', subtitle: 'Review new worker profiles and record an approval decision.', search: 'Search name, trade, or area', all: 'All', pending: 'Pending', approved: 'Approved', rejected: 'Rejected', experience: 'years experience', approve: 'Approve', reject: 'Reject', empty: 'No workers match this view.', loading: 'Loading applications…', approvedNotice: 'Worker application approved.', rejectedNotice: 'Worker application rejected.', phone: 'Contact', review: 'Needs review', help: 'Check the worker’s profile, trade, and service area before approving.' };

  const counts = useMemo(() => ({
    all: workers.length,
    pending: workers.filter((worker) => worker.status === 'pending').length,
    approved: workers.filter((worker) => worker.status === 'approved').length,
    rejected: workers.filter((worker) => worker.status === 'rejected').length,
  }), [workers]);

  const visibleWorkers = workers.filter((worker) => {
    const normalized = query.trim().toLowerCase();
    const matchesFilter = filter === 'all' || worker.status === filter;
    const matchesQuery = !normalized || [worker.name, worker.nameEn || '', worker.bio, worker.bioEn || '', worker.area, worker.tradeId].some((value) => value.toLowerCase().includes(normalized));
    return matchesFilter && matchesQuery;
  });

  async function decide(worker: Worker, status: Extract<WorkerStatus, 'approved' | 'rejected'>) {
    const updated = await updateWorkerStatus(worker.id, status);
    if (!updated) return;
    saveWorkerStatusOverride(worker.id, status);
    setWorkers((items) => items.map((item) => item.id === worker.id ? { ...item, status } : item));
    setNotice(status === 'approved' ? copy.approvedNotice : copy.rejectedNotice);
  }

  const statusLabels: Record<WorkerStatus, string> = ur
    ? { pending: 'زیرِ جائزہ', approved: 'منظور شدہ', rejected: 'مسترد' }
    : { pending: 'Pending review', approved: 'Approved', rejected: 'Rejected' };

  return <div className="grid gap-5 sm:gap-6">
    <section className="rounded-3xl border border-cyan/10 bg-[radial-gradient(ellipse_at_top_left,_rgba(83,217,247,0.11),_transparent_54%),linear-gradient(120deg,_rgba(20,30,54,0.98),_rgba(13,18,32,0.9))] p-5 sm:p-7">
      <span className="text-[9px] font-bold tracking-[0.18em] text-cyan">{copy.eyebrow}</span><h1 className="mt-3 text-2xl font-bold sm:text-3xl">{copy.title}</h1><p className="mt-2 max-w-2xl text-xs leading-6 text-white/50 sm:text-sm">{copy.subtitle}</p>
      <div className="mt-5 flex flex-wrap gap-2 text-[10px] text-white/55"><span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2"><Clock3 size={13} className="text-orange" />{counts.pending} {statusLabels.pending}</span><span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2"><BadgeCheck size={13} className="text-emerald-200" />{counts.approved} {statusLabels.approved}</span><span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2"><UserRoundX size={13} className="text-white/40" />{counts.rejected} {statusLabels.rejected}</span></div>
    </section>

    {notice && <p role="status" className="rounded-xl border border-emerald-300/20 bg-emerald-300/[0.06] px-4 py-3 text-xs text-emerald-100">{notice}</p>}
    <section className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <label className="flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-3 text-white/45"><Search size={16} /><span className="sr-only">{copy.search}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/35" /></label>
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-white/[0.08] bg-white/[0.025] p-1">{(['pending', 'approved', 'rejected', 'all'] as Filter[]).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} aria-pressed={filter === item} className={`min-h-9 shrink-0 rounded-lg px-3 text-[10px] font-semibold transition ${filter === item ? 'bg-blue text-white' : 'text-white/45 hover:text-white'}`}>{item === 'all' ? copy.all : copy[item]}</button>)}</div>
    </section>

    {loading ? <div className="grid gap-3 sm:grid-cols-2"><div className="h-56 animate-pulse rounded-2xl bg-white/[0.04]" /><div className="h-56 animate-pulse rounded-2xl bg-white/[0.04]" /><span className="sr-only">{copy.loading}</span></div> : visibleWorkers.length === 0 ? <div className="grid min-h-48 place-items-center rounded-2xl border border-dashed border-white/10 p-6 text-center"><p className="text-xs text-white/45">{copy.empty}</p></div> : <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">{visibleWorkers.map((worker) => {
      const trade = trades.find((item) => item.id === worker.tradeId);
      return <article key={worker.id} className="flex min-w-0 flex-col rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
        <div className="flex items-start gap-3"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-cyan/20 bg-cyan/10 text-sm font-bold text-cyan">{worker.avatar}</span><div className="min-w-0 flex-1"><h2 className="truncate text-sm font-bold">{localizedText(language, worker.name, worker.nameEn, 'Professional')}</h2><p className="mt-1 truncate text-[10px] text-white/45">{ur ? trade?.labelUr : trade?.label} · {worker.area}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold ${worker.status === 'pending' ? 'bg-orange/10 text-orange' : worker.status === 'approved' ? 'bg-emerald-300/10 text-emerald-200' : 'bg-white/[0.06] text-white/40'}`}>{statusLabels[worker.status]}</span></div>
        <p className="mt-4 line-clamp-3 min-h-[3.75rem] text-[11px] leading-5 text-white/55">{localizedText(language, worker.bio, worker.bioEn, 'Profile details are available in Urdu.')}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/[0.07] pt-3 text-[10px] text-white/45"><span className="inline-flex items-center gap-1.5"><ShieldCheck size={13} />{worker.experience} {copy.experience}</span><span>{copy.phone}: <bdi dir="ltr" className="text-white/70">{worker.phone}</bdi></span><span className="text-amber-300">★ {worker.rating.toFixed(1)} <small className="text-white/35">({worker.reviews})</small></span></div>
        {worker.status === 'pending' ? <div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => decide(worker, 'approved')} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-300/10 px-3 text-[10px] font-bold text-emerald-200 transition hover:bg-emerald-300/20"><Check size={15} />{copy.approve}</button><button type="button" onClick={() => decide(worker, 'rejected')} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 text-[10px] font-semibold text-white/55 transition hover:border-coral/30 hover:bg-coral/5 hover:text-coral"><X size={15} />{copy.reject}</button></div> : <div className="mt-4 flex min-h-10 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-[10px] text-white/40"><UserRoundCheck size={14} />{worker.status === 'approved' ? (ur ? 'پروفائل منظور ہے' : 'Profile is approved') : (ur ? 'درخواست مسترد ہے' : 'Application was rejected')}</div>}
      </article>;
    })}</div>}
    <p className="text-[10px] leading-5 text-white/35">{copy.help}</p>
  </div>;
}
