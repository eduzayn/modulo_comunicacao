'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@supabase/supabase-js'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Loader2, BarChart3, Settings, Bell, Clock, Users, CheckCircle, XCircle, Activity, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { logger } from '@/lib/logger'
import { useRouter } from 'next/navigation'

// Cliente Supabase para operações no banco de dados
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function EventManagerPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()
  
  // Consulta para obter eventos recentes
  const {
    data: events,
    isLoading: isLoadingEvents,
    error: eventsError,
    refetch: refetchEvents
  } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        // Buscar eventos reais da tabela event_history
        const { data, error } = await supabase
          .from('event_history')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        
        // Mapear dados para o formato esperado pela interface
        return data.map(event => ({
          id: event.id,
          type: event.event_type,
          status: event.status || 'processed',
          conversation_id: event.payload?.conversation_id || event.payload?.conversationId || '',
          payload: event.payload || {},
          created_at: event.created_at,
          processed_at: event.processed_at,
          error: event.error
        }));
      } catch (error) {
        logger.error('Erro ao carregar eventos', { error });
        throw error;
      }
    },
    refetchInterval: 30000 // Atualizar a cada 30 segundos
  })
  
  // Consulta para obter o status dos middlewares
  const {
    data: middlewares,
    isLoading: isLoadingMiddlewares,
    error: middlewaresError,
    refetch: refetchMiddlewares
  } = useQuery({
    queryKey: ['middlewares_status'],
    queryFn: async () => {
      try {
        // Buscar configurações dos middlewares da tabela middleware_settings
        const { data: assignmentRulesData, error: assignmentError } = await supabase
          .from('middleware_settings')
          .select('*')
          .eq('type', 'assignment_rules')
          .single();
          
        const { data: businessHoursData, error: businessError } = await supabase
          .from('middleware_settings')
          .select('*')
          .eq('type', 'business_hours')
          .single();
          
        if (assignmentError && !assignmentRulesData) {
          logger.warn('Dados do middleware de regras de atribuição não encontrados');
        }
        
        if (businessError && !businessHoursData) {
          logger.warn('Dados do middleware de horários comerciais não encontrados');
        }
        
        // Buscar estatísticas de processamento
        const { data: assignmentStats, error: statsError } = await supabase
          .from('middleware_stats')
          .select('*')
          .eq('middleware_type', 'assignment_rules')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        const { data: businessStats } = await supabase
          .from('middleware_stats')
          .select('*')
          .eq('middleware_type', 'business_hours')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        // Buscar regras ativas
        const { data: activeRules, error: rulesError } = await supabase
          .from('assignment_rules')
          .select('*')
          .eq('status', 'active');
          
        // Estruturar os dados
        return {
          assignmentRules: {
            enabled: assignmentRulesData?.enabled ?? false,
            lastProcessed: assignmentStats?.last_run || null,
            totalProcessed: assignmentStats?.total_processed || 0,
            avgProcessingTime: assignmentStats?.avg_processing_time || 0,
            activeRules: activeRules?.length || 0
          },
          businessHours: {
            enabled: businessHoursData?.enabled ?? false,
            lastProcessed: businessStats?.last_run || null,
            totalProcessed: businessStats?.total_processed || 0,
            avgProcessingTime: businessStats?.avg_processing_time || 0,
            currentState: businessHoursData?.current_state || 'closed',
            nextChange: businessHoursData?.next_change || null
          }
        };
      } catch (error) {
        logger.error('Erro ao carregar status dos middlewares', { error });
        // Em caso de erro, retornar estrutura vazia para evitar erros na interface
        return {
          assignmentRules: {
            enabled: false,
            lastProcessed: null,
            totalProcessed: 0,
            avgProcessingTime: 0,
            activeRules: 0
          },
          businessHours: {
            enabled: false,
            lastProcessed: null,
            totalProcessed: 0,
            avgProcessingTime: 0,
            currentState: 'closed',
            nextChange: null
          }
        };
      }
    },
    refetchInterval: 60000 // Atualizar a cada minuto
  })
  
  // Função para alternar o status de um middleware
  const toggleMiddlewareStatus = async (type: 'assignment_rules' | 'business_hours', enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('middleware_settings')
        .update({ enabled })
        .eq('type', type);
        
      if (error) throw error;
      
      // Recarregar dados
      refetchMiddlewares();
      
    } catch (error) {
      logger.error(`Erro ao atualizar status do middleware ${type}`, { error });
    }
  }
  
  // Formatação de data para exibição
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Pendente'
    
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm:ss", {
      locale: ptBR,
    })
  }
  
  type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'info';
  
  // Função para determinar a cor do badge com base no status do evento
  const getStatusBadgeVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'processed':
        return 'success'
      case 'processing':
        return 'default'
      case 'queued':
        return 'secondary'
      case 'failed':
        return 'destructive'
      default:
        return 'outline'
    }
  }
  
  // Função para determinar a cor do badge com base no tipo de evento
  const getTypeBadgeVariant = (type: string): BadgeVariant => {
    if (type.startsWith('conversation.created')) return 'default'
    if (type.startsWith('conversation.assigned')) return 'success'
    if (type.startsWith('conversation.closed')) return 'secondary'
    if (type.startsWith('message.created')) return 'info'
    return 'outline'
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciador de Eventos</h1>
          <p className="text-muted-foreground">
            Configure e monitore o sistema de eventos e middlewares
          </p>
        </div>
        <Button onClick={() => {
          refetchEvents();
          refetchMiddlewares();
        }}>
          <Activity className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="assignment-rules">Regras de Atribuição</TabsTrigger>
          <TabsTrigger value="business-hours">Horários Comerciais</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Cards de Status dos Middlewares */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Card de Regras de Atribuição */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    Regras de Atribuição
                  </div>
                  {isLoadingMiddlewares ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Switch 
                      checked={middlewares?.assignmentRules.enabled ?? false} 
                      onCheckedChange={(checked) => toggleMiddlewareStatus('assignment_rules', checked)} 
                    />
                  )}
                </CardTitle>
                <CardDescription>
                  Middleware para distribuição automática de conversas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Último processamento</p>
                    <p className="font-medium">
                      {isLoadingMiddlewares ? (
                        <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                      ) : (
                        formatDate(middlewares?.assignmentRules.lastProcessed ?? null)
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Regras ativas</p>
                    <p className="font-medium">
                      {isLoadingMiddlewares ? (
                        <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                      ) : (
                        middlewares?.assignmentRules.activeRules ?? 0
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Total processado</p>
                    <p className="font-medium">
                      {isLoadingMiddlewares ? (
                        <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                      ) : (
                        `${middlewares?.assignmentRules.totalProcessed ?? 0} eventos`
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Tempo médio</p>
                    <p className="font-medium">
                      {isLoadingMiddlewares ? (
                        <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                      ) : (
                        `${middlewares?.assignmentRules.avgProcessingTime ?? 0} ms`
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => router.push('/settings/assignment-rules')}
                >
                  Gerenciar regras
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* Card de Horários Comerciais */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-primary" />
                    Horários Comerciais
                  </div>
                  {isLoadingMiddlewares ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Switch 
                      checked={middlewares?.businessHours.enabled ?? false} 
                      onCheckedChange={(checked) => toggleMiddlewareStatus('business_hours', checked)} 
                    />
                  )}
                </CardTitle>
                <CardDescription>
                  Middleware para gerenciamento de atendimento fora do horário
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Status atual</p>
                    {isLoadingMiddlewares ? (
                      <p className="font-medium">
                        <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                        Carregando...
                      </p>
                    ) : (
                      <p className="font-medium flex items-center">
                        {middlewares?.businessHours.currentState === 'open' ? (
                          <>
                            <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                            Aberto
                          </>
                        ) : (
                          <>
                            <XCircle className="mr-1 h-4 w-4 text-red-500" />
                            Fechado
                          </>
                        )}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Próxima mudança</p>
                    <p className="font-medium">
                      {isLoadingMiddlewares ? (
                        <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                      ) : (
                        formatDate(middlewares?.businessHours.nextChange ?? null)
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Total processado</p>
                    <p className="font-medium">
                      {isLoadingMiddlewares ? (
                        <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                      ) : (
                        `${middlewares?.businessHours.totalProcessed ?? 0} eventos`
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Tempo médio</p>
                    <p className="font-medium">
                      {isLoadingMiddlewares ? (
                        <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                      ) : (
                        `${middlewares?.businessHours.avgProcessingTime ?? 0} ms`
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => router.push('/settings/business-hours')}
                >
                  Gerenciar horários
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Tabela de Eventos Recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Eventos Recentes</CardTitle>
              <CardDescription>
                Histórico dos últimos eventos processados pelo sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingEvents ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : eventsError ? (
                <div className="text-center py-8">
                  <p className="text-destructive mb-2">Erro ao carregar eventos</p>
                  <Button variant="outline" onClick={() => refetchEvents()}>
                    Tentar novamente
                  </Button>
                </div>
              ) : !events || events.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum evento registrado ainda</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Conversa</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Processado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events?.map(event => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <Badge variant={getTypeBadgeVariant(event.type)}>
                            {event.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(event.status)}>
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{event.conversation_id}</TableCell>
                        <TableCell>{formatDate(event.created_at)}</TableCell>
                        <TableCell>{formatDate(event.processed_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="outline" onClick={() => router.push('/settings/events')}>
                Ver todos os eventos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="assignment-rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Atribuição</CardTitle>
              <CardDescription>
                Configurações para distribuição automática de conversas
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-10">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Gerenciamento de Regras de Atribuição</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Configure regras detalhadas para distribuição automática de conversas de acordo com 
                canais, conteúdo e propriedades específicas.
              </p>
              <Button 
                onClick={() => router.push('/settings/assignment-rules')}
                className="mx-auto"
              >
                Abrir gerenciamento de regras
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="business-hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Horários Comerciais</CardTitle>
              <CardDescription>
                Configurações de horários de funcionamento
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-10">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Gerenciamento de Horários Comerciais</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Defina horários de funcionamento para cada dia da semana e configure o comportamento 
                do sistema para mensagens recebidas fora do expediente.
              </p>
              <Button 
                onClick={() => router.push('/settings/business-hours')}
                className="mx-auto"
              >
                Abrir gerenciamento de horários
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 