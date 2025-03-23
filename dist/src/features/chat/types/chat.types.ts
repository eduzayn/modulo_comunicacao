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

// Utilitários relacionados a chat
export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export function formatMessagePreview(message: Message): string {
  if (message.type === 'audio') return 'Áudio'
  if (message.type === 'file') return message.fileName || 'Arquivo'
  return message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '')
}

export function formatTime(date: Date) {
  return format(date, 'HH:mm', { locale: ptBR })
}

// Funções mock que serão removidas em produção
export function generateMockChats(): Chat[] {
  return [
    {
      id: '1',
      contactName: 'João Silva',
      contactEmail: 'joao@exemplo.com',
      contactPhone: '(11) 98765-4321',
      contactType: 'Aluno',
      unreadCount: 3,
      tags: ['importante', 'financeiro'],
      status: 'active',
    },
    {
      id: '2',
      contactName: 'Maria Oliveira',
      contactEmail: 'maria@exemplo.com',
      contactPhone: '(11) 91234-5678',
      contactType: 'Prospect',
      unreadCount: 0,
      tags: ['novo', 'comercial'],
      status: 'active',
    },
    {
      id: '3',
      contactName: 'Carlos Santos',
      contactEmail: 'carlos@exemplo.com',
      contactPhone: '(11) 99876-5432',
      contactType: 'Professor',
      unreadCount: 1,
      tags: ['administrativo'],
      status: 'active',
    },
    // Adicione mais contatos fictícios conforme necessário
  ]
}

export function generateMockMessages(chatId: string): Message[] {
  const baseDate = new Date()
  const messages: Message[] = []

  // Data para a primeira mensagem (2 horas atrás)
  const firstMessageDate = new Date(baseDate)
  firstMessageDate.setHours(baseDate.getHours() - 2)

  messages.push({
    id: '1',
    content: 'Olá, tudo bem? Preciso de informações sobre o curso de desenvolvimento web.',
    sender: 'João Silva',
    timestamp: firstMessageDate,
    type: 'text',
    status: 'read'
  })

  // 1 hora e 55 minutos atrás
  const secondMessageDate = new Date(baseDate)
  secondMessageDate.setHours(baseDate.getHours() - 1)
  secondMessageDate.setMinutes(baseDate.getMinutes() - 55)

  messages.push({
    id: '2',
    content: 'Olá João! Claro, como posso ajudar? Temos várias opções de cursos de desenvolvimento web.',
    sender: 'Você',
    timestamp: secondMessageDate,
    type: 'text',
    status: 'read'
  })

  // 1 hora e 50 minutos atrás
  const thirdMessageDate = new Date(baseDate)
  thirdMessageDate.setHours(baseDate.getHours() - 1)
  thirdMessageDate.setMinutes(baseDate.getMinutes() - 50)

  messages.push({
    id: '3',
    content: 'Gostaria de saber o valor e a carga horária do curso completo.',
    sender: 'João Silva',
    timestamp: thirdMessageDate,
    type: 'text',
    status: 'read'
  })

  return messages
}

export function simulateResponse(message: string): Message {
  return {
    id: String(Date.now()),
    content: `Obrigado pela sua mensagem: "${message.substring(0, 30)}${
      message.length > 30 ? '...' : ''
    }". Um de nossos atendentes responderá em breve.`,
    sender: 'Sistema',
    timestamp: new Date(),
    type: 'text',
    status: 'sent'
  }
} 