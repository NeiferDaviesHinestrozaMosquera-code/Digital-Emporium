
"use client"; 

import type { Metadata } from 'next';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Metadata can still be defined for Server Components, but it's fine here too.
// For client components, you'd typically set title via document.title in useEffect.
// However, Next.js might handle this metadata object even in a client component layout.
// export const metadata: Metadata = { // This might not be directly picked up if the whole file is client.
// title: 'Admin Dashboard - Digital Emporium',
// description: 'Manage services, testimonials, and client inquiries for Digital Emporium.',
// };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof document !== 'undefined') { 
        document.title = 'Admin Dashboard - Digital Emporium';
    }
    if (!loading && !user) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search)); // Redirect to login if not authenticated, preserving current path
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // This will show briefly before redirect or if redirect fails
    return (
       <div className="flex h-screen items-center justify-center bg-background">
         <p>Redireccionando al login...</p>
         <Loader2 className="ml-2 h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // If user is authenticated, render the admin layout
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto ml-64">
        {children}
      </main>
    </div>
  );
}
