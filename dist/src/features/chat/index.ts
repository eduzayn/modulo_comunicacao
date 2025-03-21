// Componentes
export { ChatContainer } from './components/ChatContainer'
export { ChatMessage } from './components/ChatMessage'
export { ChatMessages } from './components/ChatMessages'
export { ChatInput } from './components/ChatInput'

// Hooks
export { useChat } from './hooks/use-chat'

// Serviços
export { sendMessage, createConversation, archiveConversation } from './services/chat-service'

// Tipos
export type { Message, Chat, Conversation, ChatState } from './types/chat.types'
export { formatTime, formatMessagePreview, getInitials, generateMockChats, generateMockMessages } from './types/chat.types' 