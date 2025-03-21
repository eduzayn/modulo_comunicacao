'use client'

import React from 'react';
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isChunkError = error.message && (
    error.message.includes('Loading chunk') || 
    error.message.includes('ChunkLoadError')
  );

  const handleNavigation = () => {
    // Limpar cache antes de navegar
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      
      // Navegar para a página de inbox
      window.location.href = '/inbox';
    }
  };

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
          <div className="max-w-md w-full mx-auto space-y-6 text-center">
            <div className="bg-red-100 dark:bg-red-900/20 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Erro Crítico na Aplicação</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {isChunkError 
                  ? 'Erro no carregamento dos recursos da página. Isso pode ocorrer devido a problemas de rede ou cache.'
                  : 'Ocorreu um erro crítico na aplicação. Nossa equipe foi notificada do problema.'}
              </p>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => reset()}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md text-sm font-medium transition-colors"
                >
                  Tentar novamente
                </button>
                
                <button
                  onClick={handleNavigation}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Ir para Inbox
                </button>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Código de erro: {error.digest || 'sem código'}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 