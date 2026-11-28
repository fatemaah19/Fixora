'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpLeft, ArrowUpRight, AlertCircle, CalendarCheck2, Clock3, MessageSquareWarning, UsersRound, UserRoundCheck } from 'lucide-react';
import { getComplaints, getRequests, getWorkers } from '@/lib/api';
import { useT } from '@/contexts/LanguageProvider';
import { customers, trades, workers as mockWorkers } from '@/lib/mockData';
import { localizedText } from '@/lib/localization';
import { applyWorkerStatusOverrides } from '@/lib/adminData';
import { readLocalServiceRequests } from '@/lib/serviceRequestData';
import type { Complaint, ServiceRequest, Worker } from '@/lib/types';

export function AdminDashboard() {
  const { language } = useT();
  const ur = language === 'ur';
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    Promise.all([getWorkers(), getRequests(), getComplaints()]).then(([workerList, requestList, complaintList]) => {
      setWorkers(applyWorkerStatusOverrides(workerList));
      const localRequests = readLocalServiceRequests();
      const localIds = new Set(localRequests.map((request) => request.id));
      setRequests([...localRequests, ...requestList.filter((request) => !localIds.has(request.id))]);
      setComplaints(complaintList);
    });
  }, []);

  const pendingWorkers = workers.filter((worker) => worker.status === 'pending');
  const pendingRequests = requests.filter((request) => request.status === 'requested');
  const activeBookings = requests.filter((request) => request.status === 'booked');
  const openComplaints = complaints.filter((complaint) => complaint.status === 'open');
  const recentRequests = [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const copy = ur
    ? { eyebrow: 'ایڈمن جائزہ', title: 'آج کا آپریشنل خلاصہ', subtitle: 'کاریگروں کی درخواستیں اور سروس کی سرگرمی ایک جگہ دیکھیں۔', workers: 'زیرِ جائزہ درخواستیں', requests: 'نئی سروس درخواستیں', bookings: 'فعال بکنگز', complaints: 'کھلی شکایات', applications: 'کاریگروں کی درخواستیں', allApplications: 'تمام درخواستیں دیکھیں', recent: 'حالیہ سروس سرگرمی', empty: 'کوئی حالیہ درخواست نہیں', pending: 'زیرِ جائزہ', customer: 'صارف', professional: 'کاریگر', status: { requested: 'نئی', booked: 'بک شدہ', completed: 'مکمل', cancelled: 'منسوخ' } }
    : { eyebrow: 'ADMIN OVERVIEW', title: 'Operations at a glance', subtitle: 'Review worker applications and service activity in one place.', workers: 'Applications to review', requests: 'New service requests', bookings: 'Active bookings', complaints: 'Open complaints', applications: 'Worker applications', allApplications: 'View all applications', recent: 'Recent service activity', empty: 'No recent requests', pending: 'Pending review', customer: 'Customer', professional: 'Professional', status: { requested: 'New', booked: 'Booked', completed: 'Completed', cancelled: 'Cancelled' } };

  return <div className="grid gap-6 sm:gap-8">
    <section className="flex flex-col justify-between gap-5 rounded-3xl border border-cyan/10 bg-[radial-gradient(ellipse_at_top_left,_rgba(83,217,247,0.13),_transparent_56%),linear-gradient(120deg,_rgba(20,30,54,0.98),_rgba(13,18,32,0.9))] p-5 sm:flex-row sm:items-end sm:p-7">
      <div><span className="text-[9px] font-bold tracking-[0.18em] text-cyan">{copy.eyebrow}</span><h1 className="mt-3 text-2xl font-bold sm:text-3xl">{copy.title}</h1><p className="mt-2 max-w-xl text-xs leading-6 text-white/50 sm:text-sm">{copy.subtitle}</p></div>
      <Link href="/admin/workers" className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-blue to-cyan px-4 text-xs font-bold text-white transition hover:brightness-110 sm:self-auto"><UsersRound size={16} />{copy.allApplications}{ur ? <ArrowUpLeft size={15} /> : <ArrowUpRight size={15} />}</Link>
    </section>

    <section aria-label={ur ? 'خلاصہ' : 'Operations summary'} className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <MetricCard icon={UsersRound} label={copy.workers} value={pendingWorkers.length} accent="cyan" href="/admin/workers" />
      <MetricCard icon={Clock3} label={copy.requests} value={pendingRequests.length} accent="blue" />
      <MetricCard icon={CalendarCheck2} label={copy.bookings} value={activeBookings.length} accent="emerald" />
      <MetricCard icon={MessageSquareWarning} label={copy.complaints} value={openComplaints.length} accent="orange" />
    </section>

    <section className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="text-sm font-bold sm:text-base">{copy.recent}</h2><p className="mt-1 text-[10px] text-white/40">{ur ? 'تازہ ترین درخواستیں' : 'Latest customer requests'}</p></div><CalendarCheck2 size={18} className="text-cyan" /></div>
        {recentRequests.length === 0 ? <p className="rounded-xl border border-dashed border-white/10 p-7 text-center text-xs text-white/40">{copy.empty}</p> : <div className="divide-y divide-white/[0.06]">{recentRequests.map((request) => {
          const trade = trades.find((item) => item.id === request.tradeId);
          const customer = customers.find((item) => item.id === request.customerId);
          const assignedWorker = mockWorkers.find((item) => item.id === request.workerId);
          const status = copy.status[request.status];
          const statusStyle = request.status === 'requested' ? 'bg-blue/10 text-blue' : request.status === 'booked' ? 'bg-cyan/10 text-cyan' : request.status === 'completed' ? 'bg-emerald-300/10 text-emerald-200' : 'bg-white/[0.06] text-white/45';
          return <article key={request.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-cyan"><CalendarCheck2 size={16} /></span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><strong className="text-xs">{ur ? trade?.labelUr : trade?.label}</strong><span className={`rounded-full px-2 py-1 text-[9px] font-semibold ${statusStyle}`}>{status}</span></div><p className="mt-1 truncate text-[11px] text-white/55">{localizedText(language, request.description, request.descriptionEn, 'Request details were submitted in Urdu.')}</p><small className="mt-1 block text-[9px] text-white/35">{copy.customer}: {localizedText(language, customer?.name || '', customer?.nameEn, 'Customer')} · {request.area}{assignedWorker && <> · {copy.professional}: {localizedText(language, assignedWorker.name, assignedWorker.nameEn, 'Professional')}</>}</small></div></div><time className="ps-12 text-[9px] text-white/35 sm:ps-0">{request.createdAt}</time>
          </article>;
        })}</div>}
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="text-sm font-bold sm:text-base">{copy.applications}</h2><p className="mt-1 text-[10px] text-white/40">{copy.pending}</p></div><UserRoundCheck size={19} className="text-cyan" /></div>
        {pendingWorkers.length === 0 ? <div className="grid min-h-36 place-items-center rounded-xl border border-dashed border-white/10 p-5 text-center"><p className="text-xs text-white/40">{ur ? 'زیرِ جائزہ کوئی درخواست نہیں' : 'No worker applications need review'}</p></div> : <div className="grid gap-2">{pendingWorkers.slice(0, 3).map((worker) => <div key={worker.id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan/10 text-xs font-bold text-cyan">{worker.avatar}</span><span className="min-w-0 flex-1"><strong className="block truncate text-[11px]">{localizedText(language, worker.name, worker.nameEn, 'Professional')}</strong><small className="text-[9px] text-white/40">{ur ? trades.find((trade) => trade.id === worker.tradeId)?.labelUr : trades.find((trade) => trade.id === worker.tradeId)?.label} · {worker.area}</small></span></div>)}</div>}
        {pendingWorkers.length > 0 && <Link href="/admin/workers" className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-cyan/20 bg-cyan/[0.05] text-[10px] font-bold text-cyan transition hover:bg-cyan/10">{copy.allApplications}{ur ? <ArrowUpLeft size={14} /> : <ArrowUpRight size={14} />}</Link>}
        <div className="mt-5 flex gap-3 rounded-xl border border-orange/10 bg-orange/[0.04] p-3"><AlertCircle size={16} className="mt-0.5 shrink-0 text-orange" /><p className="text-[10px] leading-5 text-white/50">{ur ? 'منظوری سے پہلے کاریگر کی مہارت اور علاقے کا جائزہ لیں۔' : 'Review each worker’s trade and service area before approval.'}</p></div>
      </div>
    </section>
  </div>;
}

function MetricCard({ icon: Icon, label, value, accent, href }: { icon: typeof UsersRound; label: string; value: number; accent: 'cyan' | 'blue' | 'emerald' | 'orange'; href?: string }) {
  const content = <div className="flex min-h-28 items-start justify-between gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:border-white/15 sm:min-h-32 sm:p-5"><span className="min-w-0"><span className="block text-[10px] leading-5 text-white/50 sm:text-xs">{label}</span><strong className="mt-3 block text-2xl font-bold">{value}</strong></span><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${accent === 'cyan' ? 'bg-cyan/10 text-cyan' : accent === 'blue' ? 'bg-blue/10 text-blue' : accent === 'emerald' ? 'bg-emerald-300/10 text-emerald-200' : 'bg-orange/10 text-orange'}`}><Icon size={17} /></span></div>;
  return href ? <Link href={href} aria-label={`${label}: ${value}`} className="rounded-2xl">{content}</Link> : content;
}
