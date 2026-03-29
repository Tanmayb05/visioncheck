import { TRANSLATIONS } from './translations';

/**
 * Returns a translation lookup function for the given language.
 * Usage:
 *   const t = useTranslation(language);
 *   t('welcome.title')          // → string
 *   t('acuity.lineOf')(1, 9, '20/100')  // → string (for function values)
 */
export function useTranslation(language) {
  const dict = TRANSLATIONS[language] || TRANSLATIONS['en'];
  return function t(key) {
    const keys = key.split('.');
    let val = dict;
    for (const k of keys) {
      val = val?.[k];
      if (val === undefined) break;
    }
    // Fallback to English if key missing
    if (val === undefined) {
      let fallback = TRANSLATIONS['en'];
      for (const k of keys) {
        fallback = fallback?.[k];
        if (fallback === undefined) return key;
      }
      return fallback ?? key;
    }
    return val;
  };
}
