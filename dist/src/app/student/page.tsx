'use client'

import { BaseLayout } from '@/components/layout/BaseLayout'
import { StatsCard } from '@/components/ui/stats-card'
import { BookOpen, GraduationCap, Trophy, Clock } from 'lucide-react'

export default function StudentPage() {
  return (
    <BaseLayout module="student">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Portal do Aluno</h2>
          <p className="text-muted-foreground">
            Bem-vindo ao seu portal de aprendizagem
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Cursos em Andamento"
            value="3"
            icon={<BookOpen className="h-4 w-4" />}
            description="Cursos ativos"
            module="student"
          />
          <StatsCard
            title="Progresso Geral"
            value="75%"
            icon={<GraduationCap className="h-4 w-4" />}
            description="Média de conclusão"
            trend={{ value: 5, isPositive: true }}
            module="student"
          />
          <StatsCard
            title="Certificados"
            value="2"
            icon={<Trophy className="h-4 w-4" />}
            description="Cursos concluídos"
            module="student"
          />
          <StatsCard
            title="Tempo de Estudo"
            value="12h"
            icon={<Clock className="h-4 w-4" />}
            description="Esta semana"
            trend={{ value: 3, isPositive: true }}
            module="student"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            {/* Aqui podemos adicionar um gráfico de progresso */}
          </div>
          <div className="col-span-3">
            {/* Aqui podemos adicionar uma lista de próximas atividades */}
          </div>
        </div>
      </div>
    </BaseLayout>
  )
} 