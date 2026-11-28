'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useT } from '@/contexts/LanguageProvider';
import { getBookings } from '@/lib/api';
import { readLocalServiceRequests } from '@/lib/serviceRequestData';
import { readLocalBookingReviews, saveLocalBookingReview } from '@/lib/bookingReviewData';
import type { LocalBookingReview } from '@/lib/bookingReviewData';
import { trades, workers } from '@/lib/mockData';
import { localizedText } from '@/lib/localization';
import type { ServiceRequest } from '@/lib/types';
import { CalendarDays, Clock, Star, X } from 'lucide-react';

export default function BookingsPage() {
  const { language } = useT();
  const ur = language === 'ur';
  const [list, setList] = useState<ServiceRequest[]>([]);
  const [reviews, setReviews] = useState<LocalBookingReview[]>([]);
  const [filter, setFilter] = useState('all');
  const [reviewing, setReviewing] = useState<ServiceRequest | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    getBookings('c1').then((base) => {
      const localRequests = readLocalServiceRequests();
      const localIds = new Set(localRequests.map((request) => request.id));
      setList([...localRequests, ...base.filter((request) => !localIds.has(request.id))]);
    });
    setReviews(readLocalBookingReviews('c1'));
  }, []);

  const statusLabel = (status: string) => ur
    ? ({ requested: 'درخواست موصول', booked: 'کنفرم', completed: 'مکمل', cancelled: 'منسوخ' } as Record<string, string>)[status]
    : ({ requested: 'Requested', booked: 'Booked', completed: 'Completed', cancelled: 'Cancelled' } as Record<string, string>)[status];
  const filterLabel = (status: string) => ur
    ? ({ all: 'تمام', requested: 'درخواستیں', booked: 'کنفرم', completed: 'مکمل', cancelled: 'منسوخ' } as Record<string, string>)[status]
    : ({ all: 'All', requested: 'Requested', booked: 'Booked', completed: 'Completed', cancelled: 'Cancelled' } as Record<string, string>)[status];
  const filtered = list.filter((booking) => filter === 'all' || booking.status === filter);

  function openReview(booking: ServiceRequest) {
    const existing = reviews.find((review) => review.bookingId === booking.id);
    setReviewing(booking);
    setRating(existing?.rating ?? 0);
    setComment(existing?.comment ?? '');
  }

  function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reviewing || rating < 1 || !comment.trim()) return;

    const review: LocalBookingReview = {
      bookingId: reviewing.id,
      customerId: reviewing.customerId,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    saveLocalBookingReview(review);
    setReviews((current) => [review, ...current.filter((item) => item.bookingId !== review.bookingId)]);
    setReviewing(null);
    setNotice(ur ? 'آپ کا جائزہ اس ڈیوائس پر محفوظ ہوگیا۔' : 'Your review was saved on this device.');
  }

  return <div>
    <div className="fx-page-heading"><span className="fx-eyebrow">{ur ? 'سروس ٹریکنگ' : 'SERVICE TRACKING'}</span><h1>{ur ? 'میری بکنگ' : 'My bookings'}</h1><p>{ur ? 'اپنی تمام سروس درخواستوں کا اسٹیٹس دیکھیں۔' : 'View and track all your service requests.'}</p></div>
    {notice && <p className="fx-review-notice" role="status">{notice}</p>}
    <div className="fx-booking-filters">{['all', 'requested', 'booked', 'completed', 'cancelled'].map((status) => <button key={status} className={filter === status ? 'active' : ''} onClick={() => setFilter(status)}>{filterLabel(status)}</button>)}</div>
    <div className="fx-bookings-list">{filtered.map((booking) => {
      const selectedWorker = workers.find((worker) => worker.id === booking.workerId);
      const review = reviews.find((item) => item.bookingId === booking.id);
      return <article className="fx-booking-detail" key={booking.id}>
        <div className="fx-booking-detail-icon"><CalendarDays size={20} /></div>
        <div className="fx-booking-detail-main"><div className="fx-booking-detail-title"><h3>{ur ? trades.find((trade) => trade.id === booking.tradeId)?.labelUr : trades.find((trade) => trade.id === booking.tradeId)?.label}</h3><span className={'fx-status ' + booking.status}>{statusLabel(booking.status)}</span></div>
          <p>{localizedText(language, booking.description, booking.descriptionEn, 'Request details were submitted in Urdu.')}</p>
          <div className="fx-booking-detail-meta"><span><Clock size={14} />{booking.createdAt}</span><span>#{booking.id.toUpperCase()}</span><span>{booking.area}</span>{booking.workerId && <span>{ur ? 'کاریگر' : 'Professional'}: {selectedWorker ? localizedText(language, selectedWorker.name, selectedWorker.nameEn, 'Professional') : booking.workerId}</span>}</div>
          {review && <div className="fx-customer-review">
            <div className="fx-customer-review-rating" aria-label={ur ? String(review.rating) + ' میں سے 5 ستارے' : String(review.rating) + ' out of 5 stars'}>
              {Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill={index < review.rating ? 'currentColor' : 'none'} />)}
              <strong>{review.rating}/5</strong>
              <span>{ur ? 'آپ کا جائزہ' : 'Your review'}</span>
            </div>
            <p>{review.comment}</p>
            <small>{review.createdAt}</small>
          </div>}
          {booking.status === 'completed' && <button type="button" className="fx-review-action" onClick={() => openReview(booking)}>
            <Star size={15} fill={review ? 'currentColor' : 'none'} />
            {review ? (ur ? 'جائزہ تبدیل کریں' : 'Edit review') : (ur ? 'جائزہ دیں' : 'Leave a review')}
          </button>}
        </div>
      </article>;
    })}</div>
    {filtered.length === 0 && <div className="fx-empty">{ur ? 'اس فلٹر میں کوئی بکنگ نہیں' : 'No bookings in this filter'}</div>}

    {reviewing && <div className="fx-review-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setReviewing(null); }}>
      <section className="fx-review-dialog" role="dialog" aria-modal="true" aria-labelledby="fx-review-title" aria-describedby="fx-review-description">
        <div className="fx-review-dialog-head">
          <div><span className="fx-eyebrow">{ur ? 'مکمل سروس' : 'COMPLETED SERVICE'}</span><h2 id="fx-review-title">{ur ? 'اپنے تجربے کی درجہ بندی کریں' : 'Rate your experience'}</h2></div>
          <button type="button" className="fx-review-close" aria-label={ur ? 'بند کریں' : 'Close'} onClick={() => setReviewing(null)}><X size={18} /></button>
        </div>
        <p id="fx-review-description" className="fx-review-dialog-copy">{ur ? 'آپ کی رائے دوسروں کو بہتر کاریگر منتخب کرنے میں مدد دیتی ہے۔' : 'Your feedback helps others choose a professional.'}</p>
        <form className="fx-review-form" onSubmit={submitReview}>
          <label>{ur ? 'آپ کی ریٹنگ' : 'Your rating'}</label>
          <div className="fx-review-stars">
            {Array.from({ length: 5 }, (_, index) => {
              const value = index + 1;
              return <button key={value} type="button" aria-label={ur ? String(value) + ' میں سے 5 ستارے' : String(value) + ' out of 5 stars'} aria-pressed={rating === value} onClick={() => setRating(value)}>
                <Star size={29} fill={value <= rating ? 'currentColor' : 'none'} />
              </button>;
            })}
            <span>{rating > 0 ? String(rating) + '/5' : (ur ? 'ریٹنگ منتخب کریں' : 'Select a rating')}</span>
          </div>
          <label htmlFor="fx-review-comment">{ur ? 'آپ کا جائزہ' : 'Your review'}</label>
          <textarea id="fx-review-comment" value={comment} onChange={(event) => setComment(event.target.value)} maxLength={500} required rows={4} autoFocus placeholder={ur ? 'سروس کے بارے میں اپنا تجربہ لکھیں…' : 'Tell us about your service experience…'} />
          <div className="fx-review-form-foot"><span>{ur ? 'آپ کا جائزہ صرف اسی ڈیوائس پر محفوظ ہوگا۔' : 'Your review is stored on this device only.'}</span><small>{comment.length}/500</small></div>
          <button type="submit" className="fx-primary-btn" disabled={rating < 1 || !comment.trim()}>{ur ? 'جائزہ محفوظ کریں' : 'Save review'}</button>
        </form>
      </section>
    </div>}
  </div>;
}
