import { z } from 'zod'
import { type CreateBusinessHoursFormData } from './types'

const dayScheduleSchema = z.object({
  enabled: z.boolean(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
})

export const createBusinessHoursSchema = z.object({
  name: z
    .string()
    .min(1, 'O nome do horário é obrigatório')
    .max(50, 'O nome do horário deve ter no máximo 50 caracteres'),
  schedule: z.object({
    monday: dayScheduleSchema,
    tuesday: dayScheduleSchema,
    wednesday: dayScheduleSchema,
    thursday: dayScheduleSchema,
    friday: dayScheduleSchema,
    saturday: dayScheduleSchema,
    sunday: dayScheduleSchema,
  }),
}).refine(
  (data) => {
    // Verifica se os horários estão preenchidos quando o dia está habilitado
    const checkDay = (day: { enabled: boolean; openTime?: string; closeTime?: string }) => {
      if (day.enabled) {
        if (!day.openTime || !day.closeTime) {
          return false
        }
      }
      return true
    }

    return (
      checkDay(data.schedule.monday) &&
      checkDay(data.schedule.tuesday) &&
      checkDay(data.schedule.wednesday) &&
      checkDay(data.schedule.thursday) &&
      checkDay(data.schedule.friday) &&
      checkDay(data.schedule.saturday) &&
      checkDay(data.schedule.sunday)
    )
  },
  {
    message: 'Os horários de abertura e fechamento são obrigatórios para os dias habilitados',
  }
) satisfies z.ZodType<CreateBusinessHoursFormData> 