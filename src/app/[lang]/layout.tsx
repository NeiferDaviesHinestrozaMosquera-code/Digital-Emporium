import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { Providers } from '../providers';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from 'next-themes';
import type { Locale } from '@/lib/i18n/i18n-config';
import { i18n } from '@/lib/i18n/i18n-config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Función para validar idioma de forma segura
function getSafeLang(lang: string | undefined): Locale {
  return lang && i18n.locales.includes(lang as Locale) ? lang as Locale : i18n.defaultLocale;
}

// ESTA ES LA ÚNICA UBICACIÓN DONDE DEBE ESTAR generateStaticParams para [lang]
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

interface LayoutParams {
  params: Promise<{ lang: string }> | { lang: string };
}

export async function generateMetadata({ params }: LayoutParams): Promise<Metadata> {
  try {
    // Await params si es una Promise
    const resolvedParams = await params;
    const safeLang = getSafeLang(resolvedParams?.lang);
    
    const dictionary = await getDictionary(safeLang);
    
    return {
      title: (dictionary.siteTitle as string) || 'Digital Emporium',
      description: (dictionary.siteDescription as string) || 'Your one-stop solution for cutting-edge digital services.',
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Digital Emporium',
      description: 'Your one-stop solution for cutting-edge digital services.',
    };
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }> | { lang: string };
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  try {
    // Await params si es una Promise
    const resolvedParams = await params;
    const safeLang = getSafeLang(resolvedParams?.lang);

    return (
      <html lang={safeLang} suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <Providers>
                <PublicHeader lang={safeLang} />
                <main className="flex-grow">{children}</main>
                <PublicFooter lang={safeLang} />
                <Toaster />
              </Providers>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    );
  } catch (error) {
    console.error('Error in RootLayout:', error);
    // Fallback en caso de error
    return (
      <html lang={i18n.defaultLocale} suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <Providers>
                <PublicHeader lang={i18n.defaultLocale} />
                <main className="flex-grow">{children}</main>
                <PublicFooter lang={i18n.defaultLocale} />
                <Toaster />
              </Providers>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    );
  }
}
