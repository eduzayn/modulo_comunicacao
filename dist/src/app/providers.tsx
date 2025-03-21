'use client';

/**
 * providers.tsx
 * 
 * Define os provedores de contexto para toda a aplicação.
 * Inclui provedores para tema, autenticação, atividade e gerenciamento de estado.
 */

import { ReactNode, useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { ActivityProvider } from '@/contexts/ActivityContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { Toaster } from '@/components/ui/toaster';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  // Recupera o ID do usuário do localStorage no lado do cliente
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUserId(userData.id);
      }
    } catch (error) {
      console.error('Erro ao recuperar dados do usuário:', error);
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryProvider>
        <AuthProvider>
          <ActivityProvider userId={userId}>
            {children}
            <Toaster />
          </ActivityProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
