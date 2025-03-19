import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  status: 'sent' | 'delivered' | 'read'
  type: 'text' | 'audio' | 'file'
  duration?: string // para áudios
  fileName?: string // para arquivos
}

export interface Chat {
  id: string
  contactName: string
  contactEmail: string
  contactPhone: string
  contactType: string
  lastMessage?: Message
  unreadCount: number
  tags: string[]
  status: 'active' | 'archived'
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
        role: 'assistant',
        content: 'Olá! Como posso ajudar?',
        timestamp: new Date(),
        status: 'read',
        type: 'text'
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
        role: 'user',
        content: 'Gostaria de saber mais sobre os cursos',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
        status: 'read',
        type: 'text'
      }
    },
    {
      id: '3',
      contactName: 'Ana Oliveira',
      contactEmail: 'ana@exemplo.com',
      contactPhone: '(11) 94567-8901',
      contactType: 'Aluno',
      unreadCount: 1,
      tags: ['Financeiro', 'Urgente'],
      status: 'active',
      lastMessage: {
        id: '3',
        role: 'user',
        content: 'Preciso de ajuda com o pagamento',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        status: 'delivered',
        type: 'text'
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
          role: 'assistant',
          content: 'Olá! Como posso ajudar?',
          timestamp: new Date(baseDate.getTime() - 30 * 60000),
          status: 'read',
          type: 'text'
        },
        {
          id: '2',
          role: 'user',
          content: 'Preciso de informações sobre matrícula',
          timestamp: new Date(baseDate.getTime() - 25 * 60000),
          status: 'read',
          type: 'text'
        },
        {
          id: '3',
          role: 'assistant',
          content: 'Claro! Vou te explicar o processo de matrícula. Primeiro, você precisa...',
          timestamp: new Date(baseDate.getTime() - 20 * 60000),
          status: 'read',
          type: 'text'
        }
      ]
    case '2':
      return [
        {
          id: '1',
          role: 'user',
          content: 'Gostaria de saber mais sobre os cursos',
          timestamp: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000),
          status: 'read',
          type: 'text'
        },
        {
          id: '2',
          role: 'assistant',
          content: 'Temos vários cursos disponíveis. Qual área te interessa?',
          timestamp: new Date(baseDate.getTime() - 23 * 60 * 60 * 1000),
          status: 'read',
          type: 'text'
        }
      ]
    case '3':
      return [
        {
          id: '1',
          role: 'user',
          content: 'Preciso de ajuda com o pagamento',
          timestamp: new Date(baseDate.getTime() - 2 * 60 * 60 * 1000),
          status: 'delivered',
          type: 'text'
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
    role: 'assistant',
    content: responses[Math.floor(Math.random() * responses.length)],
    timestamp: new Date(),
    status: 'sent',
    type: 'text'
  }
} 