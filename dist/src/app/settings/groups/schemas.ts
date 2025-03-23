import { z } from 'zod'

export const createGroupSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  members: z.array(z.string()).min(1, 'Selecione pelo menos um membro'),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido').optional(),
  ddd: z.string().regex(/^\d{2}$/, 'DDD inválido').optional(),
})

export type CreateGroupFormData = z.infer<typeof createGroupSchema> 