'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createGroupSchema, type CreateGroupFormData } from '../schemas'
import { useCreateGroup } from '../hooks/use-groups'
import { toast } from 'sonner'

interface CreateGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const colorOptions = [
  '#E2E8F0', '#F87171', '#FB923C', '#FACC15', 
  '#4ADE80', '#2DD4BF', '#60A5FA', '#C084FC', '#1E293B'
]

export function CreateGroupDialog({ open, onOpenChange }: CreateGroupDialogProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const { mutateAsync: createGroup, isPending } = useCreateGroup()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      color: colorOptions[0],
      members: [],
    },
  })

  const selectedColor = watch('color')

  const onSubmit = async (data: CreateGroupFormData) => {
    try {
      await createGroup(data)
      toast.success('Grupo criado com sucesso!')
      reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao criar grupo:', error)
      toast.error('Erro ao criar grupo. Tente novamente.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar grupo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do grupo</Label>
              <Input
                id="name"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <span className="text-sm text-red-500">{errors.name.message}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...register('description')}
              />
              {errors.description && (
                <span className="text-sm text-red-500">{errors.description.message}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Membros</Label>
              <Input 
                placeholder="Buscar membros..."
                // TODO: Implementar busca de membros
              />
              {errors.members && (
                <span className="text-sm text-red-500">{errors.members.message}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Cor do grupo</Label>
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <button
                    type="button"
                    key={color}
                    className={`h-6 w-6 rounded-full border-2 ${
                      selectedColor === color ? 'border-blue-500' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setValue('color', color)}
                  />
                ))}
              </div>
              {errors.color && (
                <span className="text-sm text-red-500">{errors.color.message}</span>
              )}
            </div>
            <Collapsible
              open={isAdvancedOpen}
              onOpenChange={setIsAdvancedOpen}
              className="space-y-2"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-2">
                <span>Avançado</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isAdvancedOpen ? 'rotate-180' : ''
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      placeholder="00000-000"
                      {...register('cep')}
                      className={errors.cep ? 'border-red-500' : ''}
                    />
                    {errors.cep && (
                      <span className="text-sm text-red-500">{errors.cep.message}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="ddd">DDD</Label>
                    <Input
                      id="ddd"
                      {...register('ddd')}
                      className={errors.ddd ? 'border-red-500' : ''}
                    />
                    {errors.ddd && (
                      <span className="text-sm text-red-500">{errors.ddd.message}</span>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 