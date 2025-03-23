'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAssignmentRules, toggleAssignmentRule, deleteAssignmentRule } from '@/services/settings'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AssignmentRuleForm } from '@/features/settings'
import { Switch } from '@/components/ui/switch'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from '@/components/ui/use-toast'

export default function AssignmentRulesPage() {
  const [isCreateRuleOpen, setIsCreateRuleOpen] = useState(false)
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['assignment-rules'],
    queryFn: getAssignmentRules
  })

  const { mutate: toggleRule } = useMutation({
    mutationFn: ({ id, enabled }: { id: string, enabled: boolean }) => 
      toggleAssignmentRule(id, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment-rules'] })
      toast({
        title: "Regra atualizada",
        description: "Status da regra foi alterado com sucesso",
      })
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a regra",
        variant: "destructive",
      })
    }
  })

  const { mutate: deleteRule, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteAssignmentRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment-rules'] })
      toast({
        title: "Regra excluída",
        description: "A regra foi excluída com sucesso",
      })
      setRuleToDelete(null)
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a regra",
        variant: "destructive",
      })
    }
  })

  function handleToggle(id: string, currentValue: boolean) {
    toggleRule({ id, enabled: !currentValue })
  }

  function getRuleDescription(rule: string): string {
    const ruleDescriptions: Record<string, string> = {
      'channel_whatsapp': 'Mensagens do WhatsApp',
      'channel_email': 'Mensagens de Email',
      'channel_chat': 'Mensagens do Chat',
      'contains_urgent': 'Mensagens contendo "urgente"',
      'customer_priority_high': 'Clientes de alta prioridade'
    }
    
    return ruleDescriptions[rule] || 'Condição personalizada'
  }

  function getAssigneeDescription(assignTo: string): string {
    if (assignTo.startsWith('user-')) {
      const users: Record<string, string> = {
        'user-1': 'Ana Lucia',
        'user-2': 'Erick Moreira',
        'user-3': 'Daniela Tovar'
      }
      return `Atendente: ${users[assignTo] || 'Usuário desconhecido'}`
    } else if (assignTo.startsWith('group-')) {
      const groups: Record<string, string> = {
        'group-1': 'Vendas',
        'group-2': 'Suporte',
        'group-3': 'Atendimento'
      }
      return `Grupo: ${groups[assignTo] || 'Grupo desconhecido'}`
    }
    
    return 'Destinatário desconhecido'
  }

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
          <DialogContent className="sm:max-w-[550px]">
            <AssignmentRuleForm onSuccess={() => setIsCreateRuleOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="p-4 border-b bg-muted/40">
          <h2 className="font-semibold">Regras de atribuição</h2>
        </div>

        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-pulse text-sm text-muted-foreground">Carregando regras...</div>
          </div>
        ) : (
          <div className="divide-y">
            {rules.map((rule) => (
              <div key={rule.id} className="p-4 flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium text-base">{rule.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {getRuleDescription(rule.rule)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {getAssigneeDescription(rule.assign_to)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Switch 
                    checked={!!rule.enabled}
                    onCheckedChange={() => handleToggle(rule.id, !!rule.enabled)}
                  />
                  <AlertDialog open={ruleToDelete === rule.id} onOpenChange={(open) => !open && setRuleToDelete(null)}>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon-sm"
                        onClick={() => setRuleToDelete(rule.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir regra</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir esta regra? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteRule(rule.id)}
                          disabled={isDeleting}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}

            {rules.length === 0 && (
              <div className="p-8 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium">Nenhuma regra encontrada</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Crie regras para distribuir automaticamente as conversas entre os atendentes
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 