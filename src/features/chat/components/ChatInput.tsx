'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PaperclipIcon, Send } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
  placeholder?: string
}

/**
 * Componente de entrada de mensagens do chat
 */
export function ChatInput({
  onSendMessage,
  isLoading = false,
  placeholder = 'Digite sua mensagem...'
}: ChatInputProps) {
  const [message, setMessage] = useState('')

  // Função para lidar com o envio da mensagem
  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  // Enviar mensagem ao pressionar Enter (sem Shift)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="p-3 border-t bg-background">
      <div className="flex gap-2 items-end">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full h-9 w-9 flex-shrink-0"
          type="button"
          aria-label="Anexar arquivo"
        >
          <PaperclipIcon className="h-5 w-5" />
        </Button>
        
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-10 resize-none"
          disabled={isLoading}
        />
        
        <Button
          size="icon"
          className="rounded-full h-9 w-9 flex-shrink-0"
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
          aria-label="Enviar mensagem"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 