'use client'

import { BaseLayout } from '@/components/layout/BaseLayout'
import { StatsCard } from '@/components/ui/stats-card'
import { FileText, Video, Image, BarChart2 } from 'lucide-react'

export default function ContentPage() {
  return (
    <BaseLayout module="content">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Módulo de Conteúdo</h2>
          <p className="text-muted-foreground">
            Gerencie seus conteúdos e materiais didáticos
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total de Materiais"
            value="256"
            icon={<FileText className="h-4 w-4" />}
            description="Documentos disponíveis"
            trend={{ value: 15, isPositive: true }}
            module="content"
          />
          <StatsCard
            title="Vídeo Aulas"
            value="48"
            icon={<Video className="h-4 w-4" />}
            description="Vídeos publicados"
            module="content"
          />
          <StatsCard
            title="Recursos Visuais"
            value="124"
            icon={<Image className="h-4 w-4" />}
            description="Imagens e gráficos"
            trend={{ value: 8, isPositive: true }}
            module="content"
          />
          <StatsCard
            title="Taxa de Engajamento"
            value="85%"
            icon={<BarChart2 className="h-4 w-4" />}
            description="Média de visualizações"
            trend={{ value: 5, isPositive: true }}
            module="content"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            {/* Aqui podemos adicionar um gráfico de uso dos materiais */}
          </div>
          <div className="col-span-3">
            {/* Aqui podemos adicionar uma lista de conteúdos recentes */}
          </div>
        </div>
      </div>
    </BaseLayout>
  )
} 