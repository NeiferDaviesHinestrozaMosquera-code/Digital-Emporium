
// This global not-found.tsx is a fallback.
// Our middleware should redirect to a localized path,
// which would then use the /app/[lang]/not-found.tsx for a localized 404 message.
// However, Next.js requires a root not-found.js file.
// We can make this a simple, non-localized version or attempt to redirect.

import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { i18n } from '@/lib/i18n/i18n-config'; // Corregido: Importar i18n

export default function NotFound() {
  // Attempt to redirect to the default locale's 404 page
  // This might not always work as expected depending on how Next.js handles global 404s
  // with i18n routing, but it's an attempt.
  const headersList = headers();
  const pathname = headersList.get('x-next-pathname') || '/'; // Get the original path if available

  // Redirect to a default locale's path that would trigger its not-found.
  // Or, more simply, redirect to the default locale's home page.
  // For a true localized 404 from a non-locale path, middleware should handle it.
  // This component is more for *unmatched routes at the root level*.
  // redirect(`/${i18n.defaultLocale}${pathname}`); // This could cause a redirect loop if not careful.
  
  // A safer fallback for a global 404 is to link to the default locale's home.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="mb-8">The page you are looking for does not exist.</p>
      <Link href={`/${i18n.defaultLocale}`} className="text-primary hover:underline">
        Go to Homepage
      </Link>
    </div>
  );
}

