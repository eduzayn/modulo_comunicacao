import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type CreateQuickPhraseFormData } from '../schemas'
import { createQuickPhrase } from '../services/quick-phrases'
import { createSafeActionClient } from 'next-safe-action'
import { ActionResponse } from '@/types/actions'
import { QuickPhrase } from '../types'

// Definimos uma Server Action segura para importar as frases
const importKinboxPhrasesAction = createSafeActionClient().action(
  async (): Promise<ActionResponse<QuickPhrase[]>> => {
    'use server'
    // Importamos o módulo dinamicamente apenas no servidor
    const { importKinboxQuickPhrases } = await import('@/services/kinbox')
    return importKinboxQuickPhrases()
  }
)

export function useCreateQuickPhrase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateQuickPhraseFormData) => {
      const formData = new FormData()

      // Adiciona os campos básicos
      formData.append('type', data.type)
      formData.append('shortcut', data.shortcut)
      formData.append('visibility', data.visibility)

      // Adiciona o texto se for do tipo texto
      if (data.type === 'text' && data.phrase) {
        formData.append('phrase', data.phrase)
      }

      // Adiciona a mensagem de voz se for do tipo voice
      if (data.type === 'voice' && data.voiceMessage) {
        formData.append('voiceMessage', data.voiceMessage)
      }

      // Adiciona os anexos se houver
      if (data.attachments?.length) {
        data.attachments.forEach((file) => {
          formData.append('attachments', file)
        })
      }

      // Adiciona os grupos atribuídos se houver
      if (data.assignedTo?.length) {
        formData.append('assignedTo', JSON.stringify(data.assignedTo))
      }

      return createQuickPhrase(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quickPhrases'] })
    },
  })
}

export function useImportKinboxPhrases() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      return importKinboxPhrasesAction()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quickPhrases'] })
    },
  })
} 