'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle2, RefreshCcw, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SystemStatus {
  initialized: boolean;
  components: Record<string, {
    status: 'healthy' | 'warning' | 'error' | 'unknown';
    message: string;
    lastCheck?: string;
    metrics?: Record<string, any>;
  }>;
  metrics: {
    totalEvents: number;
    totalMessages: number;
    activeChannels: number;
    activeConversations: number;
  };
}

export default function MonitoringPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchSystemStatus();
  }, []);

  const fetchSystemStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/system/status');
      
      if (!response.ok) {
        throw new Error('Falha ao obter status do sistema');
      }
      
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Erro ao buscar status do sistema:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSystem = async () => {
    setRefreshing(true);
    try {
      // Tentar reinicializar o sistema
      const response = await fetch('/api/admin/system/reinitialize', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Falha ao reinicializar o sistema');
      }
      
      // Atualizar status após reinicialização
      await fetchSystemStatus();
    } catch (error) {
      console.error('Erro ao reinicializar sistema:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const reinitializeComponent = async (componentName: string) => {
    try {
      const response = await fetch(`/api/admin/system/reinitialize/${componentName}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Falha ao reinicializar componente ${componentName}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        await fetchSystemStatus();
      } else {
        throw new Error(data.message || `Falha ao reinicializar componente ${componentName}`);
      }
    } catch (error) {
      console.error(`Erro ao reinicializar componente ${componentName}:`, error);
      alert(`Erro ao reinicializar ${componentName}. Tente novamente.`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500 hover:bg-green-600';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'error':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-500">Saudável</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">Atenção</Badge>;
      case 'error':
        return <Badge className="bg-red-500">Erro</Badge>;
      default:
        return <Badge className="bg-gray-500">Desconhecido</Badge>;
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Diagnóstico do Sistema</h1>
        <Button 
          onClick={refreshSystem} 
          disabled={refreshing} 
          className="flex items-center gap-2"
        >
          <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Atualizando...' : 'Atualizar Diagnóstico'}
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="w-full h-[220px] rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="w-full h-[180px] rounded-lg" />
            <Skeleton className="w-full h-[180px] rounded-lg" />
            <Skeleton className="w-full h-[180px] rounded-lg" />
          </div>
        </div>
      ) : status ? (
        <>
          <Alert className={status.initialized ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}>
            <div className="flex items-center gap-2">
              {status.initialized ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <AlertTitle>
                {status.initialized ? "Sistema Inicializado" : "Sistema Não Inicializado"}
              </AlertTitle>
            </div>
            <AlertDescription>
              {status.initialized 
                ? "Todos os componentes do sistema foram inicializados corretamente." 
                : "O sistema não foi inicializado completamente. Alguns serviços podem não estar disponíveis."}
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{status.metrics.totalEvents.toLocaleString()}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{status.metrics.totalMessages.toLocaleString()}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Canais Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{status.metrics.activeChannels}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conversas Ativas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{status.metrics.activeConversations}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="channels">Canais</TabsTrigger>
              <TabsTrigger value="metrics">Métricas</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(status.components).map(([name, component]) => (
                  <Card key={name}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="capitalize">{name}</CardTitle>
                        {getStatusBadge(component.status)}
                      </div>
                      <CardDescription>{component.message}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-500">
                      <div>Última verificação: {new Date(component.lastCheck || '').toLocaleString()}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="channels" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Status dos Canais</CardTitle>
                  <CardDescription>Informações sobre a saúde dos canais de comunicação</CardDescription>
                </CardHeader>
                <CardContent>
                  {status.components.channels.metrics && Object.entries(status.components.channels.metrics).map(([channel, data]: [string, any]) => (
                    <div key={channel} className="flex items-center justify-between p-2 border-b last:border-0">
                      <div className="font-medium capitalize">{channel}</div>
                      <div className="flex items-center gap-2">
                        <span>Latência: {data.latency}</span>
                        {getStatusBadge(data.status)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => reinitializeComponent('channels')}
                >
                  <Activity className="h-4 w-4" />
                  Reinicializar Canais
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="metrics" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas do Sistema (Fenícios)</CardTitle>
                  <CardDescription>Dados de desempenho e utilização do sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <div className="text-sm font-medium">Total de Métricas</div>
                      <div className="text-2xl font-bold">{status.components.metrics.metrics?.totalMetrics}</div>
                    </div>
                    <div className="border rounded-md p-4">
                      <div className="text-sm font-medium">Última Atualização</div>
                      <div className="text-sm">
                        {new Date(status.components.metrics.metrics?.lastMetricTimestamp || '').toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => reinitializeComponent('metrics')}
                >
                  <Activity className="h-4 w-4" />
                  Reinicializar Sistema de Métricas
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="events" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sistema de Eventos</CardTitle>
                  <CardDescription>Estado e métricas do processamento de eventos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-md p-4">
                        <div className="text-sm font-medium">Handlers Registrados</div>
                        <div className="text-2xl font-bold">{status.components.events.metrics?.registeredHandlers}</div>
                      </div>
                      <div className="border rounded-md p-4">
                        <div className="text-sm font-medium">Eventos Processados</div>
                        <div className="text-2xl font-bold">{status.components.events.metrics?.eventsProcessed}</div>
                      </div>
                      <div className="border rounded-md p-4">
                        <div className="text-sm font-medium">Tempo Médio</div>
                        <div className="text-2xl font-bold">{status.components.events.metrics?.averageProcessingTime}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => reinitializeComponent('events')}
                      >
                        <Activity className="h-4 w-4" />
                        Reinicializar Sistema de Eventos
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Não foi possível obter informações sobre o status do sistema. Tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 