'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, UserRound } from 'lucide-react';
import { TopBar } from '@/components/TopBar';
import { FormField } from '@/components/FormField';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { useT } from '@/contexts/LanguageProvider';
import { useAuth } from '@/contexts/AuthProvider';
export default function UserSignupPage() {
  const {t,language}=useT(); const {register}=useAuth(); const router=useRouter();
  const [name,setName]=useState(''); const [phone,setPhone]=useState(''); const [password,setPassword]=useState(''); const [confirm,setConfirm]=useState(''); const [error,setError]=useState('');
  function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setError('');if(!name.trim()||!/^03\d{9}$/.test(phone)||password.length<6){setError(t('signup.phoneInvalid'));return;}if(password!==confirm){setError(t('signup.passwordMismatch'));return;}register('user',phone);router.push('/user/dashboard');}
  return <main className="min-h-screen px-4 py-5 sm:px-8 sm:py-8"><div className="mx-auto max-w-5xl"><TopBar/><div className="mx-auto max-w-xl py-10"><GlassCard><div className="mb-7"><Link href="/signup" className="mb-5 inline-flex min-h-10 items-center gap-2 text-sm text-muted hover:text-white">{language==='ur'?<ArrowRight size={16}/>:<ArrowLeft size={16}/>} {t('common.back')}</Link><div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan/10 text-cyan"><UserRound size={28}/></div><h1 className="text-3xl font-bold">{t('signup.createUser')}</h1></div><form onSubmit={submit} className="space-y-5" noValidate><FormField label={t('common.fullName')} name="name" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} required/><FormField label={t('common.phone')} name="phone" type="tel" inputMode="numeric" placeholder="03001234567" value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,'').slice(0,11))} required dir="ltr" className="text-left"/><FormField label={t('common.password')} name="password" type="password" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} minLength={6} required/><p className="-mt-3 text-xs text-muted">{t('signup.passwordHint')}</p><FormField label={t('common.confirmPassword')} name="confirm" type="password" autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)} required/>{error&&<p role="alert" className="text-sm text-coral">{error}</p>}<Button type="submit" className="w-full">{t('signup.createUser')} {language==='ur'?<ArrowLeft size={18}/>:<ArrowRight size={18}/>}</Button></form></GlassCard></div></div></main>;
}
