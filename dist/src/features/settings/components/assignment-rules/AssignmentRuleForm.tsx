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
import { createAssignmentRule, CreateAssignmentRuleData } from '@/services/settings'

const ruleSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  rule: z.string().min(1, 'Condição é obrigatória'),
  assignTo: z.string().min(1, 'Destinatário é obrigatório'),
  priority: z.coerce.number().int().min(1).max(10).default(5),
})

type AssignmentRuleFormData = z.infer<typeof ruleSchema>

interface AssignmentRuleFormProps {
  onSuccess?: () => void
}

export function AssignmentRuleForm({ onSuccess }: AssignmentRuleFormProps) {
  const queryClient = useQueryClient()

  const form = useForm<AssignmentRuleFormData>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      name: '',
      rule: '',
      assignTo: '',
      priority: 5
    }
  })

  const { mutate: submitRule, isPending } = useMutation({
    mutationFn: (data: AssignmentRuleFormData) => {
      // Converter dados do formulário para o formato esperado pela API
      const apiData: CreateAssignmentRuleData = {
        name: data.name,
        rule: data.rule,
        assignTo: data.assignTo
      }
      return createAssignmentRule(apiData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment-rules'] })
      form.reset()
      onSuccess?.()
    }
  })

  // Lista de usuários e grupos - normalmente viria da API
  const users = [
    { id: 'user-1', name: 'Ana Lucia' },
    { id: 'user-2', name: 'Erick Moreira' },
    { id: 'user-3', name: 'Daniela Tovar' }
  ]
  
  const groups = [
    { id: 'group-1', name: 'Vendas' },
    { id: 'group-2', name: 'Suporte' },
    { id: 'group-3', name: 'Atendimento' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Criar regra de atribuição</h2>
        <p className="text-sm text-muted-foreground">
          Configure regras para atribuição automática de conversas para agentes ou grupos
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(data => submitRule(data))} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da regra *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Atribuir mensagens do WhatsApp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condição *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma condição" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="channel_whatsapp">Canal = WhatsApp</SelectItem>
                    <SelectItem value="channel_email">Canal = E-mail</SelectItem>
                    <SelectItem value="channel_chat">Canal = Chat</SelectItem>
                    <SelectItem value="contains_urgent">Mensagem contém "urgente"</SelectItem>
                    <SelectItem value="customer_priority_high">Cliente = Alta prioridade</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Atribuir para *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o destinatário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        Usuário: {user.name}
                      </SelectItem>
                    ))}
                    {groups.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        Grupo: {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridade *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1}
                    max={10}
                    {...field} 
                    placeholder="Nível de prioridade (1-10)" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            Criar regra
          </Button>
        </form>
      </Form>
    </div>
  )
} 