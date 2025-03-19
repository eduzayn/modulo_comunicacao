'use client'

import { BaseLayout } from '@/components/layout/BaseLayout'
import { Card } from '@/components/ui/card'
import { StatsCard } from '@/components/ui/stats-card'
import { MessageSquare, Users, Clock, BarChart2, TrendingUp, TrendingDown } from 'lucide-react'
import { FC } from 'react'

const StatsPage: FC = () => {
  return (
    <BaseLayout module="communication">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Estatísticas</h2>
          <p className="text-muted-foreground">
            Análise detalhada das comunicações
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total de Mensagens"
            value="1,284"
            icon={<MessageSquare className="h-4 w-4" />}
            description="Este mês"
            trend={{ value: 12, isPositive: true }}
            module="communication"
          />
          <StatsCard
            title="Usuários Ativos"
            value="342"
            icon={<Users className="h-4 w-4" />}
            description="Últimos 30 dias"
            trend={{ value: 8, isPositive: true }}
            module="communication"
          />
          <StatsCard
            title="Tempo Médio de Resposta"
            value="4.2min"
            icon={<Clock className="h-4 w-4" />}
            description="Esta semana"
            trend={{ value: 5, isPositive: false }}
            module="communication"
          />
          <StatsCard
            title="Taxa de Engajamento"
            value="89%"
            icon={<BarChart2 className="h-4 w-4" />}
            description="Este mês"
            trend={{ value: 3, isPositive: true }}
            module="communication"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Tendências de Mensagens</h3>
            <div className="space-y-4">
              {[
                { name: 'Dúvidas sobre cursos', value: 45, trend: 12, isPositive: true },
                { name: 'Suporte técnico', value: 32, trend: -8, isPositive: false },
                { name: 'Feedback', value: 28, trend: 5, isPositive: true },
                { name: 'Matrículas', value: 24, trend: 15, isPositive: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.value}% das mensagens</p>
                  </div>
                  <div className={`flex items-center ${item.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {item.isPositive ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(item.trend)}%
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Horários de Pico</h3>
            <div className="space-y-4">
              {[
                { time: '09:00 - 11:00', value: 28, description: 'Maior volume de mensagens' },
                { time: '14:00 - 16:00', value: 24, description: 'Segundo pico do dia' },
                { time: '19:00 - 21:00', value: 18, description: 'Período noturno' },
                { time: 'Outros horários', value: 30, description: 'Distribuído ao longo do dia' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.time}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="text-communication font-semibold">
                    {item.value}%
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </BaseLayout>
  )
}

export default StatsPage 