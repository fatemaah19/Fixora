'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Clock3, MessageSquareWarning, Search, RotateCcw, Send } from 'lucide-react';
import { useT } from '@/contexts/LanguageProvider';
import { getComplaints } from '@/lib/api';
import { customers } from '@/lib/mockData';
import { localizedText } from '@/lib/localization';
import { mergeLocalComplaints, saveLocalComplaint } from '@/lib/complaintData';
import type { Complaint } from '@/lib/types';

type Filter = 'all' | Complaint['status'];

export function AdminComplaints() {
  const { language } = useT();
  const ur = language === 'ur';
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filter, setFilter] = useState<Filter>('open');
  const [query, setQuery] = useState('');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let current = true;
    getComplaints()
      .then((items) => {
        if (current) setComplaints(mergeLocalComplaints(items));
      })
      .finally(() => {
        if (current) setLoading(false);
      });
    return () => { current = false; };
  }, []);

  const copy = ur
    ? {
        eyebrow: 'ایڈمن پینل', title: 'کسٹمر کی شکایات', subtitle: 'شکایات دیکھیں، جواب بھیجیں اور حل ہونے پر نشان لگائیں۔',
        search: 'شکایت یا بکنگ آئی ڈی تلاش کریں', all: 'تمام', open: 'زیرِ کارروائی', resolved: 'حل شدہ',
        empty: 'اس فہرست میں کوئی شکایت نہیں۔', loading: 'شکایات لوڈ ہو رہی ہیں…', customer: 'صارف',
        booking: 'بکنگ', received: 'موصول ہوئی', reply: 'اپنا جواب لکھیں', saveReply: 'جواب محفوظ کریں',
        resolve: 'حل شدہ نشان لگائیں', reopen: 'دوبارہ کھولیں', replySaved: 'جواب محفوظ ہوگیا۔',
        resolvedNotice: 'شکایت کو حل شدہ نشان لگا دیا گیا۔', reopenedNotice: 'شکایت دوبارہ کھول دی گئی۔',
      }
    : {
        eyebrow: 'ADMIN PANEL', title: 'Customer complaints', subtitle: 'Review support tickets, send a reply, and mark issues resolved.',
        search: 'Search complaint or booking ID', all: 'All', open: 'Open', resolved: 'Resolved',
        empty: 'No complaints in this view.', loading: 'Loading complaints…', customer: 'Customer',
        booking: 'Booking', received: 'Received', reply: 'Write a reply', saveReply: 'Save reply',
        resolve: 'Mark resolved', reopen: 'Reopen complaint', replySaved: 'Reply saved.',
        resolvedNotice: 'Complaint marked as resolved.', reopenedNotice: 'Complaint reopened.',
      };

  const counts = useMemo(() => ({
    all: complaints.length,
    open: complaints.filter((complaint) => complaint.status === 'open').length,
    resolved: complaints.filter((complaint) => complaint.status === 'resolved').length,
  }), [complaints]);

  const visibleComplaints = complaints
    .filter((complaint) => filter === 'all' || complaint.status === filter)
    .filter((complaint) => {
      const customer = customers.find((item) => item.id === complaint.customerId);
      const normalized = query.trim().toLowerCase();
      return !normalized || [
        complaint.id,
        complaint.bookingId || '',
        complaint.message,
        complaint.response || '',
        customer?.name || '',
        customer?.nameEn || '',
      ].some((value) => value.toLowerCase().includes(normalized));
    })
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

  function updateComplaint(complaint: Complaint, changes: Partial<Complaint>, noticeText: string) {
    const updated = { ...complaint, ...changes };
    saveLocalComplaint(updated);
    setComplaints((items) => items.map((item) => item.id === updated.id ? updated : item));
    setNotice(noticeText);
  }

  const filters: Filter[] = ['open', 'resolved', 'all'];
  const filterLabel = (item: Filter) => item === 'all' ? copy.all : item === 'open' ? copy.open : copy.resolved;
  const statusLabel = (status: Complaint['status']) => status === 'open' ? copy.open : copy.resolved;

  return <div className="grid gap-5 sm:gap-6">
    <section className="rounded-3xl border border-cyan/10 bg-[radial-gradient(ellipse_at_top_left,_rgba(83,217,247,0.11),_transparent_54%),linear-gradient(120deg,_rgba(20,30,54,0.98),_rgba(13,18,32,0.9))] p-5 sm:p-7">
      <span className="text-[9px] font-bold tracking-[0.18em] text-cyan">{copy.eyebrow}</span>
      <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{copy.title}</h1>
      <p className="mt-2 max-w-2xl text-xs leading-6 text-white/50 sm:text-sm">{copy.subtitle}</p>
      <div className="mt-5 flex flex-wrap gap-2 text-[10px] text-white/55">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2"><MessageSquareWarning size={13} className="text-cyan" />{counts.all} {copy.all}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2"><Clock3 size={13} className="text-orange" />{counts.open} {copy.open}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2"><Check size={13} className="text-emerald-200" />{counts.resolved} {copy.resolved}</span>
      </div>
    </section>

    {notice && <p role="status" aria-live="polite" className="rounded-xl border border-emerald-300/20 bg-emerald-300/[0.06] px-4 py-3 text-xs text-emerald-100">{notice}</p>}

    <section className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <label className="flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-3 text-white/45">
        <Search size={16} />
        <span className="sr-only">{copy.search}</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/35" />
      </label>
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-white/[0.08] bg-white/[0.025] p-1">
        {filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} aria-pressed={filter === item} className={`min-h-9 shrink-0 rounded-lg px-3 text-[10px] font-semibold transition ${filter === item ? 'bg-blue text-white' : 'text-white/45 hover:text-white'}`}>
          {filterLabel(item)} <span className="ms-1 opacity-65">{counts[item]}</span>
        </button>)}
      </div>
    </section>

    {loading ? <div className="grid gap-3 sm:grid-cols-2"><div className="h-64 animate-pulse rounded-2xl bg-white/[0.04]" /><div className="h-64 animate-pulse rounded-2xl bg-white/[0.04]" /><span className="sr-only">{copy.loading}</span></div>
      : visibleComplaints.length === 0 ? <div className="grid min-h-48 place-items-center rounded-2xl border border-dashed border-white/10 p-6 text-center"><p className="text-xs text-white/45">{copy.empty}</p></div>
        : <div className="grid gap-3 xl:grid-cols-2">{visibleComplaints.map((complaint) => {
          const customer = customers.find((item) => item.id === complaint.customerId);
          const draft = drafts[complaint.id] ?? complaint.response ?? '';
          return <article key={complaint.id} className="flex min-w-0 flex-col rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[9px] font-bold tracking-[0.12em] text-cyan">#{complaint.id.toUpperCase()}</p>
                <h2 className="mt-2 text-sm font-bold">{localizedText(language, customer?.name || '', customer?.nameEn, copy.customer)}</h2>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-white/40">
                  {complaint.bookingId && <span>{copy.booking}: <bdi dir="ltr">{complaint.bookingId}</bdi></span>}
                  {complaint.createdAt && <time dateTime={complaint.createdAt}>{copy.received}: {new Date(complaint.createdAt).toLocaleDateString(ur ? 'ur-PK' : 'en-PK', { dateStyle: 'medium' })}</time>}
                </div>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold ${complaint.status === 'open' ? 'bg-orange/10 text-orange' : 'bg-emerald-300/10 text-emerald-200'}`}>{statusLabel(complaint.status)}</span>
            </div>

            <p className="mt-4 whitespace-pre-wrap rounded-xl border border-white/[0.06] bg-black/10 p-3 text-xs leading-6 text-white/75">{complaint.message}</p>
            <label className="mt-4 grid gap-2 text-[10px] font-semibold text-white/50">
              {copy.reply}
              <textarea rows={3} value={draft} onChange={(event) => setDrafts((items) => ({ ...items, [complaint.id]: event.target.value }))} className="min-h-20 resize-y rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-xs leading-5 text-white outline-none placeholder:text-white/30 focus:border-cyan/40" placeholder={copy.reply} />
            </label>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button type="button" disabled={!draft.trim() || draft.trim() === (complaint.response || '').trim()} onClick={() => updateComplaint(complaint, { response: draft.trim() }, copy.replySaved)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue/15 px-3 text-[10px] font-bold text-cyan transition hover:bg-blue/25 disabled:cursor-not-allowed disabled:opacity-40"><Send size={14} />{copy.saveReply}</button>
              <button type="button" onClick={() => updateComplaint(complaint, { status: complaint.status === 'open' ? 'resolved' : 'open' }, complaint.status === 'open' ? copy.resolvedNotice : copy.reopenedNotice)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 text-[10px] font-semibold text-white/65 transition hover:border-white/20 hover:bg-white/[0.04]">{complaint.status === 'open' ? <Check size={14} /> : <RotateCcw size={14} />}{complaint.status === 'open' ? copy.resolve : copy.reopen}</button>
            </div>
          </article>;
        })}</div>}
  </div>;
}
