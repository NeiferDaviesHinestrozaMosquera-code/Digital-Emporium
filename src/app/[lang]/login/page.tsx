// src/app/[lang]/login/page.tsx
// NO LLEVA 'use client'; aquí

import { Suspense } from 'react';
import type { Locale } from '@/lib/i18n/i18n-config';
import { i18n } from '@/lib/i18n/i18n-config';
import LoginFormClient from './LoginFormClient'; // Asegúrate de que la ruta sea correcta
import { Loader2 } from 'lucide-react';

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

interface LoginPageProps {
  params: { lang: Locale };
}

export default function LoginPage({ params }: LoginPageProps) {
  if (!params || !params.lang) {
    return <LoadingSpinner />;
  }
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginFormClient lang={params.lang} />
    </Suspense>
  );
}

// ELIMINADO: generateStaticParams de aquí, ya está en el layout padre
// export async function generateStaticParams() {
//   return i18n.locales.map((locale) => ({
//     lang: locale,
//   }));
// }

export const dynamic = 'force-dynamic';
