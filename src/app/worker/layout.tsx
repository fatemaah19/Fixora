'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const { session, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!session) router.replace('/login');
    else if (session.role !== 'worker') router.replace(session.role === 'user' ? '/dashboard' : '/login');
  }, [ready, session, router]);

  if (!ready || !session || session.role !== 'worker') {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted">Loading FIXORA…</div>;
  }

  return children;
}
