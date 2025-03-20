'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log do erro para análise
    console.error('Erro na aplicação:', error);
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-red-100 dark:bg-red-900/20 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Ocorreu um erro</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {isChunkError 
              ? 'Erro no carregamento dos recursos da página. Isso pode ocorrer devido a problemas de rede ou cache.'
              : 'Algo inesperado aconteceu. Nossa equipe foi notificada do problema.'}
          </p>
          <Button 
            onClick={handleReset}
            className="w-full"
          >
            Tentar novamente
          </Button>
        </div>
        
        {/* Link para ir direto para a página de inbox se persistir o erro */}
        {isChunkError && (
          <div className="mt-4">
            <a 
              href="/inbox" 
              className="text-sm text-primary hover:underline"
            >
              Ir para a caixa de entrada
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 