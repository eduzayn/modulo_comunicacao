'use client'

import { useEffect } from 'react'
import { useChat } from '../hooks/use-chat'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ChatContainerProps {
  userId: string
  metadata?: Record<string, unknown>
}

/**
 * Componente principal que integra todos os componentes do chat
 */
export function ChatContainer({ userId, metadata }: ChatContainerProps) {
  const {
    messages,
    conversation,
    isLoading,
    error,
    startConversation,
    sendMessage,
    endConversation
  } = useChat()

  // Iniciar conversa quando o componente for montado
  useEffect(() => {
    if (!conversation) {
      startConversation(userId, metadata)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Manipular o envio de uma nova mensagem
  const handleSendMessage = (content: string) => {
    sendMessage(content)
  }

  // Se ainda estiver iniciando a conversa
  if (!conversation && isLoading) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    )
  }

  // Se ocorreu um erro ao iniciar a conversa
  if (error && !conversation) {
    return (
      <Card className="w-full h-full">
        <CardContent className="p-6 text-center text-destructive">
          <p>Erro ao iniciar a conversa. Por favor, tente novamente.</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-lg font-medium">
          {conversation?.title || 'Nova conversa'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
        <ChatMessages 
          messages={messages} 
          isLoading={isLoading} 
        />
        
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          placeholder="Digite sua mensagem..." 
        />
      </CardContent>
    </Card>
  )
} 