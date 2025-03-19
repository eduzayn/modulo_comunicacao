'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createCustomFieldSchema, type CreateCustomFieldFormData } from '../schemas'
import { useCreateCustomField } from '../hooks/use-custom-fields'
import { toast } from 'sonner'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CustomFieldForm() {
  const router = useRouter()
  const { mutateAsync: createField, isPending } = useCreateCustomField()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateCustomFieldFormData>({
    resolver: zodResolver(createCustomFieldSchema),
    defaultValues: {
      type: 'text',
      entity: 'contact',
      alwaysShow: false,
      encrypted: false,
      required: false,
      validate: false,
      linkObligatoriness: false,
    },
  })

  const onSubmit = async (data: CreateCustomFieldFormData) => {
    try {
      await createField(data)
      toast.success('Campo personalizado criado com sucesso!')
      router.push('/settings/custom-fields')
    } catch (error) {
      console.error('Erro ao criar campo personalizado:', error)
      toast.error('Erro ao criar campo personalizado. Tente novamente.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.push('/settings/custom-fields')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">Criar campo personalizado</h1>
      </div>

      <div className="space-y-4 max-w-2xl">
        <div className="grid gap-2">
          <Label htmlFor="name">Nome do campo</Label>
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
          <Label htmlFor="type">Tipo de campo</Label>
          <Select
            value={watch('type')}
            onValueChange={(value) => setValue('type', value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Texto</SelectItem>
              <SelectItem value="multiselect">Multiseleção</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <span className="text-sm text-red-500">{errors.type.message}</span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="entity">Entidade</Label>
          <Select
            value={watch('entity')}
            onValueChange={(value) => setValue('entity', value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contact">Contato</SelectItem>
            </SelectContent>
          </Select>
          {errors.entity && (
            <span className="text-sm text-red-500">{errors.entity.message}</span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="reservedKey">Chave reservada</Label>
          <Input
            id="reservedKey"
            {...register('reservedKey')}
          />
          <span className="text-sm text-muted-foreground">
            Chave identificador que identifica esse campo no chat para ser substituído pelo valor do campo.
          </span>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sempre mostrar</Label>
              <p className="text-sm text-muted-foreground">
                Exibir esse campo em todos os contatos
              </p>
            </div>
            <Switch
              checked={watch('alwaysShow')}
              onCheckedChange={(checked) => setValue('alwaysShow', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Encriptar</Label>
              <p className="text-sm text-muted-foreground">
                Criptografar o valor deste campo
              </p>
            </div>
            <Switch
              checked={watch('encrypted')}
              onCheckedChange={(checked) => setValue('encrypted', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Obrigatório</Label>
              <p className="text-sm text-muted-foreground">
                Tornar esse campo obrigatório
              </p>
            </div>
            <Switch
              checked={watch('required')}
              onCheckedChange={(checked) => setValue('required', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Validar</Label>
              <p className="text-sm text-muted-foreground">
                Validar o valor deste campo
              </p>
            </div>
            <Switch
              checked={watch('validate')}
              onCheckedChange={(checked) => setValue('validate', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Vincular obrigatoriedade</Label>
              <p className="text-sm text-muted-foreground">
                Vincular a obrigatoriedade deste campo a outros campos
              </p>
            </div>
            <Switch
              checked={watch('linkObligatoriness')}
              onCheckedChange={(checked) => setValue('linkObligatoriness', checked)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/settings/custom-fields')}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
} 