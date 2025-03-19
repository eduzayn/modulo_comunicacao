'use client'

import { BaseLayout } from '@/components/layout/BaseLayout'
import { StatsCard } from '@/components/ui/stats-card'
import { MessageSquare, Users, Clock, BarChart2 } from 'lucide-react'

export default function CommunicationPage() {
  return (
    <BaseLayout module="communication">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Módulo de Comunicação</h2>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel de controle de comunicação
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total de Contatos"
            value="128"
            icon={<Users className="h-4 w-4" />}
            description="Contatos ativos no sistema"
            trend={{ value: 12, isPositive: true }}
            module="communication"
          />
          <StatsCard
            title="Conversas Ativas"
            value="3"
            icon={<MessageSquare className="h-4 w-4" />}
            description="Conversas em andamento"
            module="communication"
          />
          <StatsCard
            title="Tempo Médio de Resposta"
            value="5min"
            icon={<Clock className="h-4 w-4" />}
            description="Nas últimas 24 horas"
            trend={{ value: 8, isPositive: true }}
            module="communication"
          />
          <StatsCard
            title="Taxa de Resposta"
            value="98%"
            icon={<BarChart2 className="h-4 w-4" />}
            description="Mensagens respondidas"
            trend={{ value: 2, isPositive: true }}
            module="communication"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            {/* Aqui podemos adicionar um gráfico de atividade */}
          </div>
          <div className="col-span-3">
            {/* Aqui podemos adicionar uma lista de atividades recentes */}
          </div>
        </div>
      </div>
    </BaseLayout>
  )
} 