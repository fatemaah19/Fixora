import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
export function Button({ children, variant = 'primary', className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost'; children: ReactNode }) {
  return <button className={clsx('inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-navy active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50', variant === 'primary' && 'bg-orange text-navy shadow-lg shadow-orange/15 hover:brightness-110', variant === 'secondary' && 'border border-white/15 bg-white/[.07] text-white hover:bg-white/[.12]', variant === 'ghost' && 'text-muted hover:bg-white/[.06] hover:text-white', className)} {...props}>{children}</button>;
}
