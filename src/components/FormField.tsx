import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
export function FormField({ label, error, className, id, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const inputId = id ?? props.name;
  return <div className="space-y-2"><label htmlFor={inputId} className="block text-sm font-semibold text-white">{label}</label><input id={inputId} className={clsx('form-input w-full', error && 'border-coral focus:border-coral', className)} aria-invalid={Boolean(error)} aria-describedby={error ? `${inputId}-error` : undefined} {...props}/>{error && <p id={`${inputId}-error`} className="text-sm text-coral" role="alert">{error}</p>}</div>;
}
