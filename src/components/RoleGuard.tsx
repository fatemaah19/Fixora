'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';
import { useT } from '@/contexts/LanguageProvider';
import type { Role } from '@/lib/types';

export function RoleGuard({ role, children }: { role: Role; children: ReactNode }) {
  const { session, ready } = useAuth();
  const { t } = useT();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!ready) return;
    if (!session) router.replace('/login');
    else if (session.role !== role) router.replace(`/${session.role}/dashboard`);
  }, [ready, session, role, router, pathname]);
  if (!ready || !session || session.role !== role) {
    return <main className="flex min-h-screen items-center justify-center px-5"><p className="text-sm text-muted" role="status">{t('common.loading')}</p></main>;
  }
  return <>{children}</>;
}
