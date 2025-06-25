// src/app/layout.tsx
import AuthProvider from '@/contexts/AuthContext'; // Importa el AuthProvider
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
