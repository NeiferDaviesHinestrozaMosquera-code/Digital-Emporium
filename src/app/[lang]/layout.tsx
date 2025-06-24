import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css'; // Adjusted path for globals.css
import { Toaster } from '@/components/ui/toaster';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { Providers } from '../providers'; // Adjusted path for providers
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from 'next-themes';
import type { Locale } from '@/lib/i18n/i18n-config';
import { i18n } from '@/lib/i18n/i18n-config'; // Importa i18n para acceder a defaultLocale y locales
import { getDictionary } from '@/lib/i18n/get-dictionary';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'],});
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'],});

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  // Asegura que 'lang' siempre sea un valor válido de Locale o el defaultLocale
  const safeLang: Locale = (params && params.lang && i18n.locales.includes(params.lang as Locale))
    ? params.lang
    : i18n.defaultLocale;

  const dictionary = await getDictionary(safeLang);
  return {
    title: dictionary.siteTitle as string || 'Digital Emporium',
    description: dictionary.siteDescription as string || 'Your one-stop solution for cutting-edge digital services.',
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

type RootLayoutProps = {
  children: React.ReactNode;
  params: { lang: Locale };
};

export default function RootLayout({ children, params,}: RootLayoutProps) {
  // Asegura que 'lang' siempre sea un valor válido de Locale o el defaultLocale
  const safeLang: Locale = (params && params.lang && i18n.locales.includes(params.lang as Locale))
    ? params.lang
    : i18n.defaultLocale;

  return (
    <html lang={safeLang} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange >
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
}
