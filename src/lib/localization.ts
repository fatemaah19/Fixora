import type { Language } from './types';

const urduScript = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/u;

export function localizedText(
  language: Language,
  urduText: string,
  englishText?: string,
  englishFallback = 'Details are available in Urdu.',
): string {
  if (language === 'ur') return urduText;
  if (englishText) return englishText;
  return urduScript.test(urduText) ? englishFallback : urduText;
}
