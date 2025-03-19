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
import { createAssignmentRule } from '@/services/settings'

const ruleSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  rule: z.string().min(1, 'Regra é obrigatória'),
  assignTo: z.string().min(1, 'Atribuir para é obrigatório'),
})

type RuleFormData = z.infer<typeof ruleSchema>

interface CreateRuleFormProps {
  onSuccess?: () => void
}

export function CreateRuleForm({ onSuccess }: CreateRuleFormProps) {
  const queryClient = useQueryClient()

  const form = useForm<RuleFormData>({
    resolver: zodResolver(ruleSchema),
  })

  const { mutate: handleCreateRule, isPending } = useMutation({
    mutationFn: createAssignmentRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment-rules'] })
      onSuccess?.()
    }
  })

  function onSubmit(data: RuleFormData) {
    handleCreateRule(data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Criar regra de atribuição</h2>
        <p className="text-sm text-muted-foreground">
          Configure regras para atribuição automática de conversas para agentes
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <FormLabel>Regra *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma regra" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="chat">Chat</SelectItem>
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
                      <SelectValue placeholder="Selecione um agente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ana">Ana Lucia</SelectItem>
                    <SelectItem value="erick">Erick Moreira</SelectItem>
                    <SelectItem value="daniela">Daniela Tovar</SelectItem>
                  </SelectContent>
                </Select>
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