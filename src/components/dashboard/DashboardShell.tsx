'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Wrench, Users, CalendarCheck, ShieldCheck, Headset, LogOut, Menu, X, Plus, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/Logo';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useAuth } from '@/contexts/AuthProvider';
import { useT } from '@/contexts/LanguageProvider';
import { unreadNotificationCount } from '@/lib/notificationData';

const nav = [
  { href: '/dashboard', key: 'home', icon: Home },
  { href: '/dashboard/request', key: 'request', icon: Wrench },
  { href: '/dashboard/workers', key: 'workers', icon: Users },
  { href: '/dashboard/bookings', key: 'bookings', icon: CalendarCheck },
  { href: '/dashboard/passport', key: 'passport', icon: ShieldCheck },
  { href: '/dashboard/support', key: 'support', icon: Headset },
  { href: '/dashboard/notifications', key: 'notifications', icon: Bell },
];
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const path = usePathname(); const router = useRouter(); const { logout } = useAuth(); const { language, t } = useT(); const [open, setOpen] = useState(false); const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => { const sync = () => setUnreadCount(unreadNotificationCount('user')); sync(); window.addEventListener('fixora:notifications-updated', sync); return () => window.removeEventListener('fixora:notifications-updated', sync); }, []);
  const ur: Record<string,string> = { home:'ڈیش بورڈ', request:'سروس کی درخواست', workers:'کاریگر تلاش کریں', bookings:'میری بکنگ', passport:'ہوم پاسپورٹ', support:'مدد اور شکایت', notifications:'اطلاعات' };
  const en: Record<string,string> = { home:'Dashboard', request:'Request a service', workers:'Find professionals', bookings:'My bookings', passport:'Home Passport', support:'Help & support', notifications:'Notifications' };
  const label = (key:string) => language === 'ur' ? ur[key] : en[key];
  const active = (href:string) => href === '/dashboard' ? path === href : path.startsWith(href);
  const handleLogout = () => { logout(); router.push('/login'); };
  return <div className="fx-dashboard min-h-screen">
    <aside className={`fx-sidebar ${open?'fx-sidebar-open':''}`}>
      <div className="fx-brand-row"><Link href="/dashboard" onClick={()=>setOpen(false)}><Logo size={42}/></Link><button className="fx-mobile-close" onClick={()=>setOpen(false)} aria-label="Close menu"><X size={20}/></button></div>
      <div className="fx-side-caption">{language==='ur'?'مین مینو':'MAIN MENU'}</div>
      <nav className="fx-nav">{nav.map(({href,key,icon:Icon})=><Link key={href} href={href} onClick={()=>setOpen(false)} className={`fx-nav-link ${active(href)?'active':''}`}><Icon size={19}/><span>{label(key)}</span>{key==='request'&&<span className="fx-nav-plus"><Plus size={14}/></span>}</Link>)}</nav>
      <div className="fx-sidebar-bottom"><div className="fx-help-card"><div className="fx-help-icon"><Headset size={18}/></div><strong>{language==='ur'?'کیا آپ کو مدد چاہیے؟':'Need a hand?'}</strong><p>{language==='ur'?'ہم آپ کی مدد کے لیے موجود ہیں':'Our support team is ready to help.'}</p><Link href="/dashboard/support">{language==='ur'?'ہم سے رابطہ کریں':'Contact support'} <span>→</span></Link></div><button className="fx-logout" onClick={handleLogout}><LogOut size={18}/>{language==='ur'?'لاگ آؤٹ':'Log out'}</button></div>
    </aside>
    {open&&<button className="fx-overlay" aria-label="Close menu" onClick={()=>setOpen(false)}/>}
    <main className="fx-main"><header className="fx-topbar"><button className="fx-menu-btn" onClick={()=>setOpen(true)} aria-label="Open menu"><Menu size={21}/></button><div className="fx-breadcrumb"><span>FIXORA</span><b>/</b><strong>{label(nav.find(n=>active(n.href))?.key||'home')}</strong></div><div className="fx-top-actions"><Link href="/dashboard/notifications" className="fx-bell" aria-label={language==='ur'?'اطلاعات':'Notifications'}><Bell size={18}/>{unreadCount>0&&<span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-orange px-1 text-[9px] font-bold text-[#101025]">{unreadCount}</span>}</Link><LanguageToggle/></div></header><div className="fx-page-content">{children}</div></main>
  </div>
}
