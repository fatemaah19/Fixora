'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, LockKeyhole } from 'lucide-react';
import { TopBar } from '@/components/TopBar';
import { FormField } from '@/components/FormField';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { useT } from '@/contexts/LanguageProvider';
import { useAuth } from '@/contexts/AuthProvider';

export default function LoginPage() {
  const { t, language } = useT();
  const { login } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const isRtl = language === 'ur';
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    if (!/^03\d{9}$/.test(phone)) { setError(t('signup.phoneInvalid')); return; }
    if (!login(phone, password)) { setError(t('login.invalid')); return; }
    const role = phone === '03000000000' ? 'admin' : phone === '03007654321' ? 'worker' : 'user';
    router.push(`/${role}/dashboard`);
  }
  return <main className="min-h-screen px-4 py-5 sm:px-8 sm:py-8"><div className="mx-auto max-w-6xl"><TopBar />
    <div className="grid min-h-[calc(100vh-110px)] items-center gap-10 py-10 lg:grid-cols-2">
      <section className="hidden lg:block"><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-4 py-2 text-sm text-cyan"><span className="h-2 w-2 rounded-full bg-cyan" />{t('brand.tagline')}</div><h1 className="max-w-xl text-5xl font-bold leading-[1.5]">{t('login.title')}</h1><p className="mt-5 max-w-md text-lg leading-9 text-muted">{t('login.subtitle')}</p><div className="mt-10 grid max-w-md grid-cols-2 gap-3"><div className="glass rounded-2xl p-5"><div className="text-3xl font-bold text-cyan">4</div><p className="mt-1 text-sm text-muted">{t('signup.trade')}</p></div><div className="glass rounded-2xl p-5"><div className="text-3xl font-bold text-orange">24/7</div><p className="mt-1 text-sm text-muted">{t('brand.tagline')}</p></div></div></section>
      <div className="mx-auto w-full max-w-md"><div className="mb-7 flex justify-center lg:hidden"><div className="rounded-3xl bg-cyan/10 p-5"><LockKeyhole className="h-9 w-9 text-cyan" /></div></div><GlassCard className="p-6 sm:p-8"><div className="mb-7 text-center"><h1 className="text-3xl font-bold">{t('login.title')}</h1><p className="mt-3 text-sm leading-7 text-muted">{t('login.subtitle')}</p></div>
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <FormField label={t('common.phone')} name="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder={t('login.phonePlaceholder')} value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,'').slice(0,11))} required dir="ltr" className="text-left" />
          <div className="space-y-2"><label htmlFor="password" className="block text-sm font-semibold">{t('common.password')}</label><div className="relative"><input id="password" name="password" type={showPassword?'text':'password'} autoComplete="current-password" placeholder={t('login.passwordPlaceholder')} value={password} onChange={e=>setPassword(e.target.value)} required className="form-input w-full pe-24" dir="ltr"/><button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute inset-y-0 end-2 my-1 min-h-10 rounded-lg px-3 text-xs font-semibold text-cyan">{t(showPassword?'common.hidePassword':'common.showPassword')}</button></div></div>
          {error && <p role="alert" className="rounded-xl border border-coral/30 bg-coral/10 p-3 text-sm text-coral">{error}</p>}
          <Button type="submit" className="w-full">{t('login.button')} {isRtl?<ArrowLeft size={18}/>:<ArrowRight size={18}/>}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">{t('login.noAccount')} <Link href="/signup" className="font-bold text-cyan underline-offset-4 hover:underline">{t('login.create')}</Link></p>
      </GlassCard>
      <div className="mt-5 rounded-2xl border border-white/10 bg-black/15 p-4"><p className="mb-2 text-sm font-bold text-white">{t('login.demoTitle')}</p><div className="space-y-1 text-xs leading-6 text-muted" dir="ltr"><p>{t('login.userDemo')}</p><p>{t('login.workerDemo')}</p><p>{t('login.adminDemo')}</p></div></div></div>
    </div></div></main>;
}
