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
import { useState, useEffect } from 'react'

// Lista de categorias de cursos
const courseCategories = [
  'Segunda Licenciatura',
  'Formação Pedagógica',
  'EJA',
  'Bacharelado 2°',
  'Primeira Graduação',
  'Pós-Graduação',
  'MBA',
  'Formação Livre',
  'Capacitação'
] as const

const courseSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  category: z.enum(courseCategories, {
    required_error: 'Selecione uma categoria'
  }),
  fullPrice: z.coerce.number().min(0, 'Preço deve ser maior ou igual a 0'),
  discountType: z.enum(['percentage', 'fixed'], {
    required_error: 'Selecione o tipo de desconto'
  }),
  discountValue: z.coerce.number().min(0, 'Desconto deve ser maior ou igual a 0'),
  entryFee: z.coerce.number().min(0, 'Valor da entrada deve ser maior ou igual a 0')
})

type CourseFormData = z.infer<typeof courseSchema>

interface CourseFormProps {
  onSuccess?: () => void
}

export function CourseForm({ onSuccess }: CourseFormProps) {
  const [finalPrice, setFinalPrice] = useState(0)
  const queryClient = useQueryClient()

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Segunda Licenciatura',
      fullPrice: 0,
      discountType: 'percentage',
      discountValue: 0,
      entryFee: 0
    }
  })

  const { mutate: createCourse, isPending } = useMutation({
    mutationFn: (data: CourseFormData) => {
      // Simular a criação do curso
      return new Promise<{ id: string }>((resolve) => {
        setTimeout(() => {
          resolve({ id: `course-${Date.now()}` })
        }, 1000)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      form.reset()
      onSuccess?.()
    }
  })

  // Calcula o preço final baseado no tipo de desconto
  useEffect(() => {
    const fullPrice = form.watch('fullPrice')
    const discountType = form.watch('discountType')
    const discountValue = form.watch('discountValue')

    if (discountType === 'percentage') {
      const discount = (fullPrice * discountValue) / 100
      setFinalPrice(fullPrice - discount)
    } else {
      setFinalPrice(fullPrice - discountValue)
    }
  }, [form.watch('fullPrice'), form.watch('discountType'), form.watch('discountValue')])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Criar novo curso</h2>
        <p className="text-sm text-muted-foreground">
          Adicione um novo curso ao catálogo
        </p>
      </div>
      
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(data => createCourse(data))}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do curso" {...field} />
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
                    placeholder="Descrição do curso"
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
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
            name="fullPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="Ex: 1999.90"
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
              name="discountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de desconto *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Percentual (%)</SelectItem>
                      <SelectItem value="fixed">Valor fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor do desconto *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder={form.watch('discountType') === 'percentage' ? 'Ex: 10' : 'Ex: 199.90'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="entryFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da entrada</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="Ex: 199.90"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-sm text-muted-foreground">
            Preço final: R$ {finalPrice.toFixed(2)}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Criando...' : 'Criar curso'}
          </Button>
        </form>
      </Form>
    </div>
  )
} 