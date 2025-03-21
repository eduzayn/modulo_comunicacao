import { Suspense } from 'react'
import { CreateDashboardForm } from '@/components/reports/create-dashboard-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AreaChart, BarChart, BarChartHorizontal } from '@/components/ui/charts'
import { ActivityLog } from '@/components/reports/activity-log'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
  title: 'Dashboard de Relatórios | Sistema de Comunicação',
  description: 'Visualize e crie dashboards personalizados para monitorar o sistema de comunicação'
}

// Componentes de Carregamento
function ChartSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

function ActivityLogSkeleton() {
  return (
    <div className="space-y-4">
      {Array(8).fill(0).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-80" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Componentes para Suspense
function MetricsOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Total de Mensagens</CardTitle>
          <CardDescription>Últimos 30 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">12.543</div>
          <p className="text-xs text-muted-foreground">
            +12% em relação ao período anterior
          </p>
          <AreaChart
            className="h-32 mt-4"
            data={[10, 24, 18, 42, 36, 29, 42, 55, 44, 38, 52, 46, 55, 62, 58, 60, 65, 59, 53, 68, 72, 80, 76, 83, 78, 84, 88, 92, 98, 110]}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Tempo Médio de Resposta</CardTitle>
          <CardDescription>Em minutos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">5,2</div>
          <p className="text-xs text-muted-foreground">
            -8% em relação ao período anterior
          </p>
          <BarChart
            className="h-32 mt-4"
            data={[8.1, 7.8, 7.2, 6.9, 7.1, 6.5, 6.2, 5.9, 6.1, 5.8, 5.6, 5.4, 5.7, 5.3, 5.2]}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Taxa de Resolução</CardTitle>
          <CardDescription>Conversas resolvidas em primeira interação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">78%</div>
          <p className="text-xs text-muted-foreground">
            +5% em relação ao período anterior
          </p>
          <AreaChart
            className="h-32 mt-4"
            data={[62, 65, 64, 68, 66, 70, 72, 71, 73, 75, 74, 76, 78]}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function ChannelDistribution() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Distribuição por Canal</CardTitle>
          <CardDescription>Mensagens por canal de comunicação</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChartHorizontal
            className="h-80"
            data={[
              { name: "WhatsApp", value: 4328 },
              { name: "Email", value: 3294 },
              { name: "Chat Web", value: 2854 },
              { name: "Facebook", value: 1532 },
              { name: "Instagram", value: 982 },
              { name: "Telegram", value: 721 }
            ]}
          />
        </CardContent>
      </Card>
      
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Eventos do sistema nas últimas 24h</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityLog limit={8} />
        </CardContent>
      </Card>
    </div>
  )
}

function PerformanceMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de Desempenho</CardTitle>
        <CardDescription>
          Análise detalhada das métricas de desempenho do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          As métricas de desempenho serão carregadas aqui...
        </p>
      </CardContent>
    </Card>
  )
}

function SystemLogs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs do Sistema</CardTitle>
        <CardDescription>
          Visualize e filtre logs para monitorar a saúde do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ActivityLog limit={20} showFilters={true} />
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Dashboard de Relatórios</h1>
        <p className="text-muted-foreground">
          Visualize o desempenho do sistema de comunicação e crie relatórios personalizados
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Desempenho</TabsTrigger>
          <TabsTrigger value="logs">Logs do Sistema</TabsTrigger>
          <TabsTrigger value="custom">Relatórios Personalizados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Suspense fallback={<ChartSkeleton />}>
            <MetricsOverview />
          </Suspense>
          
          <Suspense fallback={<ChartSkeleton />}>
            <ChannelDistribution />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="performance">
          <Suspense fallback={<ChartSkeleton />}>
            <PerformanceMetrics />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="logs">
          <Suspense fallback={<ActivityLogSkeleton />}>
            <SystemLogs />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="custom">
          <Suspense fallback={<ChartSkeleton />}>
            <CreateDashboardForm />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
 