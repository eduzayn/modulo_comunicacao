'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAutomations, toggleAutomation } from '@/services/settings'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CreateAutomationForm } from '@/components/settings/automations/create-automation-form'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'

export default function AutomationsPage() {
  const [isCreateAutomationOpen, setIsCreateAutomationOpen] = useState(false)
  const [search, setSearch] = useState('')

  const { data: automations = [] } = useQuery({
    queryKey: ['automations'],
    queryFn: getAutomations
  })

  const filteredAutomations = automations.filter(automation =>
    automation.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Automações</h1>
          <p className="text-sm text-muted-foreground">
            Execute ações quando determinados eventos acontecerem no Kinbox
          </p>
        </div>

        <Dialog open={isCreateAutomationOpen} onOpenChange={setIsCreateAutomationOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova automação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <CreateAutomationForm onSuccess={() => setIsCreateAutomationOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Pesquisar automações..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Gatilhos</h2>
        </div>

        <div className="divide-y">
          {filteredAutomations.map((automation) => (
            <div key={automation.id} className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">{automation.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {automation.event === 'move_group' && 'Ao mover grupo'}
                  {automation.event === 'resolve_conversation' && 'Ao resolver uma conversa'}
                  {automation.event === 'pending_time' && 'Tempo pendente'}
                </p>
              </div>
              <Switch
                checked={automation.enabled}
                onCheckedChange={(checked) => toggleAutomation(automation.id, checked)}
              />
            </div>
          ))}

          {filteredAutomations.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhuma automação encontrada
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 