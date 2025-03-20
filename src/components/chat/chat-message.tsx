'use client'

import { Message } from 'ai'
import { cn } from '@/lib/utils'
import { AudioPlayer } from '../ui/audio-player'
import { VoiceSettings } from '@/app/settings/knowledge-base/types'
import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const defaultVoiceSettings: VoiceSettings = {
  enabled: true,
  provider: 'elevenlabs',
  voice_id: 'pNInz6obpgDQGcFmaJgB', // ID da voz "Rachel"
  language: 'pt-BR',
  speed: 1.0,
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.5,
  use_speaker_boost: true,
}

interface ChatMessageProps {
  message: Message
  isLoading?: boolean
  assistantName?: string
  assistantAvatar?: {
    url: string
    fallback: string
  }
}

export function ChatMessage({ 
  message, 
  isLoading,
  assistantName = "Assistente",
  assistantAvatar = { url: "", fallback: "AI" }
}: ChatMessageProps) {
  const isUser = message.role === 'user'
  const [isMounted, setIsMounted] = useState(false)
  
  // Evitar problemas de hidratação garantindo que o componente só renderize elementos interativos client-side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div
      className={cn(
        'group relative mb-4 flex items-start',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="mr-2 flex-shrink-0">
          <Avatar className="h-8 w-8 border border-gray-200">
            {assistantAvatar.url ? (
              <AvatarImage src={assistantAvatar.url} alt={assistantName} />
            ) : (
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                {assistantAvatar.fallback}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      )}
      
      <div
        className={cn(
          'flex flex-col space-y-2 overflow-hidden px-4',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        {!isUser && (
          <div className="text-sm font-medium text-gray-500 mb-1">
            {assistantName}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <div className={cn(
            "rounded-lg px-3 py-2 text-sm",
            isUser 
              ? "bg-blue-100 text-gray-800" 
              : "bg-gray-100 text-gray-800"
          )}>
            {message.content}
          </div>
          {!isUser && isMounted && (
            <AudioPlayer
              text={message.content}
              voiceSettings={defaultVoiceSettings}
            />
          )}
        </div>
      </div>
      
      {isUser && (
        <div className="ml-2 flex-shrink-0">
          <Avatar className="h-8 w-8 border border-blue-200">
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
              EU
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  )
} 