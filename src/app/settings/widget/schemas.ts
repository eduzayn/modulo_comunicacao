import { z } from 'zod'
import { WidgetPosition, WidgetTextColor, WidgetTheme } from './types'

export const widgetSettingsSchema = z.object({
  theme: z.enum(['black', 'purple', 'blue', 'green', 'teal', 'yellow', 'orange', 'red', 'pink', 'indigo', 'custom'] as [WidgetTheme, ...WidgetTheme[]]),
  textColor: z.enum(['light', 'dark'] as [WidgetTextColor, ...WidgetTextColor[]]),
  position: z.enum(['right', 'left'] as [WidgetPosition, ...WidgetPosition[]]),
  lateralSpacing: z.number().min(0).max(100),
  bottomSpacing: z.number().min(0).max(100),
  displayName: z.string().min(1, { message: 'O nome de exibição é obrigatório' }),
  offHoursMessage: z.string(),
  teamDescription: z.string(),
  initialMessage: z.string()
})

export const formFieldsSchema = z.object({
  description: z.string(),
  fields: z.array(
    z.object({
      type: z.enum(['text', 'email', 'phone']),
      label: z.string(),
      required: z.boolean().default(false)
    })
  )
})

export type WidgetSettingsFormValues = z.infer<typeof widgetSettingsSchema>
export type FormFieldsValues = z.infer<typeof formFieldsSchema> 