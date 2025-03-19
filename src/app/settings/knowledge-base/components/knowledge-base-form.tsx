'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useKnowledgeBase } from '../hooks/use-knowledge-base'
import { KnowledgeBase, knowledgeBaseSchema } from '../types'
import { Loader2 } from 'lucide-react'

interface KnowledgeBaseFormProps {
  id?: string
  onSuccess?: () => void
}

export function KnowledgeBaseForm({ id, onSuccess }: KnowledgeBaseFormProps) {
  const { knowledgeBase, create, update, isCreating, isUpdating } = useKnowledgeBase(id)

  const form = useForm<KnowledgeBase>({
    resolver: zodResolver(knowledgeBaseSchema),
    defaultValues: knowledgeBase || {
      name: '',
      description: '',
      status: 'active',
      type: 'qa',
      settings: {
        language: 'pt-BR',
        maxTokens: 2048,
        temperature: 0.7,
      },
    },
  })

  async function onSubmit(data: KnowledgeBase) {
    try {
      if (id) {
        await update({ id, data })
      } else {
        await create(data)
      }
      onSuccess?.()
    } catch (error) {
      console.error('Erro ao salvar base de conhecimento:', error)
    }
  }

  const isLoading = isCreating || isUpdating

  return (
    <Card>
      <CardHeader>
        <CardTitle>{id ? 'Editar' : 'Nova'} Base de Conhecimento</CardTitle>
        <CardDescription>
          Configure os detalhes da base de conhecimento para treinar a IA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: FAQ Geral" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o propósito desta base de conhecimento"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="qa">Perguntas e Respostas</SelectItem>
                        <SelectItem value="flow">Fluxo de Conversa</SelectItem>
                        <SelectItem value="script">Script de Atendimento</SelectItem>
                        <SelectItem value="api">Documentação de API</SelectItem>
                        <SelectItem value="rules">Regras de Negócio</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="draft">Rascunho</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="settings.language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idioma</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o idioma" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (BR)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="settings.maxTokens"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Máximo de Tokens</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={4096} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="settings.temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperatura</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={2}
                        step={0.1}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {id ? 'Atualizar' : 'Criar'} Base de Conhecimento
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 