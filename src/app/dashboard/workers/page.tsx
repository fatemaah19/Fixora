'use client';

import { useEffect, useState } from 'react';
import { useT } from '@/contexts/LanguageProvider';
import { getRankedWorkers } from '@/lib/api';
import { trades } from '@/lib/mockData';
import type { Worker, TradeId } from '@/lib/types';
import { localizedText } from '@/lib/localization';
import { saveLocalServiceRequest } from '@/lib/serviceRequestData';
import { Star, MapPin, BriefcaseBusiness, MessageCircle, CalendarCheck, Search } from 'lucide-react';

export default function WorkersPage() {
  const { language } = useT();
  const ur = language === 'ur';
  const displayName = (worker: Worker) => localizedText(language, worker.name, worker.nameEn, 'Professional');
  const displayBio = (worker: Worker) => localizedText(language, worker.bio, worker.bioEn, 'Profile details are available in Urdu.');
  const [trade, setTrade] = useState<TradeId | 'all'>('all');
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [search, setSearch] = useState('');
  const [booking, setBooking] = useState<Worker | null>(null);
  const [confirmed, setConfirmed] = useState('');

  useEffect(() => {
    if (trade === 'all') {
      Promise.all(trades.map((item) => getRankedWorkers(item.id)))
        .then((lists) => setWorkers(lists.flat().sort((a, b) => b.rating - a.rating)));
    } else {
      getRankedWorkers(trade).then(setWorkers);
    }
  }, [trade]);

  const normalizedSearch = search.trim().toLowerCase();
  const filtered = workers.filter((worker) =>
    worker.name.toLowerCase().includes(normalizedSearch)
    || displayName(worker).toLowerCase().includes(normalizedSearch)
    || displayBio(worker).toLowerCase().includes(normalizedSearch)
    || worker.area.toLowerCase().includes(normalizedSearch),
  );

  const book = (worker: Worker) => {
    const description = ur
      ? 'پروفیشنل پروفائل سے بکنگ کی درخواست۔'
      : 'Booking request from a professional profile.';
    saveLocalServiceRequest({
      id: 'local-' + Date.now(),
      customerId: 'c1',
      workerId: worker.id,
      tradeId: worker.tradeId,
      description,
      descriptionEn: ur ? undefined : description,
      area: worker.area,
      status: 'requested',
      createdAt: new Date().toISOString().slice(0, 10),
    });
    setConfirmed(displayName(worker));
    setBooking(null);
  };

  return <div>
    <div className="fx-page-heading">
      <span className="fx-eyebrow">{ur ? 'ماہر کاریگر' : 'PROFESSIONALS'}</span>
      <h1>{ur ? 'اپنے لیے بہترین کاریگر تلاش کریں' : 'Find the right professional'}</h1>
      <p>{ur ? 'ریٹنگ، تجربے اور علاقے کے مطابق ماہرین منتخب کریں۔' : 'Browse trusted professionals by trade, rating, and area.'}</p>
    </div>

    <div className="fx-worker-toolbar">
      <div className="fx-search">
        <Search size={17} />
        <input
          aria-label={ur ? 'نام یا علاقہ تلاش کریں' : 'Search name or area'}
          placeholder={ur ? 'نام یا علاقہ تلاش کریں' : 'Search name or area'}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <div className="fx-trade-tabs">
        <button type="button" className={trade === 'all' ? 'active' : ''} onClick={() => setTrade('all')}>{ur ? 'تمام' : 'All'}</button>
        {trades.map((item) => <button type="button" key={item.id} className={trade === item.id ? 'active' : ''} onClick={() => setTrade(item.id)}>{ur ? item.labelUr : item.label}</button>)}
      </div>
    </div>

    {confirmed && <div className="fx-inline-success" role="status" aria-live="polite">✓ {ur ? 'بکنگ درخواست بھیج دی گئی: ' : 'Booking request sent to: '}{confirmed}</div>}

    <div className="fx-workers-grid">
      {filtered.map((worker) => <article className="fx-worker-card" key={worker.id}>
        <div className="fx-worker-top">
          <div className="fx-worker-avatar">{worker.avatar}</div>
          <div className="fx-worker-rating"><Star size={14} fill="currentColor" /> {worker.rating.toFixed(1)} <small>({worker.reviews})</small></div>
        </div>
        <h3>{displayName(worker)}</h3>
        <span className="fx-worker-trade">{ur ? trades.find((item) => item.id === worker.tradeId)?.labelUr : trades.find((item) => item.id === worker.tradeId)?.label}</span>
        <p className="fx-worker-bio">{displayBio(worker)}</p>
        <div className="fx-worker-meta">
          <span><BriefcaseBusiness size={15} />{worker.experience} {ur ? 'سال تجربہ' : 'years experience'}</span>
          <span><MapPin size={15} />{worker.area}</span>
        </div>
        <div className="fx-worker-card-actions">
          <button type="button" className="fx-secondary-btn" onClick={() => setBooking(worker)}><CalendarCheck size={16} />{ur ? 'بک کریں' : 'Book'}</button>
          <a className="fx-whatsapp-btn" href={'https://wa.me/92' + worker.whatsapp.replace(/^0/, '')} target="_blank" rel="noreferrer">
            <MessageCircle size={16} />{ur ? 'واٹس ایپ' : 'WhatsApp'}
          </a>
        </div>
      </article>)}
    </div>

    {filtered.length === 0 && <div className="fx-empty">{ur ? 'کوئی کاریگر نہیں ملا' : 'No professionals found'}</div>}

    {booking && <div className="fx-modal-backdrop" onClick={() => setBooking(null)}>
      <div
        className="fx-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="fx-modal-close" aria-label={ur ? 'بند کریں' : 'Close'} onClick={() => setBooking(null)}>×</button>
        <div className="fx-modal-avatar">{booking.avatar}</div>
        <h2 id="booking-dialog-title">{ur ? 'بکنگ کی درخواست' : 'Request booking'}</h2>
        <p>{displayName(booking)} · {ur ? trades.find((item) => item.id === booking.tradeId)?.labelUr : trades.find((item) => item.id === booking.tradeId)?.label}</p>
        <div className="fx-booking-note">{ur ? 'یہ ایک ڈیمو درخواست ہے۔ کاریگر کو بکنگ کی درخواست بھیجنے کے لیے تصدیق کریں۔' : 'This is a demo booking request. Confirm to send your request to this professional.'}</div>
        <button type="button" className="fx-primary-btn full" onClick={() => book(booking)}>{ur ? 'بکنگ کی درخواست بھیجیں' : 'Send booking request'}</button>
      </div>
    </div>}
  </div>;
}
