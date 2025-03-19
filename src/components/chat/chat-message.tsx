import { Message } from 'ai'
import { cn } from '@/lib/utils'
import { AudioPlayer } from '../ui/audio-player'
import { VoiceSettings } from '@/app/settings/knowledge-base/types'

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
}

export function ChatMessage({ message, isLoading }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'group relative mb-4 flex items-start md:-ml-12',
        isUser && 'justify-end'
      )}
    >
      <div
        className={cn(
          'flex flex-col space-y-2 overflow-hidden px-4',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        <div className="flex items-center gap-2">
          <div className="rounded-lg px-3 py-2 text-sm bg-muted">
            {message.content}
          </div>
          {!isUser && (
            <AudioPlayer
              text={message.content}
              voiceSettings={defaultVoiceSettings}
            />
          )}
        </div>
      </div>
    </div>
  )
} 