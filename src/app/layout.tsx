import type { Metadata } from 'next';
import { Inter, Noto_Nastaliq_Urdu, Noto_Naskh_Arabic } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageProvider';
import { AuthProvider } from '@/contexts/AuthProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const nastaliq = Noto_Nastaliq_Urdu({ subsets: ['arabic'], weight: ['400','700'], variable: '--font-nastaliq', display: 'swap' });
const naskh = Noto_Naskh_Arabic({ subsets: ['arabic'], weight: ['400','500','600','700'], variable: '--font-naskh', display: 'swap' });
export const metadata: Metadata = { title: 'Fixora | Home Services Multan', description: 'Trusted home services in Multan, Pakistan.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ur" dir="rtl" suppressHydrationWarning><body className={`${inter.variable} ${nastaliq.variable} ${naskh.variable}`}><LanguageProvider><AuthProvider>{children}</AuthProvider></LanguageProvider></body></html>;
}
