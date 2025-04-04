'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash } from 'lucide-react'

const workflowSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  trigger: z.string().min(1, 'Gatilho é obrigatório'),
  steps: z.array(z.object({
    type: z.string().min(1, 'Tipo de ação é obrigatório'),
    config: z.object({
      value: z.string().min(1, 'Valor é obrigatório'),
      delay: z.coerce.number().min(0).optional()
    })
  })).min(1, 'Adicione pelo menos uma ação')
})

type WorkflowFormData = z.infer<typeof workflowSchema>

interface WorkflowFormProps {
  onSuccess?: () => void
}

export function WorkflowForm({ onSuccess }: WorkflowFormProps) {
  const queryClient = useQueryClient()

  const form = useForm<WorkflowFormData>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: '',
      trigger: '',
      steps: [{ 
        type: '', 
        config: { 
          value: '',
          delay: 0
        } 
      }]
    }
  })

  const { mutate: createWorkflow, isPending } = useMutation({
    mutationFn: (data: WorkflowFormData) => {
      // Simulação - substituir por chamada real à API
      console.log('Criando workflow:', data)
      return new Promise<{ id: string }>((resolve) => {
        setTimeout(() => {
          resolve({ id: `workflow-${Date.now()}` })
        }, 1000)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] })
      form.reset()
      onSuccess?.()
    }
  })

  function addStep() {
    const currentSteps = form.getValues('steps')
    form.setValue('steps', [...currentSteps, { 
      type: '', 
      config: { 
        value: '',
        delay: 0
      } 
    }])
  }

  function removeStep(index: number) {
    const currentSteps = form.getValues('steps')
    if (currentSteps.length > 1) {
      form.setValue('steps', currentSteps.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Criar workflow</h2>
        <p className="text-sm text-muted-foreground">
          Configure um workflow com ações automáticas
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(data => createWorkflow(data))} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do workflow *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Distribuição para Consultoras" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trigger"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gatilho *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um gatilho" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="new_conversation">Nova conversa</SelectItem>
                    <SelectItem value="resolve_conversation">Resolver conversa</SelectItem>
                    <SelectItem value="reopen_conversation">Reabrir conversa</SelectItem>
                    <SelectItem value="tag_added">Tag adicionada</SelectItem>
                    <SelectItem value="group_changed">Grupo alterado</SelectItem>
                    <SelectItem value="no_reply_24h">Sem resposta por 24h</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Ações</h3>
              <Button type="button" variant="outline" size="sm" onClick={addStep}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar ação
              </Button>
            </div>

            {form.watch('steps').map((step, index) => (
              <div key={index} className="flex items-start gap-2 p-4 border rounded-md">
                <div className="flex-1 space-y-4">
                  <FormField
                    control={form.control}
                    name={`steps.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de ação *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma ação" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="add_tag">Adicionar tag</SelectItem>
                            <SelectItem value="remove_tag">Remover tag</SelectItem>
                            <SelectItem value="move_group">Mover para grupo</SelectItem>
                            <SelectItem value="assign_agent">Atribuir para agente</SelectItem>
                            <SelectItem value="send_message">Enviar mensagem</SelectItem>
                            <SelectItem value="start_automation">Iniciar automação</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`steps.${index}.config.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: nome da tag, grupo ou agente" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`steps.${index}.config.delay`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Atraso (minutos)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0} 
                            {...field} 
                            placeholder="Aguardar antes de executar" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStep(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            Criar workflow
          </Button>
        </form>
      </Form>
    </div>
  )
} 