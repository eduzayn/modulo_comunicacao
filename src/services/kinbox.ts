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

  constructor(config: KinboxConfig) {
    this.config = config
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

// Evitamos acesso direto às variáveis de ambiente no cliente
// Lazy-load o serviço somente quando necessário (chamada de servidor)
let kinboxServiceInstance: KinboxService | null = null

export const getKinboxService = () => {
  // Este código só deve ser executado no servidor
  if (typeof window !== 'undefined') {
    console.warn('Tentativa de inicializar KinboxService no cliente, retornando stub.')
    // Retorna uma versão simulada para o cliente que lançará erro se usada
    const stub = {
      getQuickPhrases: () => {
        throw new Error('KinboxService não pode ser usado diretamente no cliente')
      },
      getInbox: () => {
        throw new Error('KinboxService não pode ser usado diretamente no cliente')
      },
      getContacts: () => {
        throw new Error('KinboxService não pode ser usado diretamente no cliente')
      },
      getMessages: () => {
        throw new Error('KinboxService não pode ser usado diretamente no cliente')
      },
      sendMessage: () => {
        throw new Error('KinboxService não pode ser usado diretamente no cliente')
      }
    }
    
    return stub as unknown as KinboxService
  }

  if (!kinboxServiceInstance) {
    // Importa env diretamente apenas no lado do servidor
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { env } = require('@/env.mjs')
    
    kinboxServiceInstance = new KinboxService({
      apiSecret: env.KINBOX_API_SECRET,
      apiToken: env.KINBOX_API_TOKEN,
      apiTokenV3: env.KINBOX_API_TOKEN_V3,
      baseUrl: 'https://api.kinbox.com.br'
    })
  }
  
  return kinboxServiceInstance
}

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
    // Esta função só deve ser chamada a partir de uma Server Action ou API route
    if (typeof window !== 'undefined') {
      throw new Error('Esta função só pode ser chamada do servidor via Server Action ou API Route')
    }
    
    // Busca as frases rápidas usando o KinboxService
    const kinboxService = getKinboxService()
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