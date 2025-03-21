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
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBot, CreateBotInput } from '@/features/settings/services/settings-service'

const botSchema = z.object({
  name: z.string().min(3, 'Nome precisa ter pelo menos 3 caracteres'),
  channel: z.string().min(1, 'Canal é obrigatório'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  groups: z.array(z.string()).optional(),
})

type BotFormData = z.infer<typeof botSchema>

interface BotFormProps {
  onSuccess?: () => void
}

export function BotForm({ onSuccess }: BotFormProps) {
  const queryClient = useQueryClient()

  const form = useForm<BotFormData>({
    resolver: zodResolver(botSchema),
    defaultValues: {
      name: '',
      channel: '',
      model: '',
      email: '',
      groups: [],
    },
  })

  const { mutate: handleCreateBot, isPending } = useMutation({
    mutationFn: (data: CreateBotInput) => createBot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] })
      onSuccess?.()
    }
  })

  const channelValue = form.watch('channel')

  // Grupos disponíveis - normalmente viriam de uma API
  const availableGroups = [
    { id: 'support', label: 'Suporte' },
    { id: 'sales', label: 'Vendas' },
    { id: 'finance', label: 'Financeiro' },
  ]

  function onSubmit(data: BotFormData) {
    handleCreateBot(data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Criar bot</h2>
        <p className="text-sm text-muted-foreground">
          Configure um novo bot para automatizar atendimentos
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do bot *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Assistente de Vendas" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="channel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Canal *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um canal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="widget">Widget do site</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo de IA *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um modelo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                    <SelectItem value="palm">Palm</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {channelValue === 'email' && (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail do bot</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="bot@seudominio.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="groups"
            render={() => (
              <FormItem>
                <div className="mb-2">
                  <FormLabel>Grupos</FormLabel>
                  <FormDescription>
                    Selecione os grupos para os quais o bot pode ser atribuído
                  </FormDescription>
                </div>
                {availableGroups.map((group) => (
                  <FormField
                    key={group.id}
                    control={form.control}
                    name="groups"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={group.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(group.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value || [], group.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== group.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {group.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            Criar bot
          </Button>
        </form>
      </Form>
    </div>
  )
} 