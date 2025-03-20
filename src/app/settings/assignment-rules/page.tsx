'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAssignmentRules } from '@/services/settings'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AssignmentRuleForm } from '@/features/settings'
import { Switch } from '@/components/ui/switch'

export default function AssignmentRulesPage() {
  const [isCreateRuleOpen, setIsCreateRuleOpen] = useState(false)

  const { data: rules = [] } = useQuery({
    queryKey: ['assignment-rules'],
    queryFn: getAssignmentRules
  })

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Atribuição Automática</h1>
          <p className="text-sm text-muted-foreground">
            Configure regras para atribuição automática de conversas para agentes
          </p>
        </div>

        <Dialog open={isCreateRuleOpen} onOpenChange={setIsCreateRuleOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Regra
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AssignmentRuleForm onSuccess={() => setIsCreateRuleOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Regras predefinidas</h2>
        </div>

        <div className="divide-y">
          {rules.map((rule) => (
            <div key={rule.id} className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">{rule.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Atribuir ciclicamente entre agentes de...
                </p>
              </div>
              <Switch />
            </div>
          ))}

          {rules.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhuma regra encontrada
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 