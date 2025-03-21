'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getWorkflows, toggleWorkflow } from '@/services/settings'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { WorkflowForm } from '@/features/settings'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'

export default function WorkflowsPage() {
  const [isCreateWorkflowOpen, setIsCreateWorkflowOpen] = useState(false)
  const [search, setSearch] = useState('')

  const { data: workflows = [] } = useQuery({
    queryKey: ['workflows'],
    queryFn: getWorkflows
  })

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Cenários</h1>
          <p className="text-sm text-muted-foreground">
            Crie cenários com passos pré-definidos que poderão ser executados com base em um evento ou manualmente por um agente
          </p>
        </div>

        <Dialog open={isCreateWorkflowOpen} onOpenChange={setIsCreateWorkflowOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cenário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <WorkflowForm onSuccess={() => setIsCreateWorkflowOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Pesquisar cenários..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Cenários</h2>
        </div>

        <div className="divide-y">
          {filteredWorkflows.map((workflow) => (
            <div key={workflow.id} className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">{workflow.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {workflow.trigger === 'new_conversation' && 'Nova conversa'}
                  {workflow.trigger === 'resolve_conversation' && 'Resolver conversa'}
                  {workflow.trigger === 'tag_added' && 'Tag adicionada'}
                  {workflow.trigger === 'group_changed' && 'Grupo alterado'}
                </p>
              </div>
              <Switch
                checked={workflow.enabled}
                onCheckedChange={(checked) => toggleWorkflow(workflow.id, checked)}
              />
            </div>
          ))}

          {filteredWorkflows.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhum cenário encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 