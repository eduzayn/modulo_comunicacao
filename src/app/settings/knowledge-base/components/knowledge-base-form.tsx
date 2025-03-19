'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { createKnowledgeBaseSchema } from '../schemas'
import type { CreateKnowledgeBaseFormData, KnowledgeBase } from '../types'
import { useCreateKnowledgeBase, useUpdateKnowledgeBase } from '../hooks/use-knowledge-base'
import { useRouter } from 'next/navigation'

const contentTypeOptions = [
  { value: 'pdf', label: 'PDF' },
  { value: 'text', label: 'Texto' },
  { value: 'qa', label: 'Perguntas e Respostas' },
  { value: 'flow', label: 'Fluxo de Conversa' },
  { value: 'script', label: 'Script' },
  { value: 'api', label: 'API' },
  { value: 'rules', label: 'Regras' },
]

interface KnowledgeBaseFormProps {
  knowledgeBase?: KnowledgeBase
}

export function KnowledgeBaseForm({ knowledgeBase }: KnowledgeBaseFormProps) {
  const router = useRouter()
  const { mutateAsync: createKnowledgeBaseMutation, isPending: isCreating } =
    useCreateKnowledgeBase()
  const { mutateAsync: updateKnowledgeBaseMutation, isPending: isUpdating } =
    useUpdateKnowledgeBase()

  const form = useForm<CreateKnowledgeBaseFormData>({
    resolver: zodResolver(createKnowledgeBaseSchema),
    defaultValues: knowledgeBase
      ? {
          name: knowledgeBase.name,
          description: knowledgeBase.description,
          type: knowledgeBase.type,
          content: {
            raw: knowledgeBase.content.raw,
          },
          metadata: knowledgeBase.metadata,
          settings: knowledgeBase.settings,
        }
      : {
          name: '',
          description: '',
          type: 'text',
          content: {
            raw: '',
          },
          metadata: {
            source: '',
            version: '1.0.0',
            tags: [],
          },
          settings: {
            priority: 50,
            threshold: 0.7,
            contextWindow: 1000,
          },
        },
  })

  const { watch, setValue } = form
  const tags = watch('metadata.tags')
  const type = watch('type')

  async function handleSubmit(data: CreateKnowledgeBaseFormData) {
    try {
      if (knowledgeBase) {
        await updateKnowledgeBaseMutation({
          id: knowledgeBase.id,
          ...data,
        })
      } else {
        await createKnowledgeBaseMutation(data)
      }

      router.push('/settings/knowledge-base')
    } catch (error) {
      console.error(error)
    }
  }

  function handleAddTag(tag: string) {
    if (!tag) return
    if (tags.includes(tag)) return
    if (tags.length >= 10) return

    setValue('metadata.tags', [...tags, tag])
  }

  function handleRemoveTag(tag: string) {
    setValue(
      'metadata.tags',
      tags.filter((t) => t !== tag)
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome da base de conhecimento" {...field} />
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
                  placeholder="Descrição da base de conhecimento"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  {contentTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === 'text' && (
          <FormField
            control={form.control}
            name="content.raw"
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
        )}

        {type === 'pdf' && (
          <FormField
            control={form.control}
            name="content.file"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Arquivo PDF</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) onChange(file)
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="metadata.source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fonte</FormLabel>
              <FormControl>
                <Input placeholder="Fonte do conteúdo" {...field} />
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
                <Input placeholder="Versão do conteúdo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metadata.tags"
          render={() => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag(e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={(e) => {
                      const input = e.currentTarget
                        .previousElementSibling as HTMLInputElement
                      handleAddTag(input.value)
                      input.value = ''
                    }}
                  >
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="settings.priority"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Prioridade</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[value]}
                    onValueChange={([value]) => onChange(value)}
                  />
                  <span className="w-12 text-right">{value}</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="settings.threshold"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Limiar de Confiança</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    value={[value]}
                    onValueChange={([value]) => onChange(value)}
                  />
                  <span className="w-12 text-right">{value}</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="settings.contextWindow"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Janela de Contexto</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Slider
                    min={100}
                    max={2000}
                    step={100}
                    value={[value]}
                    onValueChange={([value]) => onChange(value)}
                  />
                  <span className="w-12 text-right">{value}</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isCreating || isUpdating}
          >
            {knowledgeBase ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  )
} 