'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createBusinessHoursSchema, type CreateBusinessHoursFormData } from '../schemas'
import { useCreateBusinessHours } from '../hooks/use-business-hours'
import { toast } from 'sonner'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const weekDays = [
  { key: 'monday', label: 'Segunda' },
  { key: 'tuesday', label: 'Terça' },
  { key: 'wednesday', label: 'Quarta' },
  { key: 'thursday', label: 'Quinta' },
  { key: 'friday', label: 'Sexta' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
] as const

export function BusinessHoursForm() {
  const router = useRouter()
  const { mutateAsync: createBusinessHours, isPending } = useCreateBusinessHours()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateBusinessHoursFormData>({
    resolver: zodResolver(createBusinessHoursSchema),
    defaultValues: {
      schedule: {
        monday: { enabled: false },
        tuesday: { enabled: false },
        wednesday: { enabled: false },
        thursday: { enabled: false },
        friday: { enabled: false },
        saturday: { enabled: false },
        sunday: { enabled: false },
      },
    },
  })

  const onSubmit = async (data: CreateBusinessHoursFormData) => {
    try {
      await createBusinessHours(data)
      toast.success('Horário criado com sucesso!')
      router.push('/settings/business-hours')
    } catch (error) {
      console.error('Erro ao criar horário:', error)
      toast.error('Erro ao criar horário. Tente novamente.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.push('/settings/business-hours')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">Criar horário</h1>
      </div>

      <div className="space-y-4 max-w-2xl">
        <div className="grid gap-2">
          <Label htmlFor="name">Nome do horário</Label>
          <Input
            id="name"
            {...register('name')}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div className="space-y-6">
          <Label>Horários</Label>

          {weekDays.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-4">
              <Switch
                checked={watch(`schedule.${key}.enabled`)}
                onCheckedChange={(checked) => {
                  setValue(`schedule.${key}.enabled`, checked)
                }}
              />
              <div className="flex-1">
                <Label>{label}</Label>
              </div>

              {watch(`schedule.${key}.enabled`) && (
                <div className="flex items-center gap-2">
                  <div>
                    <Input
                      type="time"
                      {...register(`schedule.${key}.openTime`)}
                      className={
                        errors.schedule?.[key]?.openTime ? 'border-red-500' : ''
                      }
                    />
                  </div>
                  <span>até</span>
                  <div>
                    <Input
                      type="time"
                      {...register(`schedule.${key}.closeTime`)}
                      className={
                        errors.schedule?.[key]?.closeTime ? 'border-red-500' : ''
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {errors.schedule && (
            <span className="text-sm text-red-500">
              {errors.schedule.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/settings/business-hours')}
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