export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'es', 'fr'],
} as const

// Agregar esta exportación
export const LOCALES = i18n.locales;

export type Locale = (typeof i18n)['locales'][number]
