import { api } from '@/lib/api'
import { type ActionResponse } from '@/types/actions'
import { type QuickPhrase } from '../types'

export async function createQuickPhrase(formData: FormData): Promise<ActionResponse<QuickPhrase>> {
  try {
    const response = await api.post('/quick-phrases', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('Erro ao criar frase rápida:', error)
    return {
      success: false,
      error: {
        code: 'QUICK_PHRASE_CREATE_ERROR',
        message: 'Erro ao criar frase rápida. Tente novamente.',
      },
    }
  }
} 