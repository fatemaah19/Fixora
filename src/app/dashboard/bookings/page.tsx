'use client';

import { useEffect, useState } from 'react';
import { useT } from '@/contexts/LanguageProvider';
import { getBookings } from '@/lib/api';
import { readLocalServiceRequests } from '@/lib/serviceRequestData';
import { trades, workers } from '@/lib/mockData';
import { localizedText } from '@/lib/localization';
import type { ServiceRequest } from '@/lib/types';
import { CalendarDays, Clock } from 'lucide-react';

export default function BookingsPage() {
  const { language } = useT();
  const ur = language === 'ur';
  const [list, setList] = useState<ServiceRequest[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getBookings('c1').then((base) => {
      const localRequests = readLocalServiceRequests();
      const localIds = new Set(localRequests.map((request) => request.id));
      setList([...localRequests, ...base.filter((request) => !localIds.has(request.id))]);
    });
  }, []);

  const statusLabel = (status: string) => ur
    ? ({ requested: 'درخواست موصول', booked: 'کنفرم', completed: 'مکمل', cancelled: 'منسوخ' } as Record<string, string>)[status]
    : ({ requested: 'Requested', booked: 'Booked', completed: 'Completed', cancelled: 'Cancelled' } as Record<string, string>)[status];
  const filterLabel = (status: string) => ur
    ? ({ all: 'تمام', requested: 'درخواستیں', booked: 'کنفرم', completed: 'مکمل', cancelled: 'منسوخ' } as Record<string, string>)[status]
    : ({ all: 'All', requested: 'Requested', booked: 'Booked', completed: 'Completed', cancelled: 'Cancelled' } as Record<string, string>)[status];
  const filtered = list.filter((booking) => filter === 'all' || booking.status === filter);

  return <div>
    <div className="fx-page-heading"><span className="fx-eyebrow">{ur ? 'سروس ٹریکنگ' : 'SERVICE TRACKING'}</span><h1>{ur ? 'میری بکنگ' : 'My bookings'}</h1><p>{ur ? 'اپنی تمام سروس درخواستوں کا اسٹیٹس دیکھیں۔' : 'View and track all your service requests.'}</p></div>
    <div className="fx-booking-filters">{['all', 'requested', 'booked', 'completed', 'cancelled'].map((status) => <button key={status} className={filter === status ? 'active' : ''} onClick={() => setFilter(status)}>{filterLabel(status)}</button>)}</div>
    <div className="fx-bookings-list">{filtered.map((booking) => {
      const selectedWorker = workers.find((worker) => worker.id === booking.workerId);
      return <article className="fx-booking-detail" key={booking.id}>
        <div className="fx-booking-detail-icon"><CalendarDays size={20} /></div>
        <div className="fx-booking-detail-main"><div className="fx-booking-detail-title"><h3>{ur ? trades.find((trade) => trade.id === booking.tradeId)?.labelUr : trades.find((trade) => trade.id === booking.tradeId)?.label}</h3><span className={'fx-status ' + booking.status}>{statusLabel(booking.status)}</span></div>
          <p>{localizedText(language, booking.description, booking.descriptionEn, 'Request details were submitted in Urdu.')}</p>
          <div className="fx-booking-detail-meta"><span><Clock size={14} />{booking.createdAt}</span><span>#{booking.id.toUpperCase()}</span><span>{booking.area}</span>{booking.workerId && <span>{ur ? 'کاریگر' : 'Professional'}: {selectedWorker ? localizedText(language, selectedWorker.name, selectedWorker.nameEn, 'Professional') : booking.workerId}</span>}</div>
        </div>
      </article>;
    })}</div>
    {filtered.length === 0 && <div className="fx-empty">{ur ? 'اس فلٹر میں کوئی بکنگ نہیں' : 'No bookings in this filter'}</div>}
  </div>;
}
