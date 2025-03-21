'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPipelines, togglePipeline } from '@/services/settings'
import { Button } from '@/components/ui/button'
import { Plus, Settings2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PipelineForm } from '@/features/settings'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function PipelinesPage() {
  const [isCreatePipelineOpen, setIsCreatePipelineOpen] = useState(false)
  const [search, setSearch] = useState('')

  const { data: pipelines = [] } = useQuery({
    queryKey: ['pipelines'],
    queryFn: getPipelines
  })

  const filteredPipelines = pipelines.filter(pipeline =>
    pipeline.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Funis ({pipelines.length})</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os funis de vendas e seus estágios
          </p>
        </div>

        <Dialog open={isCreatePipelineOpen} onOpenChange={setIsCreatePipelineOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo funil
            </Button>
          </DialogTrigger>
          <DialogContent>
            <PipelineForm onSuccess={() => setIsCreatePipelineOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Pesquisar funis..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Funis</h2>
        </div>

        <div className="divide-y">
          {filteredPipelines.map((pipeline) => (
            <div key={pipeline.id} className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <h3 className="font-medium">{pipeline.name}</h3>
                    <Link href={`/settings/pipelines/${pipeline.id}/cadence`}>
                      <Button variant="ghost" size="icon" title="Configurar cadência">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <Switch
                    checked={pipeline.enabled}
                    onCheckedChange={(checked) => togglePipeline(pipeline.id, checked)}
                  />
                </div>
                {pipeline.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {pipeline.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {pipeline.stages.map(stage => (
                    <Badge 
                      key={typeof stage === 'string' ? stage : stage.id}
                      variant="secondary" 
                      style={typeof stage !== 'string' && stage.color ? { backgroundColor: stage.color, color: 'white' } : {}}
                    >
                      {typeof stage === 'string' ? stage : stage.name}
                    </Badge>
                  ))}
                </div>
                {pipeline.groups && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Grupos: {pipeline.groups.join(', ')}
                  </p>
                )}
              </div>
            </div>
          ))}

          {filteredPipelines.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhum funil encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 