import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n, type Locale } from '@/lib/i18n/i18n-config';

function getLocale(request: NextRequest): Locale {
  // 1. Verificar si ya hay un locale en la URL
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (!pathnameIsMissingLocale) {
    // Extraer el locale de la URL
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];
    if (i18n.locales.includes(firstSegment as Locale)) {
      return firstSegment as Locale;
    }
  }

  // 2. Verificar Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim())
      .map(lang => lang.split('-')[0]); // Solo tomar el idioma principal (ej: 'en' de 'en-US')

    for (const lang of languages) {
      if (i18n.locales.includes(lang as Locale)) {
        return lang as Locale;
      }
    }
  }

  // 3. Fallback al locale por defecto
  return i18n.defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Excluir rutas que no necesitan locale
  const excludedPaths = [
    '/api',
    '/_next',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/manifest.json',
  ];

  if (excludedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Verificar si el pathname ya incluye un locale válido
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirigir si falta el locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // Verificar si el locale en la URL es válido
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && !i18n.locales.includes(firstSegment as Locale)) {
    // Si el primer segmento no es un locale válido, agregar el locale por defecto
    const locale = getLocale(request);
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Matcher que excluye archivos estáticos y rutas de API
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt
     * - sitemap.xml
     * - manifest.json
     * - Any file with an extension (e.g., .png, .jpg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\.).*)',
  ],
};
