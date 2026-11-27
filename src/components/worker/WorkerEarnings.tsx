'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Banknote, CalendarDays, CheckCircle2, Clock3, TrendingUp, Wallet } from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Logo } from '@/components/Logo';
import { useT } from '@/contexts/LanguageProvider';

type Period = 'week' | 'month';
type PaymentFilter = 'all' | 'paid' | 'pending';
type Payment = { id: string; job: string; customer: string; date: string; amount: number; state: 'paid' | 'pending' };

const payments: Payment[] = [
  { id: 'J-1042', job: 'AC service and cooling check', customer: 'Ahmed Raza', date: 'Today · 09:30', amount: 4500, state: 'pending' },
  { id: 'J-1048', job: 'Ceiling fan installation', customer: 'Fatima Noor', date: 'Today · 12:00', amount: 2800, state: 'pending' },
  { id: 'J-1034', job: 'Bedroom door adjustment', customer: 'Sara Malik', date: 'Yesterday', amount: 3200, state: 'paid' },
  { id: 'J-1029', job: 'Water motor inspection', customer: 'Usman Qadir', date: 'Nov 24', amount: 5200, state: 'paid' },
  { id: 'J-1024', job: 'Switchboard repair', customer: 'Ayesha Khan', date: 'Nov 22', amount: 1800, state: 'paid' },
];

const ur = {
  title: 'آمدنی', subtitle: 'اپنی کمائی اور ادائیگیوں کا ریکارڈ دیکھیں۔', back: 'ڈیش بورڈ',
  today: 'آج کی آمدنی', week: 'اس ہفتے', month: 'اس ماہ', paidOut: 'ادا شدہ', pending: 'ادائیگی باقی',
  trend: 'آمدنی کا رجحان', weekPeriod: 'ہفتہ', monthPeriod: 'مہینہ', transactions: 'حالیہ کام کی ادائیگیاں', all: 'تمام', paid: 'ادا شدہ', filterPending: 'باقی',
  job: 'کام', customer: 'صارف', date: 'تاریخ', amount: 'رقم', statusPaid: 'ادا ہو گئی', statusPending: 'زیرِ التوا',
  payout: 'اگلی ادائیگی', payoutDate: 'جمعہ، 4 دسمبر', payoutHint: 'آپ کی زیرِ التوا رقم اگلی ادائیگی میں شامل ہوگی۔', viewJob: 'کام دیکھیں', noItems: 'اس انتخاب میں کوئی ادائیگی نہیں۔',
  daysWeek: ['پیر','منگل','بدھ','جمعرات','جمعہ','ہفتہ','اتوار'], daysMonth: ['1–4','5–8','9–12','13–16','17–20','21–24','25–30'],
  jobs: { 'AC service and cooling check': 'اے سی سروس اور کولنگ چیک', 'Ceiling fan installation': 'چھت والا پنکھا لگانا', 'Bedroom door adjustment': 'بیڈ روم کے دروازے کی درستگی', 'Water motor inspection': 'واٹر موٹر کا معائنہ', 'Switchboard repair': 'سوئچ بورڈ کی مرمت' },
  customers: { 'Ahmed Raza': 'احمد رضا', 'Fatima Noor': 'فاطمہ نور', 'Sara Malik': 'سارہ ملک', 'Usman Qadir': 'عثمان قادر', 'Ayesha Khan': 'عائشہ خان' },
  dates: { 'Today · 09:30': 'آج · 09:30', 'Today · 12:00': 'آج · 12:00', Yesterday: 'گزشتہ روز', 'Nov 24': '24 نومبر', 'Nov 22': '22 نومبر' },
};
const en = {
  title: 'Earnings', subtitle: 'Keep an eye on your income and payouts.', back: 'Dashboard',
  today: 'Earned today', week: 'This week', month: 'This month', paidOut: 'Paid out', pending: 'Awaiting payout',
  trend: 'Earnings trend', weekPeriod: 'Week', monthPeriod: 'Month', transactions: 'Recent job payments', all: 'All', paid: 'Paid', filterPending: 'Pending',
  job: 'Job', customer: 'Customer', date: 'Date', amount: 'Amount', statusPaid: 'Paid', statusPending: 'Pending',
  payout: 'Next payout', payoutDate: 'Friday, Dec 4', payoutHint: 'Your pending balance will be included in the next payout.', viewJob: 'View jobs', noItems: 'No payments match this filter.',
  daysWeek: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], daysMonth: ['1–4','5–8','9–12','13–16','17–20','21–24','25–30'],
  jobs: { 'AC service and cooling check': 'AC service and cooling check', 'Ceiling fan installation': 'Ceiling fan installation', 'Bedroom door adjustment': 'Bedroom door adjustment', 'Water motor inspection': 'Water motor inspection', 'Switchboard repair': 'Switchboard repair' },
  customers: { 'Ahmed Raza': 'Ahmed Raza', 'Fatima Noor': 'Fatima Noor', 'Sara Malik': 'Sara Malik', 'Usman Qadir': 'Usman Qadir', 'Ayesha Khan': 'Ayesha Khan' },
  dates: { 'Today · 09:30': 'Today · 09:30', 'Today · 12:00': 'Today · 12:00', Yesterday: 'Yesterday', 'Nov 24': 'Nov 24', 'Nov 22': 'Nov 22' },
};

const weekValues = [3200, 5100, 3900, 6700, 4500, 7900, 5200];
const monthValues = [7200, 9400, 8300, 11200, 9800, 13700, 16600];

export function WorkerEarnings() {
  const { language } = useT();
  const copy = language === 'ur' ? ur : en;
  const [period, setPeriod] = useState<Period>('week');
  const [filter, setFilter] = useState<PaymentFilter>('all');
  const values = period === 'week' ? weekValues : monthValues;
  const max = Math.max(...values);
  const filtered = useMemo(() => filter === 'all' ? payments : payments.filter((payment) => payment.state === filter), [filter]);

  return <main className="min-h-screen bg-[#0c1020] text-white">
    <header className="border-b border-white/[0.07] bg-[#101426]/90">
      <div className="mx-auto flex min-h-[72px] max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/worker/dashboard" aria-label="FIXORA dashboard"><Logo size={42} /></Link>
        <div className="flex items-center gap-2 sm:gap-4"><LanguageToggle /><Link href="/worker/dashboard" className="hidden min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-white/55 transition hover:bg-white/[0.06] hover:text-white sm:inline-flex">{language === 'ur' ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}{copy.back}</Link></div>
      </div>
    </header>
    <div className="mx-auto max-w-5xl px-4 pb-12 pt-6 sm:px-6 sm:pt-9">
      <Link href="/worker/dashboard" className="mb-5 inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-white/45 transition hover:text-cyan"><ArrowLeft size={15} />{copy.back}</Link>
      <div className="mb-6"><span className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] text-cyan"><Wallet size={13} />FIXORA WORKSPACE</span><h1 className="text-2xl font-bold leading-relaxed sm:text-3xl">{copy.title}</h1><p className="mt-1 text-sm leading-7 text-white/50">{copy.subtitle}</p></div>

      <section className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: copy.today, value: 'PKR 4,500', icon: Banknote, style: 'text-cyan bg-cyan/10' },
          { label: copy.week, value: 'PKR 28,750', icon: CalendarDays, style: 'text-blue-200 bg-blue/10' },
          { label: copy.paidOut, value: 'PKR 57,450', icon: CheckCircle2, style: 'text-emerald-200 bg-emerald-300/10' },
          { label: copy.pending, value: 'PKR 7,300', icon: Clock3, style: 'text-orange bg-orange/10' },
        ].map(({ label, value, icon: Icon, style }) => <article key={label} className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 sm:p-5"><div className="mb-4 flex items-center justify-between gap-2"><span className="text-[10px] leading-5 text-white/50 sm:text-xs">{label}</span><span className={`grid h-9 w-9 place-items-center rounded-xl ${style}`}><Icon size={17} /></span></div><strong className="text-base font-bold sm:text-lg">{value}</strong></article>)}
      </section>

      <section className="mb-5 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><h2 className="text-base font-bold sm:text-lg">{copy.trend}</h2><p className="mt-1 text-[11px] text-white/40">{language === 'ur' ? 'ہر مکمل کام کے بعد آمدنی اپ ڈیٹ ہوگی' : 'Updates as you complete jobs'}</p></div><div className="flex rounded-xl border border-white/[0.08] bg-[#101426]/75 p-1">{(['week', 'month'] as Period[]).map((item) => <button key={item} type="button" onClick={() => setPeriod(item)} aria-pressed={period === item} className={`min-h-9 rounded-lg px-3 text-[10px] font-semibold transition ${period === item ? 'bg-blue text-white' : 'text-white/45 hover:text-white'}`}>{item === 'week' ? copy.weekPeriod : copy.monthPeriod}</button>)}</div></div>
        <div className="mb-3 flex items-end justify-between gap-2"><strong className="text-2xl sm:text-3xl">{period === 'week' ? 'PKR 28,750' : 'PKR 86,200'}</strong><span className="inline-flex items-center gap-1 pb-1 text-[10px] font-semibold text-emerald-200"><TrendingUp size={13} />{language === 'ur' ? 'گزشتہ مدت سے 12٪ زیادہ' : '12% from previous period'}</span></div>
        <div className="flex h-36 items-end justify-between gap-2 border-b border-white/[0.08] px-1 sm:h-44 sm:gap-4" aria-label={copy.trend}>
          {values.map((value, index) => <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className={`w-full max-w-11 rounded-t-md transition-colors ${index === values.length - 1 ? 'bg-cyan' : 'bg-blue/40 hover:bg-blue/70'}`} style={{ height: `${Math.max(10, value / max * 86)}%` }} /><span className="pb-2 text-[9px] text-white/35">{period === 'week' ? copy.daysWeek[index] : copy.daysMonth[index]}</span></div>)}
        </div>
      </section>

      <section className="mb-5 flex flex-col gap-4 rounded-2xl border border-emerald-300/15 bg-gradient-to-br from-emerald-300/[0.08] to-cyan/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-300/10 text-emerald-200"><Banknote size={20} /></span><div><h2 className="text-sm font-bold">{copy.payout}</h2><p className="mt-1 text-[11px] text-white/45">{copy.payoutDate}</p></div></div><p className="max-w-sm text-[10px] leading-5 text-white/45">{copy.payoutHint}</p>
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 sm:p-6">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-base font-bold sm:text-lg">{copy.transactions}</h2><p className="mt-1 text-[11px] text-white/40">{language === 'ur' ? 'آپ کی حالیہ ادائیگیاں' : 'Your latest payments'}</p></div><Link href="/worker/jobs" className="inline-flex min-h-10 items-center gap-2 self-start rounded-xl px-3 text-[11px] font-semibold text-cyan hover:bg-cyan/10">{copy.viewJob}<ArrowUpRight size={14} /></Link></div>
        <div className="mb-4 flex gap-2 overflow-x-auto">{(['all', 'paid', 'pending'] as PaymentFilter[]).map((value) => <button key={value} type="button" onClick={() => setFilter(value)} aria-pressed={filter === value} className={`min-h-9 shrink-0 rounded-xl px-3 text-[10px] font-semibold transition ${filter === value ? 'bg-white/[0.1] text-white' : 'text-white/45 hover:bg-white/[0.05]'}`}>{copy[value === 'pending' ? 'filterPending' : value]}</button>)}</div>
        <div className="grid gap-2">
          {filtered.map((payment) => <article key={payment.id} className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-[#101426]/65 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan/[0.08] text-cyan"><Banknote size={17} /></span><div className="min-w-0"><h3 className="truncate text-xs font-bold">{language === 'ur' ? copy.jobs[payment.job as keyof typeof copy.jobs] : payment.job}</h3><p className="mt-1 truncate text-[10px] text-white/40">{language === 'ur' ? copy.customers[payment.customer as keyof typeof copy.customers] : payment.customer} · #{payment.id}</p></div></div>
            <div className="flex items-center justify-between gap-3 ps-12 sm:ps-0"><span className="text-[10px] text-white/40">{language === 'ur' ? copy.dates[payment.date as keyof typeof copy.dates] : payment.date}</span><strong className="text-xs">PKR {payment.amount.toLocaleString('en-PK')}</strong><span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${payment.state === 'paid' ? 'bg-emerald-300/10 text-emerald-200' : 'bg-orange/10 text-orange'}`}>{payment.state === 'paid' ? copy.statusPaid : copy.statusPending}</span></div>
          </article>)}
          {filtered.length === 0 && <div className="rounded-xl border border-dashed border-white/10 py-8 text-center text-xs text-white/40">{copy.noItems}</div>}
        </div>
      </section>
    </div>
  </main>;
}
