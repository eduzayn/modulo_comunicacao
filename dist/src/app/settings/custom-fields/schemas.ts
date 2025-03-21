import { z } from 'zod'

export const createCustomFieldSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  type: z.enum(['text', 'multiselect', 'json'], {
    required_error: 'Tipo é obrigatório'
  }),
  entity: z.enum(['contact'], {
    required_error: 'Entidade é obrigatória'
  }),
  reservedKey: z.string().optional(),
  alwaysShow: z.boolean().default(false),
  encrypted: z.boolean().default(false),
  required: z.boolean().default(false),
  validate: z.boolean().default(false),
  linkObligatoriness: z.boolean().default(false),
})

export type CreateCustomFieldFormData = z.infer<typeof createCustomFieldSchema> 