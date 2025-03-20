'use client'

import { useEffect, useRef } from 'react'
import type { Message } from '../types/chat.types'
import { ChatMessage } from './ChatMessage'
import { Loader2 } from 'lucide-react'

interface ChatMessagesProps {
  messages: Message[]
  isLoading?: boolean
}

/**
 * Componente que exibe a lista de mensagens no chat
 */
export function ChatMessages({ messages, isLoading = false }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Efeito para rolar para a última mensagem quando novas mensagens são adicionadas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <ChatMessage 
          key={message.id} 
          message={message} 
          isUser={message.sender === 'Você'} 
        />
      ))}
      
      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  )
} 