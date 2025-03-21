'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SystemStatus {
  initialized: boolean;
  metrics: {
    totalEvents: number;
    processingTime: number;
    lastEvent: any | null;
  };
  uptime: number;
  version: string;
}

export default function SystemStatusPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/admin/system/status');
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar status: ${response.status}`);
      }
      
      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar status:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Efeito para buscar dados ao montar o componente
  useEffect(() => {
    fetchStatus();
  }, []);
  
  // Gerenciar intervalo de atualização
  useEffect(() => {
    if (refreshInterval) {
      const timer = setInterval(fetchStatus, refreshInterval);
      return () => clearInterval(timer);
    }
  }, [refreshInterval]);

  const formatTime = (seconds: number): string => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds %= (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds %= (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  };

  // Alterar intervalo de atualização
  const toggleAutoRefresh = () => {
    setRefreshInterval(prev => prev ? null : 5000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Status do Sistema</h1>
        
        <div className="flex space-x-2">
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors"
          >
            {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
          
          <button
            onClick={toggleAutoRefresh}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              refreshInterval
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {refreshInterval ? 'Auto: ON' : 'Auto: OFF'}
          </button>
        </div>
      </div>
      
      {error ? (
        <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-md text-red-800 dark:text-red-200 mb-6">
          <p className="font-medium">Erro ao carregar status</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : loading && !status ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-lg">Carregando status do sistema...</div>
        </div>
      ) : status ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Informações Gerais</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Status:</span>
                <span className={`font-medium ${status.initialized ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {status.initialized ? 'Inicializado' : 'Não Inicializado'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Tempo ativo:</span>
                <span className="font-medium">{formatTime(status.uptime)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Versão:</span>
                <span className="font-medium">{status.version}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Métricas</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Total de eventos:</span>
                <span className="font-medium">{status.metrics.totalEvents}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Tempo médio de processamento:</span>
                <span className="font-medium">{status.metrics.processingTime.toFixed(2)}ms</span>
              </div>
            </div>
            
            {status.metrics.lastEvent && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold mb-2">Último evento:</h3>
                <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-auto max-h-28">
                  {JSON.stringify(status.metrics.lastEvent, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      ) : null}
      
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4">
          <button
            onClick={() => router.push('/admin/system/initialize')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            Inicializar Sistema
          </button>
          
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
          >
            Voltar para o Painel
          </button>
        </div>
      </div>
    </div>
  );
} 