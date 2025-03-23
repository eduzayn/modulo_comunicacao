'use client'

import { BaseLayout } from '@/components/layout/BaseLayout'
import { StatsCard } from '@/components/ui/stats-card'
import { Users, DollarSign, CalendarCheck, TrendingUp } from 'lucide-react'

export default function EnrollmentPage() {
  return (
    <BaseLayout module="enrollment">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Módulo de Matrículas</h2>
          <p className="text-muted-foreground">
            Gerencie matrículas e informações financeiras
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Alunos Matriculados"
            value="342"
            icon={<Users className="h-4 w-4" />}
            description="Total de matrículas ativas"
            trend={{ value: 8, isPositive: true }}
            module="enrollment"
          />
          <StatsCard
            title="Receita Mensal"
            value="R$ 48.250"
            icon={<DollarSign className="h-4 w-4" />}
            description="Mês atual"
            trend={{ value: 12, isPositive: true }}
            module="enrollment"
          />
          <StatsCard
            title="Matrículas do Mês"
            value="28"
            icon={<CalendarCheck className="h-4 w-4" />}
            description="Novas matrículas"
            trend={{ value: 15, isPositive: true }}
            module="enrollment"
          />
          <StatsCard
            title="Taxa de Retenção"
            value="92%"
            icon={<TrendingUp className="h-4 w-4" />}
            description="Últimos 3 meses"
            trend={{ value: 3, isPositive: true }}
            module="enrollment"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            {/* Aqui podemos adicionar um gráfico de matrículas */}
          </div>
          <div className="col-span-3">
            {/* Aqui podemos adicionar uma lista de matrículas recentes */}
          </div>
        </div>
      </div>
    </BaseLayout>
  )
} 