'use client'

import { BaseLayout } from '@/components/layout/BaseLayout'
import { StatsCard } from '@/components/ui/stats-card'
import { MessageSquare, Users, Clock, BarChart2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { ThumbsUp } from 'lucide-react'

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
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-communication-500/10">
                <MessageSquare className="h-6 w-6 text-communication-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Mensagens
                </p>
                <h2 className="text-2xl font-bold">1955</h2>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-communication-500/10">
                <Users className="h-6 w-6 text-communication-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Chats Ativos
                </p>
                <h2 className="text-2xl font-bold">1460</h2>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-communication-500/10">
                <Clock className="h-6 w-6 text-communication-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tempo Médio de Resposta
                </p>
                <h2 className="text-2xl font-bold">2m 30s</h2>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-communication-500/10">
                <ThumbsUp className="h-6 w-6 text-communication-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taxa de Satisfação
                </p>
                <h2 className="text-2xl font-bold">95%</h2>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Atividade</h3>
                <select className="text-sm bg-transparent border rounded-md px-2 py-1">
                  <option value="7">Últimos 7 dias</option>
                  <option value="30">Últimos 30 dias</option>
                  <option value="90">Últimos 90 dias</option>
                </select>
              </div>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Gráfico de atividade será implementado aqui
              </div>
            </Card>
          </div>
          <div className="col-span-3">
            {/* Aqui podemos adicionar uma lista de atividades recentes */}
          </div>
        </div>
      </div>
    </BaseLayout>
  )
} 