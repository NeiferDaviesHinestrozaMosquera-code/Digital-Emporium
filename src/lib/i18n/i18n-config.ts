export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'es', 'fr'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

// Función mejorada para obtener locale de params
export function getLocaleFromParams(params: unknown): Locale {
  if (params && typeof params === 'object' && 'lang' in params) {
    const lang = (params as { lang: string }).lang;
    if (i18n.locales.includes(lang as Locale)) {
      return lang as Locale;
    }
  }
  return i18n.defaultLocale;
}

// Función para validar y obtener un locale seguro
export function getSafeLocale(lang: string | undefined | null): Locale {
  if (!lang || typeof lang !== 'string') {
    return i18n.defaultLocale;
  }
  
  return i18n.locales.includes(lang as Locale) ? lang as Locale : i18n.defaultLocale;
}

// Función para validar si un string es un locale válido
export function isValidLocale(locale: string): locale is Locale {
  return i18n.locales.includes(locale as Locale);
}

// Función para obtener locale de una URL
export function getLocaleFromUrl(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment;
  }
  
  return i18n.defaultLocale;
}
