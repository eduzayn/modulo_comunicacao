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
import { createDeal } from '@/services/crm'

const dealSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  value: z.string().min(1, 'Valor é obrigatório'),
  funnel: z.string().min(1, 'Funil de vendas é obrigatório'),
  stage: z.string().min(1, 'Etapa do funil é obrigatório'),
  contactId: z.string()
})

type DealFormData = z.infer<typeof dealSchema>

interface CreateDealFormProps {
  contactId: string
  contactName: string
  onSuccess?: () => void
}

export function CreateDealForm({ contactId, contactName, onSuccess }: CreateDealFormProps) {
  const queryClient = useQueryClient()
  const [isProductSelected, setIsProductSelected] = useState(false)

  const form = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      name: contactName,
      contactId
    }
  })

  const { mutate: handleCreateDeal, isPending } = useMutation({
    mutationFn: createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
      onSuccess?.()
    }
  })

  function onSubmit(data: DealFormData) {
    handleCreateDeal(data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Criar negociação</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da negociação *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-start gap-4">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">R$</span>
                      <Input {...field} className="pl-8" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-8">
              <Button
                type="button"
                variant="outline"
                className="h-9"
                onClick={() => setIsProductSelected(!isProductSelected)}
              >
                {isProductSelected ? '✓ Produto' : 'Produto'}
              </Button>
            </div>
          </div>

          <FormField
            control={form.control}
            name="funnel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Funil de vendas *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um funil" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TUTORIA MÚSICA">TUTORIA MÚSICA</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Etapa do funil *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma etapa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PÓS-VENDAS">PÓS-VENDAS</SelectItem>
                    <SelectItem value="DOCUMENTAÇÃO">DOCUMENTAÇÃO</SelectItem>
                    <SelectItem value="CORREÇÃO TRABALHOS">CORREÇÃO TRABALHOS</SelectItem>
                    <SelectItem value="EMISSÃO DE CERTIFICADOS">EMISSÃO DE CERTIFICADOS</SelectItem>
                    <SelectItem value="EMISSÃO DE DIPLOMA">EMISSÃO DE DIPLOMA</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            Criar
          </Button>
        </form>
      </Form>
    </div>
  )
} 