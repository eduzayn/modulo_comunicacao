/**
 * Root layout component for the application
 * 
 * This component provides the base HTML structure and global providers
 * for the entire application.
 */

import './globals.css';
import { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Edunexia Communication Module',
  description: 'Communication module for the Edunexia platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
