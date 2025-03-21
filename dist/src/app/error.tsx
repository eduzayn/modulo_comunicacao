'use client'

/**
 * error.tsx
 * 
 * Componente de erro global para capturar e exibir erros inesperados.
 * Este componente é renderizado automaticamente pelo Next.js quando ocorre um erro não tratado.
 */

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertOctagon, Home, RotateCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Opcional: registrar o erro em um serviço de rastreamento de erros
    console.error('Erro não tratado:', error);
  }, [error]);

  // Verificar se é um erro de carregamento de chunk
  const isChunkError = error.message && (
    error.message.includes('Loading chunk') || 
    error.message.includes('ChunkLoadError')
  );

  const handleReset = () => {
    // Limpar cache antes de tentar novamente
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
    
    // Recarregar a página completamente se for erro de chunk
    if (isChunkError) {
      window.location.href = '/inbox';
    } else {
      reset(); // Usar o reset padrão do Next.js para outros erros
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
            <AlertOctagon className="h-10 w-10 text-red-600 dark:text-red-300" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">Ocorreu um erro</h1>
        
        <p className="text-muted-foreground">
          Desculpe, algo deu errado ao processar sua solicitação.
        </p>
        
        {error.digest && (
          <div className="text-xs p-2 bg-muted rounded-md">
            Código de erro: <code>{error.digest}</code>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button onClick={handleReset} variant="default">
            <RotateCcw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Página Inicial
            </Link>
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground pt-8">
          Se o problema persistir, entre em contato com o suporte técnico.
        </div>
      </div>
    </div>
  );
} 