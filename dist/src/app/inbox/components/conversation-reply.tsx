'use client'

import { useState, useRef } from 'react'
import { Send, Paperclip, Smile, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useConversationEvents } from '@/hooks/useConversationEvents'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

// Cliente Supabase para operações no banco de dados
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface ConversationReplyProps {
  conversationId: string
  channelId: string
  disabled?: boolean
}

export function ConversationReply({ conversationId, channelId, disabled = false }: ConversationReplyProps) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const { emitNewMessage } = useConversationEvents()
  
  // Função para enviar mensagem
  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return

    try {
      setIsSending(true)
      
      // Preparar dados da mensagem
      const messageData = {
        conversation_id: conversationId,
        content: message.trim(),
        sender_type: 'agent',
        sender_id: 'current-user-id', // Em produção, obter do contexto de autenticação
        sent_at: new Date().toISOString(),
        status: 'sent',
        channel_id: channelId
      }
      
      // Salvar mensagem no banco de dados
      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select('id')
        .single()
      
      if (error) {
        throw new Error(`Erro ao salvar mensagem: ${error.message}`)
      }
      
      // Emitir evento de nova mensagem
      await emitNewMessage({
        conversationId,
        channelId,
        metadata: {
          messageId: data.id,
          messageContent: message.trim()
        }
      })
      
      // Limpar campo após envio
      setMessage('')
      
      // Atualizar conversa
      await supabase
        .from('conversations')
        .update({
          last_message: message.trim(),
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId)
      
      // Focar novamente no textarea
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
      
    } catch (error) {
      const err = error as Error
      logger.error(`Erro ao enviar mensagem: ${err.message}`, {
        conversationId,
        stack: err.stack
      })
    } finally {
      setIsSending(false)
    }
  }

  // Função para lidar com o pressionamento de Enter (enviar mensagem)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="border-t pt-4">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          className="min-h-[80px] resize-none pr-20"
          disabled={disabled || isSending}
        />
        
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          <Button 
            type="button" 
            size="icon" 
            variant="ghost"
            disabled={disabled || isSending}
          >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Anexar arquivo</span>
          </Button>
          
          <Button 
            type="button" 
            size="icon" 
            variant="ghost"
            disabled={disabled || isSending}
          >
            <Smile className="h-5 w-5" />
            <span className="sr-only">Inserir emoji</span>
          </Button>
          
          <Button 
            type="button" 
            onClick={handleSendMessage}
            size="icon"
            disabled={!message.trim() || disabled || isSending}
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span className="sr-only">Enviar mensagem</span>
          </Button>
        </div>
      </div>
    </div>
  )
} 