'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { useAuth } from '@/contexts/AuthProvider';
export default function DashboardLayout({children}:{children:React.ReactNode}) {
  const {session,ready}=useAuth(); const router=useRouter();
  useEffect(()=>{if(ready&&!session)router.replace('/login');else if(ready&&session&&session.role!=='user')router.replace(`/${session.role}/dashboard`)},[ready,session,router]);
  if(!ready||!session||session.role!=='user')return <div className="flex min-h-screen items-center justify-center text-sm text-muted">Loading FIXORA…</div>;
  return <DashboardShell>{children}</DashboardShell>;
}
