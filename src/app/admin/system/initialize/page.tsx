'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InitializeSystemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  const initializeSystem = async () => {
    try {
      setLoading(true);
      setResult(null);

      const response = await fetch('/api/admin/system/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      setResult({
        success: response.ok,
        message: data.message || (response.ok ? 'Sistema inicializado com sucesso' : 'Falha ao inicializar sistema'),
        error: data.error,
      });
    } catch (error) {
      setResult({
        success: false,
        message: 'Erro ao inicializar sistema',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Inicialização do Sistema</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <p className="mb-4">
          Esta página permite inicializar manualmente o sistema de comunicação.
          Use esta função apenas quando necessário, como durante manutenção ou
          após correção de problemas.
        </p>
        
        <div className="flex flex-col space-y-4">
          <button
            onClick={initializeSystem}
            disabled={loading}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              loading
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Inicializando...' : 'Inicializar Sistema'}
          </button>
          
          {result && (
            <div className={`p-4 rounded-md ${
              result.success 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }`}>
              <p className="font-medium">{result.message}</p>
              {result.error && (
                <p className="text-sm mt-2">{result.error}</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={() => router.push('/admin/system/status')}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
        >
          Ver Status do Sistema
        </button>
        <button
          onClick={() => router.push('/admin')}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
        >
          Voltar para o Painel
        </button>
      </div>
    </div>
  );
} 