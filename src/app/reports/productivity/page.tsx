'use client'

import { PageContainer } from '@/components/page-container/page-container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Dados de exemplo para o relatório de produtividade
const weeklyData = [
  { dia: 'Segunda', atendimentos: 45, tempoMedio: 12 },
  { dia: 'Terça', atendimentos: 52, tempoMedio: 10 },
  { dia: 'Quarta', atendimentos: 49, tempoMedio: 11 },
  { dia: 'Quinta', atendimentos: 60, tempoMedio: 9 },
  { dia: 'Sexta', atendimentos: 55, tempoMedio: 14 },
  { dia: 'Sábado', atendimentos: 40, tempoMedio: 8 },
  { dia: 'Domingo', atendimentos: 28, tempoMedio: 7 },
]

const monthlyData = [
  { mes: 'Jan', atendimentos: 320, tempoMedio: 14 },
  { mes: 'Fev', atendimentos: 310, tempoMedio: 13 },
  { mes: 'Mar', atendimentos: 350, tempoMedio: 12 },
  { mes: 'Abr', atendimentos: 380, tempoMedio: 11 },
  { mes: 'Mai', atendimentos: 400, tempoMedio: 10 },
  { mes: 'Jun', atendimentos: 390, tempoMedio: 11 },
]

// Dados de produtividade por operador
const operatorsData = [
  { nome: 'Ana Silva', atendimentos: 78, tempoMedio: 8, satisfacao: 92 },
  { nome: 'Carlos Santos', atendimentos: 65, tempoMedio: 12, satisfacao: 88 },
  { nome: 'Juliana Lima', atendimentos: 82, tempoMedio: 7, satisfacao: 95 },
  { nome: 'Roberto Alves', atendimentos: 71, tempoMedio: 9, satisfacao: 90 },
  { nome: 'Fernanda Costa', atendimentos: 68, tempoMedio: 10, satisfacao: 89 },
]

export default function ProductivityPage() {
  return (
    <PageContainer
      title="Produtividade"
      description="Análise de produtividade dos operadores e tempos de atendimento"
      breadcrumbItems={[
        { href: '/reports', label: 'Relatórios' },
        { href: '/reports/productivity', label: 'Produtividade' }
      ]}
    >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="operators">Por Operador</TabsTrigger>
          <TabsTrigger value="channels">Por Canal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Atendimentos Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48</div>
                <p className="text-xs text-muted-foreground">+15% em relação a ontem</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tempo Médio (Hoje)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">9.2 min</div>
                <p className="text-xs text-muted-foreground">-1.8 min em relação a ontem</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Resolução (Hoje)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">+2% em relação a ontem</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fila Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Tempo médio de espera: 3 min</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Produtividade Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={weeklyData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dia" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="atendimentos" 
                        name="Atendimentos" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="tempoMedio" 
                        name="Tempo Médio (min)" 
                        stroke="#82ca9d" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="operators">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {operatorsData.map((operator, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{operator.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Atendimentos</p>
                      <p className="text-xl font-bold">{operator.atendimentos}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tempo Médio</p>
                      <p className="text-xl font-bold">{operator.tempoMedio} min</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Satisfação</p>
                      <p className="text-xl font-bold">{operator.satisfacao}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="channels">
          <Card>
            <CardHeader>
              <CardTitle>Produtividade por Canal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="atendimentos" 
                      name="Atendimentos" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="tempoMedio" 
                      name="Tempo Médio (min)" 
                      stroke="#82ca9d" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
} 