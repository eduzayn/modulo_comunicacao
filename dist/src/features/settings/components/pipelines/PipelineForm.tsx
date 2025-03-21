'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPipeline } from '@/features/settings/services/settings-service'
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
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'

const pipelineSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  stages: z.array(
    z.object({
      name: z.string().min(1, 'Nome do estágio é obrigatório'),
      color: z.string().default('#3498db')
    })
  ).min(1, 'Adicione pelo menos um estágio'),
})

type PipelineFormData = z.infer<typeof pipelineSchema>

interface PipelineFormProps {
  onSuccess?: () => void
}

export function PipelineForm({ onSuccess }: PipelineFormProps) {
  const [newStage, setNewStage] = useState('')
  const [stageColor, setStageColor] = useState('#3498db')
  const queryClient = useQueryClient()

  const form = useForm<PipelineFormData>({
    resolver: zodResolver(pipelineSchema),
    defaultValues: {
      name: '',
      description: '',
      stages: [],
    }
  })

  const { mutate: handleCreatePipeline, isPending } = useMutation({
    mutationFn: (data: PipelineFormData) => createPipeline(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipelines'] })
      form.reset()
      onSuccess?.()
    }
  })

  function handleAddStage(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && newStage) {
      e.preventDefault()
      const newStageObj = { name: newStage, color: stageColor }
      form.setValue('stages', [...form.getValues('stages'), newStageObj])
      setNewStage('')
      
      // Alternar para outra cor para o próximo estágio
      const colors = ['#3498db', '#2ecc71', '#f1c40f', '#e67e22', '#e74c3c', '#9b59b6']
      const nextColorIndex = (colors.indexOf(stageColor) + 1) % colors.length
      setStageColor(colors[nextColorIndex])
    }
  }

  function handleClickAddStage() {
    if (newStage) {
      const newStageObj = { name: newStage, color: stageColor }
      form.setValue('stages', [...form.getValues('stages'), newStageObj])
      setNewStage('')
      
      // Alternar para outra cor para o próximo estágio
      const colors = ['#3498db', '#2ecc71', '#f1c40f', '#e67e22', '#e74c3c', '#9b59b6']
      const nextColorIndex = (colors.indexOf(stageColor) + 1) % colors.length
      setStageColor(colors[nextColorIndex])
    }
  }

  function handleRemoveStage(index: number) {
    const stages = form.getValues('stages')
    stages.splice(index, 1)
    form.setValue('stages', [...stages])
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Criar pipeline</h2>
        <p className="text-sm text-muted-foreground">
          Configure um novo pipeline de vendas ou processos
        </p>
      </div>
      
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(data => handleCreatePipeline(data))}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do pipeline" {...field} />
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
                    placeholder="Descrição do pipeline"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stages"
            render={() => (
              <FormItem>
                <FormLabel>Estágios *</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder="Nome do estágio"
                      value={newStage}
                      onChange={e => setNewStage(e.target.value)}
                      onKeyDown={handleAddStage}
                    />
                  </FormControl>
                  <div 
                    className="w-8 h-8 rounded-md cursor-pointer border" 
                    style={{ backgroundColor: stageColor }}
                    onClick={() => {
                      // Aqui poderia abrir um seletor de cores
                      // Simplificação: alternar entre algumas cores predefinidas
                      const colors = ['#3498db', '#2ecc71', '#f1c40f', '#e67e22', '#e74c3c', '#9b59b6']
                      const nextColorIndex = (colors.indexOf(stageColor) + 1) % colors.length
                      setStageColor(colors[nextColorIndex])
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={handleClickAddStage}
                    disabled={!newStage}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.watch('stages').map((stage, index) => (
                    <Badge 
                      key={index} 
                      style={{ backgroundColor: stage.color }}
                      className="text-white"
                    >
                      {stage.name}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1"
                        onClick={() => handleRemoveStage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Criando...' : 'Criar pipeline'}
          </Button>
        </form>
      </Form>
    </div>
  )
} 