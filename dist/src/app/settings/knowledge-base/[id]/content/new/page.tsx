'use client'

import { useKnowledgeBase } from '../../../hooks/use-knowledge-base'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface NewContentPageProps {
  params: {
    id: string
  }
}

const contentSchema = z.object({
  type: z.enum(['pdf', 'text', 'qa', 'flow', 'script', 'api', 'rules']),
  content: z.string().min(10, 'O conteúdo deve ter no mínimo 10 caracteres'),
  metadata: z.object({
    source: z.string().optional(),
    version: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
})

type ContentFormData = z.infer<typeof contentSchema>

export default function NewContentPage({ params }: NewContentPageProps) {
  const router = useRouter()
  const { knowledgeBase, isLoading, addContent } = useKnowledgeBase(params.id)

  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      type: 'text',
      content: '',
      metadata: {
        source: '',
        version: '',
        tags: [],
      },
    },
  })

  async function onSubmit(data: ContentFormData) {
    try {
      await addContent({
        knowledgeBaseId: params.id,
        content: {
          type: data.type,
          content: data.content,
          metadata: data.metadata,
        },
      })
      router.push(`/settings/knowledge-base/${params.id}`)
    } catch (error) {
      console.error('Erro ao adicionar conteúdo:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!knowledgeBase) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Base de conhecimento não encontrada.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Adicionar Conteúdo</h1>
        <p className="text-muted-foreground">
          Adicione novo conteúdo à base de conhecimento.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo Conteúdo</CardTitle>
          <CardDescription>
            Preencha as informações do conteúdo que será adicionado à base de conhecimento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Conteúdo</FormLabel>
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
                        <SelectItem value="text">Texto</SelectItem>
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
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite o conteúdo"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fonte</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Site oficial, documentação, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Versão</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 1.0.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">
                  Adicionar Conteúdo
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 