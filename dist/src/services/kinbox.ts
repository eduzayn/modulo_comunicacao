import { env } from '@/env.mjs'
import { api } from '@/lib/api'
import { type ActionResponse } from '@/types/actions'
import { type QuickPhrase } from '@/app/settings/quick-phrases/types'

interface KinboxConfig {
  apiSecret: string
  apiToken: string
  apiTokenV3: string
  baseUrl: string
}

class KinboxService {
  private config: KinboxConfig

  constructor() {
    this.config = {
      apiSecret: env.KINBOX_API_SECRET,
      apiToken: env.KINBOX_API_TOKEN,
      apiTokenV3: env.KINBOX_API_TOKEN_V3,
      baseUrl: 'https://api.kinbox.com.br'
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.config.baseUrl}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiTokenV3}`,
      'X-API-Token': this.config.apiToken,
      'X-API-Secret': this.config.apiSecret
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error making request to Kinbox API:', error)
      throw error
    }
  }

  // Métodos da API
  async getInbox() {
    return this.request('/v3/inbox')
  }

  async getContacts() {
    return this.request('/v3/contacts')
  }

  async getMessages(conversationId: string) {
    return this.request(`/v3/conversations/${conversationId}/messages`)
  }

  async sendMessage(conversationId: string, message: { content: string }) {
    return this.request(`/v3/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(message)
    })
  }

  async getQuickPhrases() {
    return this.request('/v3/quick-phrases')
  }
}

export const kinboxService = new KinboxService()

interface KinboxQuickPhrase {
  id: string
  text: string
  shortcut: string
  visibility: 'all' | 'group' | 'personal'
  assignedTo?: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

export async function importKinboxQuickPhrases(): Promise<ActionResponse<QuickPhrase[]>> {
  try {
    // Busca as frases rápidas usando o KinboxService
    const kinboxPhrases: KinboxQuickPhrase[] = await kinboxService.getQuickPhrases()

    // Converte as frases do Kinbox para o formato do nosso sistema
    const convertedPhrases = kinboxPhrases.map((phrase): Omit<QuickPhrase, 'id'> => ({
      type: 'text',
      phrase: phrase.text,
      shortcut: phrase.shortcut,
      visibility: phrase.visibility,
      assignedTo: phrase.assignedTo || [],
      createdAt: phrase.createdAt,
      updatedAt: phrase.updatedAt,
      createdBy: phrase.createdBy,
    }))

    // Importa as frases convertidas para nosso sistema
    const importPromises = convertedPhrases.map(async (phrase) => {
      const formData = new FormData()
      formData.append('type', phrase.type)
      formData.append('phrase', phrase.phrase || '')
      formData.append('shortcut', phrase.shortcut)
      formData.append('visibility', phrase.visibility)
      formData.append('assignedTo', JSON.stringify(phrase.assignedTo))

      const response = await api.post('/quick-phrases', formData)
      return response.data
    })

    const importedPhrases = await Promise.all(importPromises)

    return {
      success: true,
      data: importedPhrases,
    }
  } catch (error) {
    console.error('Erro ao importar frases rápidas do Kinbox:', error)
    return {
      success: false,
      error: {
        code: 'KINBOX_IMPORT_ERROR',
        message: 'Erro ao importar frases rápidas do Kinbox. Tente novamente.',
      },
    }
  }
} 