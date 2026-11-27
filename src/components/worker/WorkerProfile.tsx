'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BadgeCheck, BriefcaseBusiness, Check, MapPin, Save, Star, UserRound } from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthProvider';
import { useT } from '@/contexts/LanguageProvider';

type Trade = 'electrician' | 'ac' | 'plumber' | 'carpenter';
type WorkerProfileData = { name: string; phone: string; whatsapp: string; trade: Trade; area: string; experience: string; bio: string; skills: string[] };

const STORAGE_KEY = 'fixora-worker-profile';
const defaultProfile: WorkerProfileData = {
  name: 'Muhammad Usman', phone: '03007654321', whatsapp: '03007654321', trade: 'electrician', area: 'Gulgasht', experience: '9',
  bio: 'I focus on safe home wiring, lighting, switches and electrical troubleshooting. I explain the work clearly and leave every space tidy.',
  skills: ['Wiring', 'Lighting', 'Troubleshooting'],
};

const trades: Trade[] = ['electrician', 'ac', 'plumber', 'carpenter'];
const areas = ['Gulgasht', 'Multan Cantt', 'Bosan Road', 'Model Town', 'Mumtazabad'];
const allSkills = ['Wiring', 'Lighting', 'Troubleshooting', 'Switchboards', 'AC servicing', 'Pipe repair', 'Carpentry'];

const ur = {
  title: 'میرا پروفائل', subtitle: 'صارفین کو اپنی مہارت اور کام کے بارے میں بتائیں۔', back: 'ڈیش بورڈ',
  overview: 'کاریگر پروفائل', verified: 'تصدیق شدہ کاریگر', rating: 'ریٹنگ', completed: 'مکمل کام', reviews: 'جائزے',
  details: 'بنیادی معلومات', name: 'پورا نام', phone: 'موبائل نمبر', whatsapp: 'واٹس ایپ نمبر', trade: 'کام کی قسم', area: 'سروس کا علاقہ', experience: 'تجربہ (سال)', bio: 'اپنے بارے میں',
  skillsTitle: 'مہارتیں', skillsHint: 'وہ کام منتخب کریں جو آپ کرتے ہیں۔', save: 'پروفائل محفوظ کریں', saved: 'پروفائل اس ڈیوائس پر محفوظ ہو گیا۔', required: 'نام اور درست فون نمبر درج کریں۔',
  trades: { electrician: 'الیکٹریشن', ac: 'اے سی ٹیکنیشن', plumber: 'پلمبر', carpenter: 'کارپنٹر' },
  areas: { Gulgasht: 'گلگشت', 'Multan Cantt': 'ملتان کینٹ', 'Bosan Road': 'بوسن روڈ', 'Model Town': 'ماڈل ٹاؤن', Mumtazabad: 'ممتاز آباد' },
  skills: { Wiring: 'وائرنگ', Lighting: 'لائٹنگ', Troubleshooting: 'خرابی کی تشخیص', Switchboards: 'سوئچ بورڈ', 'AC servicing': 'اے سی سروس', 'Pipe repair': 'پائپ کی مرمت', Carpentry: 'کارپنٹری' },
  placeholder: 'اپنے تجربے، کام کے معیار اور خاص مہارتوں کے بارے میں لکھیں۔',
};
const en = {
  title: 'My profile', subtitle: 'Help customers learn about your skills and experience.', back: 'Dashboard',
  overview: 'WORKER PROFILE', verified: 'Verified professional', rating: 'Rating', completed: 'Jobs done', reviews: 'Reviews',
  details: 'Basic details', name: 'Full name', phone: 'Mobile number', whatsapp: 'WhatsApp number', trade: 'Main service', area: 'Service area', experience: 'Experience (years)', bio: 'About you',
  skillsTitle: 'Skills', skillsHint: 'Select the services you offer.', save: 'Save profile', saved: 'Profile saved on this device.', required: 'Enter your name and a valid phone number.',
  trades: { electrician: 'Electrician', ac: 'AC technician', plumber: 'Plumber', carpenter: 'Carpenter' },
  areas: { Gulgasht: 'Gulgasht', 'Multan Cantt': 'Multan Cantt', 'Bosan Road': 'Bosan Road', 'Model Town': 'Model Town', Mumtazabad: 'Mumtazabad' },
  skills: { Wiring: 'Wiring', Lighting: 'Lighting', Troubleshooting: 'Troubleshooting', Switchboards: 'Switchboards', 'AC servicing': 'AC servicing', 'Pipe repair': 'Pipe repair', Carpentry: 'Carpentry' },
  placeholder: 'Describe your experience, the quality of your work, and your specialties.',
};

function isProfile(value: unknown): value is WorkerProfileData {
  if (!value || typeof value !== 'object') return false;
  const profile = value as Partial<WorkerProfileData>;
  return typeof profile.name === 'string' && typeof profile.phone === 'string' && typeof profile.whatsapp === 'string' &&
    typeof profile.trade === 'string' && typeof profile.area === 'string' && typeof profile.experience === 'string' &&
    typeof profile.bio === 'string' && Array.isArray(profile.skills);
}

export function WorkerProfile() {
  const { language } = useT();
  const { session } = useAuth();
  const copy = language === 'ur' ? ur : en;
  const [profile, setProfile] = useState<WorkerProfileData | null>(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : null;
      setProfile(isProfile(parsed) ? { ...parsed, phone: session?.phone ?? parsed.phone } : { ...defaultProfile, phone: session?.phone ?? defaultProfile.phone });
    } catch {
      setProfile({ ...defaultProfile, phone: session?.phone ?? defaultProfile.phone });
    }
  }, [session?.phone]);

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('');
    if (!profile || !profile.name.trim() || !/^03\d{9}$/.test(profile.phone) || !/^03\d{9}$/.test(profile.whatsapp)) {
      setError(copy.required);
      return;
    }
    setError('');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setNotice(copy.saved);
    window.setTimeout(() => setNotice(''), 3000);
  }

  function update<K extends keyof WorkerProfileData>(key: K, value: WorkerProfileData[K]) {
    setProfile((current) => current ? { ...current, [key]: value } : current);
    setNotice('');
  }

  function toggleSkill(skill: string) {
    if (!profile) return;
    update('skills', profile.skills.includes(skill) ? profile.skills.filter((item) => item !== skill) : [...profile.skills, skill]);
  }

  return <main className="min-h-screen bg-[#0c1020] text-white">
    <header className="border-b border-white/[0.07] bg-[#101426]/90">
      <div className="mx-auto flex min-h-[72px] max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/worker/dashboard" aria-label="FIXORA dashboard"><Logo size={42} /></Link>
        <div className="flex items-center gap-2 sm:gap-4"><LanguageToggle /><Link href="/worker/dashboard" className="hidden min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-white/55 transition hover:bg-white/[0.06] hover:text-white sm:inline-flex">{language === 'ur' ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}{copy.back}</Link></div>
      </div>
    </header>
    <div className="mx-auto max-w-5xl px-4 pb-12 pt-6 sm:px-6 sm:pt-9">
      <Link href="/worker/dashboard" className="mb-5 inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-white/45 transition hover:text-cyan"><ArrowLeft size={15} />{copy.back}</Link>
      <div className="mb-6"><span className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] text-cyan"><UserRound size={13} />{copy.overview}</span><h1 className="text-2xl font-bold leading-relaxed sm:text-3xl">{copy.title}</h1><p className="mt-1 text-sm leading-7 text-white/50">{copy.subtitle}</p></div>

      <section className="mb-5 flex flex-col gap-5 rounded-2xl border border-cyan/15 bg-gradient-to-br from-[#1c3156] to-[#211b3b] p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-cyan/20 bg-cyan/10 text-xl font-bold text-cyan">{profile?.name.trim().slice(0, 1) || 'U'}</div>
        <div className="min-w-0 flex-1"><div className="mb-1 flex flex-wrap items-center gap-2"><h2 className="text-lg font-bold">{profile?.name || '…'}</h2><span className="inline-flex items-center gap-1 rounded-full bg-emerald-300/10 px-2.5 py-1 text-[9px] font-semibold text-emerald-200"><BadgeCheck size={12} />{copy.verified}</span></div><p className="inline-flex items-center gap-1.5 text-xs text-white/50"><MapPin size={13} />{profile ? (language === 'ur' ? copy.areas[profile.area as keyof typeof copy.areas] ?? profile.area : profile.area) : '…'} · {profile ? (language === 'ur' ? copy.trades[profile.trade] : copy.trades[profile.trade]) : '…'}</p></div>
        <div className="flex gap-5 border-t border-white/10 pt-4 sm:border-s sm:border-t-0 sm:ps-5 sm:pt-0"><div><span className="block text-[9px] text-white/40">{copy.rating}</span><strong className="mt-1 inline-flex items-center gap-1 text-base"><Star size={14} className="text-amber-300" fill="currentColor" />4.9</strong></div><div><span className="block text-[9px] text-white/40">{copy.completed}</span><strong className="mt-1 block text-base">126</strong></div><div><span className="block text-[9px] text-white/40">{copy.reviews}</span><strong className="mt-1 block text-base">128</strong></div></div>
      </section>

      {notice && <p role="status" className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] px-4 py-3 text-xs text-emerald-200"><Check size={15} />{notice}</p>}
      {!profile ? <div className="h-[540px] animate-pulse rounded-2xl bg-white/[0.04]" aria-label={language === 'ur' ? 'پروفائل لوڈ ہو رہا ہے' : 'Loading profile'} /> : <form onSubmit={saveProfile} className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 sm:p-6">
        <div className="mb-5 flex items-center gap-2"><BriefcaseBusiness size={16} className="text-cyan" /><h2 className="text-sm font-bold">{copy.details}</h2></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-[11px] font-semibold text-white/70"><span>{copy.name}</span><input className="form-input w-full text-xs" value={profile.name} onChange={(event) => update('name', event.target.value)} /></label>
          <label className="grid gap-2 text-[11px] font-semibold text-white/70"><span>{copy.phone}</span><input className="form-input w-full text-left text-xs opacity-65" dir="ltr" inputMode="numeric" value={session?.phone ?? profile.phone} readOnly /></label>
          <label className="grid gap-2 text-[11px] font-semibold text-white/70"><span>{copy.whatsapp}</span><input className="form-input w-full text-left text-xs" dir="ltr" inputMode="numeric" value={profile.whatsapp} onChange={(event) => update('whatsapp', event.target.value.replace(/\D/g, '').slice(0, 11))} /></label>
          <label className="grid gap-2 text-[11px] font-semibold text-white/70"><span>{copy.trade}</span><select className="form-input w-full text-xs" value={profile.trade} onChange={(event) => update('trade', event.target.value as Trade)}>{trades.map((trade) => <option key={trade} value={trade}>{language === 'ur' ? copy.trades[trade] : copy.trades[trade]}</option>)}</select></label>
          <label className="grid gap-2 text-[11px] font-semibold text-white/70"><span>{copy.area}</span><select className="form-input w-full text-xs" value={profile.area} onChange={(event) => update('area', event.target.value)}>{areas.map((area) => <option key={area} value={area}>{language === 'ur' ? copy.areas[area as keyof typeof copy.areas] : area}</option>)}</select></label>
          <label className="grid gap-2 text-[11px] font-semibold text-white/70"><span>{copy.experience}</span><input className="form-input w-full text-xs" type="number" min="0" max="50" value={profile.experience} onChange={(event) => update('experience', event.target.value)} /></label>
        </div>
        <div className="mt-5"><h3 className="text-[11px] font-semibold text-white/70">{copy.skillsTitle}</h3><p className="mb-3 mt-1 text-[10px] text-white/35">{copy.skillsHint}</p><div className="flex flex-wrap gap-2">{allSkills.map((skill) => { const selected = profile.skills.includes(skill); return <button key={skill} type="button" onClick={() => toggleSkill(skill)} aria-pressed={selected} className={`inline-flex min-h-9 items-center gap-2 rounded-xl border px-3 text-[10px] font-semibold transition ${selected ? 'border-cyan/30 bg-cyan/10 text-cyan' : 'border-white/[0.08] bg-white/[0.025] text-white/45 hover:border-white/20'}`}>{selected && <Check size={12} />}{language === 'ur' ? copy.skills[skill as keyof typeof copy.skills] : skill}</button>; })}</div></div>
        <label className="mt-5 grid gap-2 text-[11px] font-semibold text-white/70"><span>{copy.bio}</span><textarea className="form-input min-h-32 w-full resize-y text-xs leading-6" maxLength={360} value={profile.bio} onChange={(event) => update('bio', event.target.value)} placeholder={copy.placeholder} /></label>
        {error && <p role="alert" className="mt-4 text-xs text-coral">{error}</p>}
        <div className="mt-5 flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-[10px] text-white/35">{language === 'ur' ? 'تبدیلیاں محفوظ کرنے کے لیے بٹن دبائیں۔' : 'Save your changes to keep them on this device.'}</p><button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue to-cyan px-5 text-xs font-bold text-white shadow-lg shadow-blue/10 transition hover:brightness-110"><Save size={15} />{copy.save}</button></div>
      </form>}
    </div>
  </main>;
}
