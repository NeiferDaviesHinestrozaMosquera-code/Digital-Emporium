import { Suspense } from 'react';
import type { Locale } from '@/lib/i18n/i18n-config';
import { i18n } from '@/lib/i18n/i18n-config'; // Asegúrate de importar i18n

// Importa el nuevo componente de cliente
import LoginFormClient from './LoginFormClient'; // Ajusta la ruta si lo moviste a 'components'
import { Loader2 } from 'lucide-react'; // Necesitas Loader2 para el LoadingSpinner

// Loading component (puede ser un componente de servidor o cliente, pero como es simple, puede ir aquí)
function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

// La interfaz para las props de la página
interface LoginPageProps {
  params: { lang: Locale };
}

// El componente de la página (Server Component)
export default function LoginPage({ params }: LoginPageProps) {
  // La verificación de params.lang sigue siendo útil para la robustez,
  // aunque generateStaticParams debería asegurar que siempre esté presente en el build.
  if (!params || !params.lang) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {/* Renderiza el componente de cliente y le pasa la prop lang */}
      <LoginFormClient lang={params.lang} />
    </Suspense>
  );
}

// Para generar estáticamente las rutas para cada idioma (esto se ejecuta en el servidor durante el build)
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({
    lang: locale,
  }));
}

// Para rendering dinámico si es necesario (aunque generateStaticParams implica static)
export const dynamic = 'force-dynamic';
