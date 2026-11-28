'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Clock3, Headset, MessageCircle, Phone, Send } from 'lucide-react';
import { useT } from '@/contexts/LanguageProvider';
import { getComplaints } from '@/lib/api';
import { mergeLocalComplaints, saveLocalComplaint } from '@/lib/complaintData';
import type { Complaint } from '@/lib/types';

export default function SupportPage() {
  const { language } = useT();
  const ur = language === 'ur';
  const [message, setMessage] = useState('');
  const [booking, setBooking] = useState('');
  const [sent, setSent] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    getComplaints().then((items) => {
      setComplaints(mergeLocalComplaints(items).filter((complaint) => complaint.customerId === 'c1'));
    });
  }, []);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const complaint: Complaint = {
      id: `cp-${Date.now()}`,
      customerId: 'c1',
      bookingId: booking.trim() || undefined,
      message: message.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    saveLocalComplaint(complaint);
    setComplaints((items) => [complaint, ...items.filter((item) => item.id !== complaint.id)]);
    setMessage('');
    setBooking('');
    setSent(true);
  }

  const copy = ur
    ? {
        eyebrow: 'کسٹمر سپورٹ', title: 'مدد اور شکایت', subtitle: 'کسی مسئلے کا سامنا ہے؟ ہمیں بتائیں، ہم آپ کی مدد کریں گے۔',
        team: 'ہم آپ کی مدد کے لیے موجود ہیں', teamDetails: 'اپنی شکایت یا سوال درج کریں۔ FIXORA ٹیم آپ کی درخواست کا جائزہ لے گی۔',
        support: 'سپورٹ درخواست', supportHint: 'اپنی تفصیل فارم میں لکھیں', phone: 'فون سپورٹ', phoneHint: 'رابطہ تفصیلات جلد دستیاب ہوں گی',
        formTitle: 'شکایت درج کریں', booking: 'بکنگ آئی ڈی (اختیاری)', message: 'شکایت یا سوال کی تفصیل',
        messageHint: 'اپنا مسئلہ یہاں لکھیں…', send: 'شکایت بھیجیں', sentTitle: 'آپ کی شکایت جمع ہوگئی', sentText: 'ہم نے آپ کی شکایت محفوظ کر لی ہے۔ آپ اس صفحے پر جواب دیکھ سکتے ہیں۔',
        history: 'آپ کی سپورٹ درخواستیں', open: 'زیرِ کارروائی', resolved: 'حل شدہ', response: 'FIXORA کا جواب',
        noTickets: 'ابھی کوئی سپورٹ درخواست نہیں۔', received: 'موصول ہوئی',
      }
    : {
        eyebrow: 'CUSTOMER CARE', title: 'Help & support', subtitle: 'Having an issue? Tell us and we will help you.',
        team: 'We are here to help', teamDetails: 'Send us your question or complaint. The FIXORA team will review your request.',
        support: 'Support request', supportHint: 'Submit your details using the form', phone: 'Phone support', phoneHint: 'Contact details will be available soon',
        formTitle: 'Submit a complaint', booking: 'Booking ID (optional)', message: 'Complaint or question',
        messageHint: 'Describe your issue here…', send: 'Send complaint', sentTitle: 'Complaint submitted', sentText: 'Your complaint has been saved. You can check for a reply on this page.',
        history: 'Your support requests', open: 'Open', resolved: 'Resolved', response: 'FIXORA reply',
        noTickets: 'You have no support requests yet.', received: 'Received',
      };

  return <div>
    <div className="fx-page-heading"><span className="fx-eyebrow">{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.subtitle}</p></div>
    <div className="fx-support-grid">
      <section className="fx-panel fx-support-info">
        <div className="fx-support-big-icon"><Headset size={28} /></div>
        <h2>{copy.team}</h2>
        <p>{copy.teamDetails}</p>
        <div className="fx-support-contact"><MessageCircle size={18} /><div><strong>{copy.support}</strong><span>{copy.supportHint}</span></div></div>
        <div className="fx-support-contact"><Phone size={18} /><div><strong>{copy.phone}</strong><span>{copy.phoneHint}</span></div></div>
      </section>
      <section className="fx-panel fx-support-form">
        <h2>{copy.formTitle}</h2>
        {sent && <div role="status" aria-live="polite" className="fx-support-success"><CheckCircle2 size={32} /><h3>{copy.sentTitle}</h3><p>{copy.sentText}</p></div>}
        <form onSubmit={submit} className="fx-modal-form">
          <label htmlFor="support-booking">{copy.booking}<input id="support-booking" className="form-input" value={booking} onChange={(event) => setBooking(event.target.value)} placeholder="e.g. r1" /></label>
          <label htmlFor="support-message">{copy.message}<textarea id="support-message" className="form-input fx-textarea" rows={6} value={message} onChange={(event) => setMessage(event.target.value)} required placeholder={copy.messageHint} /></label>
          <button className="fx-primary-btn full" type="submit" disabled={!message.trim()}>{copy.send} <Send size={16} /></button>
        </form>
      </section>
    </div>

    <section className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:mt-6 sm:p-5" aria-labelledby="support-history-heading">
      <div className="mb-4 flex items-center justify-between gap-3"><div><h2 id="support-history-heading" className="text-sm font-bold sm:text-base">{copy.history}</h2><p className="mt-1 text-[10px] text-white/40">{complaints.length}</p></div><Clock3 size={18} className="text-cyan" /></div>
      {complaints.length === 0 ? <p className="rounded-xl border border-dashed border-white/10 p-7 text-center text-xs text-white/40">{copy.noTickets}</p> : <div className="grid gap-3 sm:grid-cols-2">
        {complaints.slice().sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).map((complaint) => <article key={complaint.id} className="min-w-0 rounded-xl border border-white/[0.07] bg-black/10 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2"><bdi dir="ltr" className="text-[9px] font-bold tracking-[0.1em] text-white/40">#{complaint.id.toUpperCase()}</bdi><span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${complaint.status === 'open' ? 'bg-orange/10 text-orange' : 'bg-emerald-300/10 text-emerald-200'}`}>{complaint.status === 'open' ? copy.open : copy.resolved}</span></div>
          <p className="mt-3 whitespace-pre-wrap text-xs leading-6 text-white/75">{complaint.message}</p>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-white/35">{complaint.bookingId && <span>{copy.booking}: <bdi dir="ltr">{complaint.bookingId}</bdi></span>}{complaint.createdAt && <time dateTime={complaint.createdAt}>{copy.received}: {new Date(complaint.createdAt).toLocaleDateString(ur ? 'ur-PK' : 'en-PK', { dateStyle: 'medium' })}</time>}</div>
          {complaint.response && <div className="mt-3 rounded-lg border border-cyan/10 bg-cyan/[0.04] p-3"><strong className="text-[10px] text-cyan">{copy.response}</strong><p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-white/65">{complaint.response}</p></div>}
        </article>)}
      </div>}
    </section>
  </div>;
}
