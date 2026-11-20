import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
export function GlassCard({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) { return <div className={clsx('glass rounded-2xl p-5 sm:p-6', className)} {...props}>{children}</div>; }
