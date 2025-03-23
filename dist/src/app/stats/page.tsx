'use client';

import React, { useState } from 'react';
import { BarChart, LineChart, PieChart, Activity, MessageSquare, Clock, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Função para buscar dados das estatísticas
async function fetchStats(period: string) {
  const response = await fetch(`/api/stats?period=${period}`);
  if (!response.ok) {
    throw new Error('Falha ao carregar estatísticas');
  }
  return response.json();
}

// Componente de gráfico de barras simulado
const BarChartComponent = () => (
  <div className="h-64 w-full flex items-end justify-between gap-2 pt-8 pb-2">
    {[65, 40, 85, 30, 55, 60, 45].map((height, i) => (
      <div key={i} className="relative group">
        <div 
          className="w-12 bg-blue-500 rounded-t-md transition-all hover:bg-blue-600"
          style={{ height: `${height}%` }}
        ></div>
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {height}%
        </div>
        <div className="text-xs text-center mt-1">{['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i]}</div>
      </div>
    ))}
  </div>
);

// Componente de gráfico de linha simulado
const LineChartComponent = () => (
  <div className="h-64 w-full relative pt-8 pb-2">
    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
      <Activity className="h-48 w-48" />
    </div>
  </div>
);

// Componente de gráfico de pizza simulado
const PieChartComponent = () => (
  <div className="h-64 w-full flex items-center justify-center">
    <div className="relative w-40 h-40">
      <div className="absolute inset-0 rounded-full border-8 border-blue-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
      <div className="absolute inset-0 rounded-full border-8 border-green-500" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }}></div>
      <div className="absolute inset-0 rounded-full border-8 border-yellow-500" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 50%)' }}></div>
      <div className="absolute inset-0 rounded-full border-8 border-red-500" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 50%, 0 50%)' }}></div>
    </div>
  </div>
);

export default function StatsPage() {
  const [period, setPeriod] = useState('7d');
  const [activeTab, setActiveTab] = useState('activity');
  
  // Query para dados em tempo real
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['stats', period],
    queryFn: () => fetchStats(period),
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Erro ao carregar estatísticas. Por favor, tente novamente.
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Estatísticas</h1>
        <div className="flex items-center gap-2">
          <select 
            className="px-3 py-2 border rounded-md text-sm"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="24h">Últimas 24 horas</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
          </select>
          <button className="px-3 py-2 border rounded-md flex items-center gap-2 text-sm">
            <Download className="h-4 w-4" />
            Exportar
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Mensagens</p>
              <p className="text-3xl font-bold">1,248</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">
            +12.5% em relação ao período anterior
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Taxa de Resposta</p>
              <p className="text-3xl font-bold">94.2%</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">
            +2.1% em relação ao período anterior
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tempo Médio de Resposta</p>
              <p className="text-3xl font-bold">5.2 min</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-red-600">
            +0.8 min em relação ao período anterior
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b">
          <div className="flex">
            <button 
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'activity' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('activity')}
            >
              Atividade
            </button>
            <button 
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'channels' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('channels')}
            >
              Canais
            </button>
            <button 
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'sentiment' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('sentiment')}
            >
              Sentimento
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'activity' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Atividade por Dia</h3>
              <BarChartComponent />
            </div>
          )}
          
          {activeTab === 'channels' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Distribuição por Canal</h3>
                <PieChartComponent />
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm">WhatsApp (45%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">Email (25%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm">Chat (20%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm">SMS (10%)</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Desempenho por Canal</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">WhatsApp</span>
                      <span className="text-sm">98%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Email</span>
                      <span className="text-sm">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Chat</span>
                      <span className="text-sm">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">SMS</span>
                      <span className="text-sm">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'sentiment' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Análise de Sentimento</h3>
              <LineChartComponent />
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">68%</p>
                  <p className="text-sm text-gray-500">Positivo</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-yellow-600">24%</p>
                  <p className="text-sm text-gray-500">Neutro</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-600">8%</p>
                  <p className="text-sm text-gray-500">Negativo</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
