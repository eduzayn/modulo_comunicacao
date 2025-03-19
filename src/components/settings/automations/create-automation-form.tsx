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
import { createAutomation } from '@/services/settings'

const automationSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  event: z.string().min(1, 'Evento é obrigatório'),
  action: z.string().min(1, 'Ação é obrigatória'),
})

type AutomationFormData = z.infer<typeof automationSchema>

interface CreateAutomationFormProps {
  onSuccess?: () => void
}

export function CreateAutomationForm({ onSuccess }: CreateAutomationFormProps) {
  const queryClient = useQueryClient()

  const form = useForm<AutomationFormData>({
    resolver: zodResolver(automationSchema),
  })

  const { mutate: handleCreateAutomation, isPending } = useMutation({
    mutationFn: createAutomation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] })
      onSuccess?.()
    }
  })

  function onSubmit(data: AutomationFormData) {
    handleCreateAutomation(data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Criar automação</h2>
        <p className="text-sm text-muted-foreground">
          Configure uma nova automação para executar ações quando eventos acontecerem
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da automação *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Mover para grupo ao resolver" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="event"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quando *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um evento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="move_group">Ao mover grupo</SelectItem>
                    <SelectItem value="resolve_conversation">Ao resolver uma conversa</SelectItem>
                    <SelectItem value="pending_time">Tempo pendente</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="action"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Então *</FormLabel>
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
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            Criar automação
          </Button>
        </form>
      </Form>
    </div>
  )
} 