import { z } from 'zod'
import { type CreateTagFormData } from './types'

export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, 'O nome da tag é obrigatório')
    .max(50, 'O nome da tag deve ter no máximo 50 caracteres'),
  color: z
    .string()
    .min(1, 'A cor da tag é obrigatória'),
  visibility: z.enum(['all', 'group', 'personal'], {
    required_error: 'A visibilidade da tag é obrigatória',
  }),
  assignedTo: z
    .array(z.string())
    .optional()
    .default([]),
}) satisfies z.ZodType<CreateTagFormData> 