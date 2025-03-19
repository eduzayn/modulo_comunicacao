export interface User {
  id: string
  name: string
  avatar?: string
}

export interface Group {
  id: string
  name: string
  color: string
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface VoiceMessage {
  id: string
  url: string
  duration: number
  size: number
}

export type QuickPhraseType = 'text' | 'voice' | 'template'
export type QuickPhraseVisibility = 'all' | 'group' | 'personal'

export interface QuickPhrase {
  id: string
  type: QuickPhraseType
  phrase?: string
  voiceMessage?: string
  shortcut: string
  visibility: QuickPhraseVisibility
  attachments?: string[]
  assignedTo?: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface CreateQuickPhraseData {
  type: QuickPhraseType
  shortcut: string
  phrase?: string
  voiceMessage?: Blob
  attachments?: File[]
  visibility: QuickPhraseVisibility
  assignedTo: string[] // IDs dos usuários ou grupos
} 