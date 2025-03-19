export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  created_at: string
  conversation_id: string
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