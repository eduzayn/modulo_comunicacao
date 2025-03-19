import { z } from 'zod'

export const createQuickPhraseSchema = z.object({
  type: z.enum(['text', 'voice', 'template'], {
    required_error: 'Tipo é obrigatório'
  }),
  shortcut: z.string().min(1, 'Atalho é obrigatório'),
  phrase: z.string().min(1, 'Frase é obrigatória').optional(),
  voiceMessage: z.instanceof(Blob).optional(),
  attachments: z.array(z.instanceof(File)).optional(),
  visibility: z.enum(['all', 'group', 'personal'], {
    required_error: 'Visibilidade é obrigatória'
  }),
  assignedTo: z.array(z.string()).min(1, 'Selecione pelo menos um usuário ou grupo')
}).refine(
  (data) => {
    if (data.type === 'text' && !data.phrase) {
      return false
    }
    if (data.type === 'voice' && !data.voiceMessage) {
      return false
    }
    return true
  },
  {
    message: 'Você precisa fornecer uma frase para mensagens de texto ou um áudio para mensagens de voz',
    path: ['phrase']
  }
)

export type CreateQuickPhraseFormData = z.infer<typeof createQuickPhraseSchema> 