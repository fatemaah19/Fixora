'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3, Plus, Save, Sun, Sunset } from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Logo } from '@/components/Logo';
import { useT } from '@/contexts/LanguageProvider';

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
type DaySchedule = { working: boolean; slots: string[] };
type ScheduleState = Record<DayKey, DaySchedule>;

const STORAGE_KEY = 'fixora-worker-schedule';
const days: { key: DayKey; en: string; ur: string; shortEn: string; shortUr: string }[] = [
  { key: 'mon', en: 'Monday', ur: 'پیر', shortEn: 'Mon', shortUr: 'پیر' },
  { key: 'tue', en: 'Tuesday', ur: 'منگل', shortEn: 'Tue', shortUr: 'منگل' },
  { key: 'wed', en: 'Wednesday', ur: 'بدھ', shortEn: 'Wed', shortUr: 'بدھ' },
  { key: 'thu', en: 'Thursday', ur: 'جمعرات', shortEn: 'Thu', shortUr: 'جمعرات' },
  { key: 'fri', en: 'Friday', ur: 'جمعہ', shortEn: 'Fri', shortUr: 'جمعہ' },
  { key: 'sat', en: 'Saturday', ur: 'ہفتہ', shortEn: 'Sat', shortUr: 'ہفتہ' },
  { key: 'sun', en: 'Sunday', ur: 'اتوار', shortEn: 'Sun', shortUr: 'اتوار' },
];

const defaultSchedule: ScheduleState = {
  mon: { working: true, slots: ['09:00', '11:00', '14:00', '16:00'] },
  tue: { working: true, slots: ['09:00', '11:00', '14:00', '16:00'] },
  wed: { working: true, slots: ['09:00', '11:00', '14:00', '16:00'] },
  thu: { working: true, slots: ['09:00', '11:00', '14:00', '16:00'] },
  fri: { working: true, slots: ['09:00', '11:00', '14:00'] },
  sat: { working: true, slots: ['09:00', '11:00'] },
  sun: { working: false, slots: [] },
};

const slotOptions = ['09:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const slotText: Record<string, string> = { '09:00': '9:00 AM', '11:00': '11:00 AM', '13:00': '1:00 PM', '14:00': '2:00 PM', '15:00': '3:00 PM', '16:00': '4:00 PM', '17:00': '5:00 PM' };

const ur = {
  title: 'کام کا شیڈول', subtitle: 'اپنے کام کے دن اور دستیاب وقت ترتیب دیں۔', back: 'ڈیش بورڈ',
  week: 'ہفتہ وار دستیابی', activeDays: 'کام کے دن', weeklyHours: 'دستیاب گھنٹے',
  working: 'کام کے لیے دستیاب', dayOff: 'چھٹی کا دن', workingHint: 'صارفین اس دن آپ کو کام بھیج سکتے ہیں۔', offHint: 'اس دن نئی بکنگ موصول نہیں ہوگی۔',
  slots: 'دستیاب اوقات', addSlot: 'وقت شامل کریں', removeSlot: 'منتخب وقت ہٹائیں', noSlots: 'اس دن کے لیے اوقات منتخب نہیں کیے گئے۔',
  save: 'شیڈول محفوظ کریں', saved: 'آپ کا شیڈول اس ڈیوائس پر محفوظ ہو گیا۔', hours: 'گھنٹے', appointment: 'ہر وقت کا سلاٹ دو گھنٹے کا ہے۔',
  morning: 'صبح', afternoon: 'دوپہر', choose: 'دن منتخب کریں',
};
const en = {
  title: 'Work schedule', subtitle: 'Set the days and hours when customers can book you.', back: 'Dashboard',
  week: 'Weekly availability', activeDays: 'Working days', weeklyHours: 'Available hours',
  working: 'Available for work', dayOff: 'Day off', workingHint: 'Customers can send you jobs on this day.', offHint: 'You will not receive new bookings on this day.',
  slots: 'Available time slots', addSlot: 'Add time', removeSlot: 'Remove selected time', noSlots: 'No time slots selected for this day.',
  save: 'Save schedule', saved: 'Your schedule has been saved on this device.', hours: 'hrs', appointment: 'Each booking slot is two hours.',
  morning: 'Morning', afternoon: 'Afternoon', choose: 'Choose a day',
};

function isScheduleState(value: unknown): value is ScheduleState {
  if (!value || typeof value !== 'object') return false;
  return days.every(({ key }) => {
    const day = (value as Record<string, unknown>)[key];
    return !!day && typeof day === 'object' && typeof (day as DaySchedule).working === 'boolean' && Array.isArray((day as DaySchedule).slots);
  });
}

export function WorkerSchedule() {
  const { language } = useT();
  const copy = language === 'ur' ? ur : en;
  const [schedule, setSchedule] = useState<ScheduleState | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayKey>('mon');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : null;
      setSchedule(isScheduleState(parsed) ? parsed : defaultSchedule);
    } catch {
      setSchedule(defaultSchedule);
    }
  }, []);

  const day = schedule?.[selectedDay];
  const workingDays = useMemo(() => schedule ? days.filter(({ key }) => schedule[key].working).length : 0, [schedule]);
  const weeklyHours = useMemo(() => schedule ? days.reduce((total, { key }) => total + (schedule[key].working ? schedule[key].slots.length * 2 : 0), 0) : 0, [schedule]);

  function updateSelectedDay(update: (current: DaySchedule) => DaySchedule) {
    setSchedule((current) => current ? { ...current, [selectedDay]: update(current[selectedDay]) } : current);
    setSaved(false);
  }

  function toggleSlot(time: string) {
    updateSelectedDay((current) => ({
      ...current,
      slots: current.slots.includes(time) ? current.slots.filter((slot) => slot !== time) : [...current.slots, time].sort(),
    }));
  }

  function saveSchedule() {
    if (!schedule) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  }

  const selectedMeta = days.find(({ key }) => key === selectedDay)!;

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
        <div><span className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] text-cyan"><CalendarDays size={13} />FIXORA WORKSPACE</span><h1 className="text-2xl font-bold leading-relaxed sm:text-3xl">{copy.title}</h1><p className="mt-1 text-sm leading-7 text-white/50">{copy.subtitle}</p></div>
        <button type="button" onClick={saveSchedule} disabled={!schedule} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue to-cyan px-5 text-xs font-bold text-white shadow-lg shadow-blue/10 transition hover:brightness-110 disabled:opacity-50"><Save size={15} />{copy.save}</button>
      </div>

      {saved && <p role="status" className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] px-4 py-3 text-xs text-emerald-200"><Check size={15} />{copy.saved}</p>}
      {!schedule || !day ? <div className="h-96 animate-pulse rounded-2xl bg-white/[0.04]" aria-label={language === 'ur' ? 'شیڈول لوڈ ہو رہا ہے' : 'Loading schedule'} /> : <>
        <section className="mb-5 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 sm:p-6">
          <div className="mb-4 flex items-center gap-2"><CalendarDays size={17} className="text-cyan" /><h2 className="text-sm font-bold">{copy.week}</h2></div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {days.map((item) => {
              const selected = item.key === selectedDay;
              const enabled = schedule[item.key].working;
              return <button key={item.key} type="button" onClick={() => { setSelectedDay(item.key); setSaved(false); }} aria-pressed={selected} className={`flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-xl border px-2 transition ${selected ? 'border-cyan/40 bg-cyan/[0.1] text-white' : 'border-white/[0.07] bg-[#101426]/70 text-white/65 hover:border-white/15'}`}>
                <span className="text-xs font-bold">{language === 'ur' ? item.shortUr : item.shortEn}</span><span className={`h-1.5 w-1.5 rounded-full ${enabled ? 'bg-emerald-300' : 'bg-white/20'}`} />
              </button>;
            })}
          </div>
        </section>

        <section className="mb-5 grid grid-cols-2 gap-3">
          <article className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4"><span className="text-[10px] text-white/45">{copy.activeDays}</span><div className="mt-2 flex items-end gap-2"><strong className="text-2xl">{workingDays}</strong><span className="pb-1 text-[10px] text-white/35">/ 7</span></div></article>
          <article className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4"><span className="text-[10px] text-white/45">{copy.weeklyHours}</span><div className="mt-2 flex items-end gap-2"><strong className="text-2xl">{weeklyHours}</strong><span className="pb-1 text-[10px] text-white/35">{copy.hours}</span></div></article>
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 sm:p-6">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div><h2 className="text-base font-bold sm:text-lg">{language === 'ur' ? selectedMeta.ur : selectedMeta.en}</h2><p className="mt-1 text-[11px] text-white/40">{copy.choose}</p></div>
            <button type="button" onClick={() => updateSelectedDay((current) => ({ ...current, working: !current.working }))} aria-pressed={day.working} className={`inline-flex min-h-11 items-center justify-between gap-4 rounded-xl border px-4 text-xs font-semibold transition sm:min-w-60 ${day.working ? 'border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-200' : 'border-white/10 bg-white/[0.035] text-white/55'}`}>
              <span className="inline-flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${day.working ? 'bg-emerald-300' : 'bg-white/25'}`} />{day.working ? copy.working : copy.dayOff}</span><span className={`relative h-6 w-10 rounded-full ${day.working ? 'bg-emerald-400' : 'bg-white/20'}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${day.working ? 'start-5' : 'start-1'}`} /></span>
            </button>
          </div>

          {day.working ? <>
            <p className="mb-4 text-[11px] text-white/45">{copy.workingHint}</p>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold text-white/80"><Sun size={15} className="text-amber-300" />{copy.morning}</div>
            <div className="mb-5 flex flex-wrap gap-2">
              {slotOptions.slice(0, 2).map((time) => <button key={time} type="button" onClick={() => toggleSlot(time)} aria-pressed={day.slots.includes(time)} className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 text-[11px] font-semibold transition ${day.slots.includes(time) ? 'border-cyan/35 bg-cyan/10 text-cyan' : 'border-white/[0.08] bg-[#101426]/70 text-white/45 hover:border-white/20'}`}><Clock3 size={13} />{slotText[time]}{day.slots.includes(time) && <Check size={13} />}</button>)}
            </div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold text-white/80"><Sunset size={15} className="text-orange" />{copy.afternoon}</div>
            <div className="mb-4 flex flex-wrap gap-2">
              {slotOptions.slice(2).map((time) => <button key={time} type="button" onClick={() => toggleSlot(time)} aria-pressed={day.slots.includes(time)} className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 text-[11px] font-semibold transition ${day.slots.includes(time) ? 'border-cyan/35 bg-cyan/10 text-cyan' : 'border-white/[0.08] bg-[#101426]/70 text-white/45 hover:border-white/20'}`}><Clock3 size={13} />{slotText[time]}{day.slots.includes(time) && <Check size={13} />}</button>)}
            </div>
            {day.slots.length === 0 ? <p className="rounded-xl border border-dashed border-white/10 py-5 text-center text-xs text-white/40">{copy.noSlots}</p> : <p className="text-[10px] text-white/35">{day.slots.length * 2} {copy.hours} · {copy.appointment}</p>}
          </> : <div className="rounded-xl border border-dashed border-white/10 bg-[#101426]/50 p-5 text-center"><p className="text-xs text-white/45">{copy.offHint}</p><button type="button" onClick={() => updateSelectedDay((current) => ({ ...current, working: true }))} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-cyan/20 bg-cyan/[0.06] px-4 text-[11px] font-semibold text-cyan"><Plus size={14} />{copy.working}</button></div>}
        </section>
      </>}
    </div>
  </main>;
}
