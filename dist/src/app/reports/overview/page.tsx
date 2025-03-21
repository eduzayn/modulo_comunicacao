import { PageContainer } from '@/components/page-container/page-container'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AreaChart, BarChart, BarChartHorizontal } from '@/components/ui/charts'
import { ActivityLog } from '@/components/reports/activity-log'
import {
  CalendarDays,
  MessageSquare,
  Clock,
  Star,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const metadata = {
  title: 'Visão Geral | Relatórios',
  description: 'Relatório geral de atividades e métricas de comunicação'
}

export default function OverviewPage() {
  return (
    <PageContainer
      title="Visão Geral"
      description="Relatório geral de atividades e métricas de comunicação"
      breadcrumbItems={[
        { href: '/reports', label: 'Relatórios' },
        { href: '/reports/overview', label: 'Visão Geral' }
      ]}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Select defaultValue="30">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
              <SelectItem value="year">Este ano</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button>Exportar PDF</Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Atendimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">5.329</div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>12.5%</span>
                </div>
              </div>
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <AreaChart
              className="h-16 mt-4"
              data={[250, 275, 310, 290, 320, 350, 380, 340, 405, 430, 460, 490, 520, 540, 580, 600, 650, 620, 680, 720, 750, 780, 810, 850, 880, 920, 950, 980, 1020, 1050]}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resolução</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">87.2%</div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>2.1%</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <AreaChart
              className="h-16 mt-4"
              data={[82.5, 83.1, 84.2, 83.7, 84.5, 85.1, 85.5, 86.0, 85.8, 86.2, 86.5, 87.2]}
              color="hsl(var(--success))"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">15.6 min</div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowDownRight className="h-4 w-4" />
                  <span>3.2 min</span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <AreaChart
              className="h-16 mt-4"
              data={[22.4, 21.8, 20.5, 19.7, 18.6, 17.9, 17.2, 16.8, 16.4, 16.1, 15.9, 15.6]}
              color="hsl(var(--warning))"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">NPS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">8.7</div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>0.3</span>
                </div>
              </div>
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
            <AreaChart
              className="h-16 mt-4"
              data={[8.1, 8.2, 8.1, 8.3, 8.4, 8.2, 8.5, 8.6, 8.5, 8.7]}
              color="hsl(var(--primary))"
            />
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="channels" className="mt-6 space-y-4">
        <TabsList>
          <TabsTrigger value="channels">Por Canal</TabsTrigger>
          <TabsTrigger value="period">Por Período</TabsTrigger>
          <TabsTrigger value="types">Por Tipo</TabsTrigger>
          <TabsTrigger value="logs">Logs de Atividade</TabsTrigger>
        </TabsList>
        
        <TabsContent value="channels">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Atendimentos por Canal</CardTitle>
                <CardDescription>Visão geral da distribuição de atendimentos por canal de comunicação</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChartHorizontal 
                  className="h-80" 
                  data={[
                    { name: 'WhatsApp', value: 2245 },
                    { name: 'Email', value: 1328 },
                    { name: 'Chat', value: 987 },
                    { name: 'SMS', value: 432 },
                    { name: 'Facebook', value: 212 },
                    { name: 'Instagram', value: 125 },
                  ]}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tempo Médio por Canal</CardTitle>
                <CardDescription>Tempo médio de resposta em minutos</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChartHorizontal 
                  className="h-64" 
                  data={[
                    { name: 'Email', value: 28.5 },
                    { name: 'Facebook', value: 20.2 },
                    { name: 'Instagram', value: 18.5 },
                    { name: 'WhatsApp', value: 15.0 },
                    { name: 'Chat', value: 10.8 },
                    { name: 'SMS', value: 5.2 },
                  ]}
                  color="hsl(var(--warning))"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Resolução por Canal</CardTitle>
                <CardDescription>Percentual de atendimentos resolvidos</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChartHorizontal 
                  className="h-64" 
                  data={[
                    { name: 'Chat', value: 92.3 },
                    { name: 'SMS', value: 93.7 },
                    { name: 'WhatsApp', value: 81.7 },
                    { name: 'Facebook', value: 78.6 },
                    { name: 'Instagram', value: 78.4 },
                    { name: 'Email', value: 90.5 },
                  ]}
                  color="hsl(var(--success))"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="period">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição no Tempo</CardTitle>
              <CardDescription>Total de atendimentos por dia nas últimas semanas</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                height={300}
                showGrid={true}
                data={[
                  72, 80, 95, 68, 125, 85, 65, 
                  82, 90, 105, 78, 135, 90, 70,
                  95, 102, 110, 88, 142, 105, 80,
                  105, 112, 120, 98, 150, 115, 90,
                  115, 122
                ]}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <div>1 Mai</div>
                <div>15 Mai</div>
                <div>31 Mai</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="types">
          <Card>
            <CardHeader>
              <CardTitle>Atendimentos por Tipo</CardTitle>
              <CardDescription>Distribuição de atendimentos por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChartHorizontal 
                className="h-80" 
                data={[
                  { name: 'Suporte Técnico', value: 1856 },
                  { name: 'Dúvidas Gerais', value: 1245 },
                  { name: 'Reclamações', value: 872 },
                  { name: 'Informações de Produto', value: 782 },
                  { name: 'Agendamentos', value: 574 },
                  { name: 'Cancelamentos', value: 345 },
                  { name: 'Outros', value: 238 },
                ]}
                color="hsl(var(--primary))"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Registros de Atividade</CardTitle>
              <CardDescription>Principais eventos e atividades do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityLog limit={15} showFilters={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
} 