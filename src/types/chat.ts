import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface Message {
  id: string
  content: string
  sender: string
  timestamp: Date
  type: 'text' | 'audio' | 'file'
  status?: 'sent' | 'delivered' | 'read'
  duration?: string // para áudios
  fileName?: string // para arquivos
  fileSize?: string // para arquivos
  fileType?: string // para arquivos
  tags?: string[] // para contexto do arquivo
}

export interface Chat {
  id: string
  contactName: string
  contactEmail: string
  contactPhone: string
  contactType: string
  unreadCount: number
  tags: string[]
  status: 'active' | 'archived'
  lastMessage?: Message
  assignedTo?: {
    type: 'agent' | 'group'
    id: string
    name: string
  }
  transferHistory?: {
    timestamp: Date
    from: {
      type: 'agent' | 'group'
      id: string
      name: string
    }
    to: {
      type: 'agent' | 'group'
      id: string
      name: string
    }
    reason?: string
  }[]
}

export interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
  user_id: string
  status: 'active' | 'archived'
  context?: string
  metadata?: {
    topic?: string
    course?: string
    student?: string
    lead?: string
  }
}

export interface ChatState {
  messages: Message[]
  conversation: Conversation | null
  isLoading: boolean
  error: string | null
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatMessagePreview(content: string) {
  return content.length > 40 ? content.slice(0, 40) + '...' : content
}

export function formatTime(date: Date) {
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  return isToday ? format(date, 'HH:mm') : format(date, 'dd/MM/yyyy', { locale: ptBR })
}

export function generateMockChats(): Chat[] {
  return [
    {
      id: '1',
      contactName: 'Maria Silva',
      contactEmail: 'maria@exemplo.com',
      contactPhone: '(11) 98765-4321',
      contactType: 'Aluno',
      unreadCount: 2,
      tags: ['Matrícula', 'Urgente'],
      status: 'active',
      lastMessage: {
        id: '1',
        content: 'Olá! Como posso ajudar?',
        sender: 'Maria Silva',
        timestamp: new Date(),
        type: 'text',
        status: 'read'
      }
    },
    {
      id: '2',
      contactName: 'João Santos',
      contactEmail: 'joao@exemplo.com',
      contactPhone: '(11) 91234-5678',
      contactType: 'Prospect',
      unreadCount: 0,
      tags: ['Informações'],
      status: 'active',
      lastMessage: {
        id: '2',
        content: 'Gostaria de saber mais sobre os cursos',
        sender: 'João Santos',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        type: 'text',
        status: 'read'
      }
    }
  ]
}

export function generateMockMessages(chatId: string): Message[] {
  const baseDate = new Date()
  
  switch(chatId) {
    case '1':
      return [
        {
          id: '1',
          content: 'Olá! Como posso ajudar?',
          sender: 'Maria Silva',
          timestamp: new Date(baseDate.getTime() - 30 * 60000),
          type: 'text',
          status: 'read'
        },
        {
          id: '2',
          content: 'Preciso de informações sobre matrícula',
          sender: 'Você',
          timestamp: new Date(baseDate.getTime() - 25 * 60000),
          type: 'text',
          status: 'read'
        }
      ]
    case '2':
      return [
        {
          id: '1',
          content: 'Gostaria de saber mais sobre os cursos',
          sender: 'João Santos',
          timestamp: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000),
          type: 'text',
          status: 'read'
        }
      ]
    default:
      return []
  }
}

export function simulateResponse(message: string): Message {
  const responses = [
    'Entendi! Vou verificar isso para você.',
    'Como posso te ajudar com isso?',
    'Deixa eu te explicar melhor sobre isso...',
    'Vou encaminhar sua solicitação para o setor responsável.',
    'Claro! Vou te auxiliar com isso agora mesmo.'
  ]

  return {
    id: Math.random().toString(36).substring(7),
    content: responses[Math.floor(Math.random() * responses.length)],
    sender: 'Assistente',
    timestamp: new Date(),
    type: 'text',
    status: 'sent'
  }
}

// Mock de agentes e grupos
export const mockAgents = [
  { id: '1', name: 'Carlos Silva', status: 'online' },
  { id: '2', name: 'Ana Santos', status: 'offline' },
  { id: '3', name: 'Pedro Oliveira', status: 'online' }
]

export const mockGroups = [
  { id: '1', name: 'Suporte Geral', members: ['1', '2'] },
  { id: '2', name: 'Secretaria de Música', members: ['2', '3'] },
  { id: '3', name: 'Financeiro', members: ['1', '3'] }
] 