'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Bell, BriefcaseBusiness, CalendarCheck, CircleDollarSign, Headset, ShieldCheck, Star, UserRound } from 'lucide-react';
import { useT } from '@/contexts/LanguageProvider';
import { markAllNotificationsRead, markNotificationRead, readNotifications, type LocalNotification, type NotificationRole } from '@/lib/notificationData';

function NotificationIcon({ item }: { item: LocalNotification }) {
  const Icon = item.kind === 'booking' ? CalendarCheck : item.kind === 'job' ? BriefcaseBusiness
    : item.kind === 'passport' ? ShieldCheck : item.kind === 'support' ? Headset : item.kind === 'review' ? Star
    : item.kind === 'earnings' ? CircleDollarSign : item.kind === 'profile' ? UserRound : Bell;
  return <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-cyan/15 bg-cyan/[0.08] text-cyan"><Icon size={19} /></span>;
}
function ageLabel(minutes: number, urdu: boolean) {
  if (minutes < 60) return urdu ? minutes + ' منٹ پہلے' : minutes + ' min ago';
  if (minutes < 1440) { const hours = Math.floor(minutes / 60); return urdu ? hours + ' گھنٹے پہلے' : hours + ' hr ago'; }
  const days = Math.floor(minutes / 1440);
  return urdu ? days + ' دن پہلے' : days + (days === 1 ? ' day ago' : ' days ago');
}

export function NotificationCenter({ role }: { role: NotificationRole }) {
  const { language } = useT();
  const urdu = language === 'ur';
  const [items, setItems] = useState<LocalNotification[]>([]);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  useEffect(() => { setItems(readNotifications(role)); setReady(true); }, [role]);
  const unread = items.filter((item) => !item.isRead).length;
  const shown = useMemo(() => filter === 'unread' ? items.filter((item) => !item.isRead) : items, [filter, items]);
  const copy = urdu
    ? { eyebrow: 'تازہ اپ ڈیٹس', title: 'اطلاعات', description: 'آپ کی بکنگ اور اکاؤنٹ سے متعلق تازہ ترین خبریں۔', all: 'تمام', unread: 'نئی', markAll: 'سب کو پڑھا ہوا کریں', newLabel: 'نئی اطلاع', view: 'تفصیل دیکھیں', read: 'پڑھی گئی', empty: 'سب اپ ڈیٹس دیکھ لی گئیں', emptyText: 'نئی اطلاع آنے پر وہ یہاں نظر آئے گی۔', noUnread: 'کوئی نئی اطلاع نہیں', back: 'ڈیش بورڈ', loading: 'لوڈ ہو رہا ہے…', markRead: 'پڑھ لیا' }
    : { eyebrow: 'UPDATES', title: 'Notifications', description: 'The latest updates about your bookings and account.', all: 'All', unread: 'Unread', markAll: 'Mark all as read', newLabel: 'New', view: 'View details', read: 'Read', empty: 'You are all caught up', emptyText: 'New updates will appear here when they arrive.', noUnread: 'No unread notifications', back: 'Dashboard', loading: 'Loading…', markRead: 'Mark as read' };
  function markRead(id: string) {
    markNotificationRead(role, id);
    setItems((current) => current.map((item) => item.id === id ? { ...item, isRead: true } : item));
  }
  function markAll() {
    markAllNotificationsRead(role);
    setItems((current) => current.map((item) => ({ ...item, isRead: true })));
  }
  const home = role === 'worker' ? '/worker/dashboard' : '/dashboard';
  return <main className="mx-auto min-h-[calc(100vh-72px)] max-w-5xl px-4 py-6 text-white sm:px-6 sm:py-10">
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4 sm:mb-8">
      <div><div className="mb-2 text-[10px] font-bold tracking-[0.18em] text-cyan">{copy.eyebrow}</div><h1 className="text-2xl font-bold leading-relaxed sm:text-3xl">{copy.title}</h1><p className="mt-1 text-sm leading-7 text-white/55">{copy.description}</p></div>
      <Link href={home} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-white/70 transition hover:bg-white/[0.08]">{urdu ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}{copy.back}</Link>
    </div>
    <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.035]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setFilter('all')} aria-pressed={filter === 'all'} className={'min-h-9 rounded-xl px-3 text-xs font-semibold transition ' + (filter === 'all' ? 'bg-blue text-white' : 'bg-white/[0.04] text-white/55 hover:text-white')}>{copy.all}<span className="ms-2 opacity-75">{items.length}</span></button>
          <button type="button" onClick={() => setFilter('unread')} aria-pressed={filter === 'unread'} className={'min-h-9 rounded-xl px-3 text-xs font-semibold transition ' + (filter === 'unread' ? 'bg-blue text-white' : 'bg-white/[0.04] text-white/55 hover:text-white')}>{copy.unread}<span className="ms-2 opacity-75">{unread}</span></button>
        </div>
        <button type="button" onClick={markAll} disabled={unread === 0} className="min-h-9 rounded-xl px-2 text-xs font-semibold text-cyan transition hover:bg-cyan/10 disabled:cursor-default disabled:opacity-40">{copy.markAll}</button>
      </div>
      {!ready ? <div className="p-8 text-center text-sm text-white/45">{copy.loading}</div>
        : shown.length === 0
          ? <div className="px-6 py-14 text-center"><span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.05] text-white/35"><Bell size={21} /></span><h2 className="text-base font-bold">{filter === 'unread' ? copy.noUnread : copy.empty}</h2><p className="mt-2 text-xs leading-6 text-white/45">{copy.emptyText}</p></div>
          : <ul className="divide-y divide-white/[0.06]">{shown.map((item) => <li key={item.id} className={'flex gap-3 p-4 transition sm:gap-4 sm:p-5 ' + (!item.isRead ? 'bg-cyan/[0.025]' : '')}>
              <NotificationIcon item={item} /><div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1"><h2 className={'text-sm leading-6 ' + (!item.isRead ? 'font-bold text-white' : 'font-semibold text-white/75')}>{urdu ? item.titleUr : item.titleEn}</h2>{!item.isRead && <span className="rounded-full bg-cyan/10 px-2 py-0.5 text-[9px] font-bold text-cyan">{copy.newLabel}</span>}<time className="ms-auto text-[10px] text-white/40 [direction:ltr]">{ageLabel(item.minutesAgo, urdu)}</time></div>
                <p className="mt-1 text-xs leading-6 text-white/55">{urdu ? item.messageUr : item.messageEn}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Link href={item.href} onClick={() => markRead(item.id)} className="inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-white/[0.05] px-2.5 text-[10px] font-semibold text-white/75 transition hover:bg-white/[0.1]">{copy.view}<span aria-hidden="true">{urdu ? '←' : '→'}</span></Link>
                  {item.isRead ? <span className="text-[10px] text-white/35">{copy.read}</span> : <button type="button" onClick={() => markRead(item.id)} className="min-h-8 px-1 text-[10px] font-semibold text-cyan/80 transition hover:text-cyan">{copy.markRead}</button>}
                </div>
              </div>
            </li>)}</ul>}
    </section>
  </main>;
}