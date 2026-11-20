'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Role } from '@/lib/types';

type Session = { role: Role; phone: string } | null;
type AuthContextValue = { session: Session; ready: boolean; login: (phone: string, password: string) => boolean; logout: () => void; register: (role: 'user' | 'worker', phone: string) => void };
const AuthContext = createContext<AuthContextValue | null>(null);
const demoAccounts: Record<string, { password: string; role: Role }> = {
  '03001234567': { password: 'demo123', role: 'user' },
  '03007654321': { password: 'demo123', role: 'worker' },
  '03000000000': { password: 'admin123', role: 'admin' },
};
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem('fixora-session'); if (raw) setSession(JSON.parse(raw) as Session); } catch { localStorage.removeItem('fixora-session'); }
    setReady(true);
  }, []);
  const login = useCallback((phone: string, password: string) => {
    const account = demoAccounts[phone];
    if (!account || account.password !== password) return false;
    const next = { role: account.role, phone }; setSession(next); localStorage.setItem('fixora-session', JSON.stringify(next)); return true;
  }, []);
  const logout = useCallback(() => { setSession(null); localStorage.removeItem('fixora-session'); }, []);
  const register = useCallback((role: 'user' | 'worker', phone: string) => { const next = { role, phone }; setSession(next); localStorage.setItem('fixora-session', JSON.stringify(next)); }, []);
  const value = useMemo(() => ({ session, ready, login, logout, register }), [session, ready, login, logout, register]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within AuthProvider'); return context; }
