/**
 * layout.tsx
 * 
 * Layout raiz da aplicação que define a estrutura básica de todas as páginas.
 */

import '@/app/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/app/providers';
import { WebVitalsReporter } from '@/components/performance/WebVitalsReporter';

// Definição da fonte Inter
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-sans' });

// Metadata da aplicação
export const metadata: Metadata = {
  title: {
    template: '%s | Sistema de Comunicação',
    default: 'Sistema de Comunicação',
  },
  description: 'Plataforma integrada para gerenciamento de comunicações',
  authors: [{ name: 'Equipe de Desenvolvimento' }],
  creator: 'Devin AI',
  robots: { index: false, follow: false },
};

// Layout raiz que envolve toda a aplicação
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          {children}
          <WebVitalsReporter />
        </Providers>
      </body>
    </html>
  );
} 