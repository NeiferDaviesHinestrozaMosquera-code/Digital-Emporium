export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'es', 'fr'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

export function getLocaleFromParams(params: unknown): Locale {
  if (params && typeof params === 'object' && 'lang' in params) {
    const lang = (params as { lang: string }).lang;
    if (i18n.locales.includes(lang as Locale)) {
      return lang as Locale;
    }
  }
  return i18n.defaultLocale;
}
