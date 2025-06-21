export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'es', 'fr'],
} as const;

// Añadir esta función de ayuda
export function getLocaleFromParams(params: unknown): Locale {
  if (params && typeof params === 'object' && 'lang' in params) {
    const lang = (params as { lang: string }).lang;
    if (i18n.locales.includes(lang as Locale)) {
      return lang as Locale;
    }
  }
  return i18n.defaultLocale;
}