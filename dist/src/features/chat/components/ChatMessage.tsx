'use client'

import { formatTime } from '../types/chat.types'
import type { Message } from '../types/chat.types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CheckCheck, Clock } from 'lucide-react'

interface ChatMessageProps {
  message: Message
  isUser?: boolean
}

/**
 * Componente que renderiza uma mensagem de chat
 */
export function ChatMessage({ message, isUser = false }: ChatMessageProps) {
  const isFromUser = isUser || message.sender === 'Você'
  const statusIcon = message.status === 'read' ? (
    <CheckCheck className="h-3 w-3 text-primary ml-1" />
  ) : (
    <Clock className="h-3 w-3 text-muted-foreground ml-1" />
  )

  return (
    <div
      className={`flex items-start gap-2 mb-4 ${
        isFromUser ? 'flex-row-reverse' : ''
      }`}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={isFromUser ? '/avatar.png' : '/bot-avatar.png'} />
        <AvatarFallback>{isFromUser ? 'EU' : 'AI'}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col max-w-[80%]">
        <div
          className={`flex flex-col rounded-lg p-3 ${
            isFromUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {message.type === 'file' && (
            <div className="flex flex-col gap-1 mb-2">
              <div className="flex items-center gap-2">
                <Badge>{message.fileType || 'Document'}</Badge>
                <span className="text-xs">{message.fileSize}</span>
              </div>
              <span className="font-medium">{message.fileName}</span>
            </div>
          )}

          {message.type === 'audio' && (
            <div className="flex items-center gap-2 mb-2">
              <Badge>Audio</Badge>
              <span className="text-xs">{message.duration}</span>
            </div>
          )}

          <div
            className={`whitespace-pre-wrap break-words ${
              message.type === 'file' ? 'text-sm opacity-80' : ''
            }`}
          >
            {message.content}
          </div>
        </div>

        <div
          className={`flex items-center mt-1 text-xs text-muted-foreground ${
            isFromUser ? 'self-end' : ''
          }`}
        >
          {formatTime(message.timestamp)}
          {isFromUser && message.status && statusIcon}
        </div>
      </div>
    </div>
  )
} 