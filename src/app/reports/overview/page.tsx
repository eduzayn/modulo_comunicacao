'use client'

import { PageContainer } from '@/components/page-container/page-container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

// Dados de exemplo para o relatório
const data = [
  { canal: 'WhatsApp', atendimentos: 120, resolvidos: 98, tempoMedio: 15 },
  { canal: 'Email', atendimentos: 84, resolvidos: 76, tempoMedio: 28 },
  { canal: 'Chat', atendimentos: 65, resolvidos: 60, tempoMedio: 10 },
  { canal: 'SMS', atendimentos: 32, resolvidos: 30, tempoMedio: 5 },
  { canal: 'Redes Sociais', atendimentos: 28, resolvidos: 22, tempoMedio: 20 },
]

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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Atendimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">329</div>
            <p className="text-xs text-muted-foreground">+12.5% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resolução</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.2%</div>
            <p className="text-xs text-muted-foreground">+2.1% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.6 min</div>
            <p className="text-xs text-muted-foreground">-3.2 min em relação ao mês anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">NPS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.7</div>
            <p className="text-xs text-muted-foreground">+0.3 em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Atendimentos por Canal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="canal" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="atendimentos" name="Total de Atendimentos" fill="#8884d8" />
                  <Bar dataKey="resolvidos" name="Atendimentos Resolvidos" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
} 