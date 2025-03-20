'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPipelines, getPipelineCadences, togglePipelineCadence } from '@/services/settings'
import { Button } from '@/components/ui/button'
import { Plus, ArrowLeft } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CadenceForm } from '@/features/settings'
import { Switch } from '@/components/ui/switch'
import Link from 'next/link'

interface CadencePageProps {
  params: {
    id: string
  }
}

export default function CadencePage({ params }: CadencePageProps) {
  const [isCreateCadenceOpen, setIsCreateCadenceOpen] = useState(false)

  const { data: pipeline } = useQuery({
    queryKey: ['pipeline', params.id],
    queryFn: async () => {
      const pipelines = await getPipelines()
      return pipelines.find(p => p.id === params.id)
    }
  })

  const { data: cadences = [] } = useQuery({
    queryKey: ['pipeline-cadences', params.id],
    queryFn: () => getPipelineCadences(params.id)
  })

  if (!pipeline) {
    return null
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/settings/pipelines">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Cadência - {pipeline.name}</h1>
          <p className="text-sm text-muted-foreground">
            Configure tarefas automáticas para cada estágio do funil
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {cadences.length} {cadences.length === 1 ? 'tarefa' : 'tarefas'} configuradas
        </p>

        <Dialog open={isCreateCadenceOpen} onOpenChange={setIsCreateCadenceOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova tarefa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <CadenceForm
              pipelineId={params.id}
              stages={pipeline.stages}
              onSuccess={() => setIsCreateCadenceOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Tarefas automáticas</h2>
        </div>

        <div className="divide-y">
          {cadences.map((cadence) => (
            <div key={cadence.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{cadence.task_title}</h3>
                  <span className="text-sm text-muted-foreground">
                    ({cadence.stage})
                  </span>
                </div>
                <Switch
                  checked={cadence.enabled}
                  onCheckedChange={(checked) =>
                    togglePipelineCadence(cadence.id, checked)
                  }
                />
              </div>
              {cadence.task_description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {cadence.task_description}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Executar após {cadence.delay_days}{' '}
                {cadence.delay_days === 1 ? 'dia' : 'dias'}
              </p>
            </div>
          ))}

          {cadences.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhuma tarefa configurada
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 