import { env } from '@/env.mjs'

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
}

export const kinboxService = new KinboxService() 