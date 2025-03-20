'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { PipelineStage } from '@/features/settings/types/settings.types'

const cadenceSchema = z.object({
  stageId: z.string().min(1, 'Selecione um estágio'),
  taskTitle: z.string().min(1, 'Título da tarefa é obrigatório'),
  taskDescription: z.string().optional(),
  delayDays: z.coerce.number().min(0, 'Dias deve ser maior ou igual a 0')
})

type CadenceFormData = z.infer<typeof cadenceSchema>

interface CadenceFormProps {
  pipelineId: string
  stages: PipelineStage[]
  onSuccess?: () => void
}

export function CadenceForm({ pipelineId, stages, onSuccess }: CadenceFormProps) {
  const queryClient = useQueryClient()

  const form = useForm<CadenceFormData>({
    resolver: zodResolver(cadenceSchema),
    defaultValues: {
      stageId: '',
      taskTitle: '',
      taskDescription: '',
      delayDays: 0
    }
  })

  const { mutate: createCadence, isPending } = useMutation({
    mutationFn: (data: CadenceFormData) => {
      // Simulação - substituir por chamada real à API
      console.log('Criando cadência:', { ...data, pipelineId })
      return new Promise<{ id: string }>((resolve) => {
        setTimeout(() => {
          resolve({ id: `cadence-${Date.now()}` })
        }, 1000)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline-cadences', pipelineId] })
      form.reset()
      onSuccess?.()
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Criar cadência</h2>
        <p className="text-sm text-muted-foreground">
          Configure a sequência de tarefas para este pipeline
        </p>
      </div>
      
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(data => createCadence(data))}
        >
          <FormField
            control={form.control}
            name="stageId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estágio *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um estágio" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {stages.map(stage => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
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
            name="taskTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título da tarefa *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Enviar e-mail de boas-vindas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taskDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição da tarefa</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva o que deve ser feito"
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
            name="delayDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dias para executar *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Ex: 2"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Criando...' : 'Criar cadência'}
          </Button>
        </form>
      </Form>
    </div>
  )
} 