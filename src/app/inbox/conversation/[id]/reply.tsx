'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useEmitEvent } from '@/hooks/useEmitEvent'
import { Send, Loader2 } from 'lucide-react'
import { EventType } from '@/lib/events'

interface ConversationReplyProps {
  conversationId: string
}

export function ConversationReply({ conversationId }: ConversationReplyProps) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const { emitEvent, isLoading } = useEmitEvent()
  
  /**
   * Enviar uma nova mensagem para a conversa
   */
  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('A mensagem não pode estar vazia')
      return
    }
    
    try {
      // Emitir evento de nova mensagem
      const result = await emitEvent('message.created' as EventType, {
        conversation_id: conversationId,
        content: message.trim(),
        type: 'text',
        sender_type: 'agent',
        metadata: {
          // Informações adicionais podem ser enviadas aqui
          source: 'web_interface'
        }
      })
      
      if (result.success) {
        toast.success('Mensagem enviada com sucesso!')
        setMessage('') // Limpar campo após envio
        router.refresh() // Atualizar a lista de mensagens
      } else {
        toast.error(`Erro ao enviar mensagem: ${result.error}`)
      }
    } catch (error) {
      toast.error(`Erro ao enviar mensagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }
  
  /**
   * Enviar mensagem ao pressionar Enter (sem Shift)
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Sua resposta
        </label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem aqui..."
          rows={4}
          className="resize-y min-h-[100px]"
          disabled={isLoading}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Pressione <kbd className="px-1 py-0.5 rounded border">Enter</kbd> para enviar, 
          <kbd className="px-1 py-0.5 rounded border ml-1">Shift+Enter</kbd> para nova linha
        </div>
        
        <Button 
          onClick={handleSendMessage}
          disabled={isLoading || !message.trim()} 
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Enviar
        </Button>
      </div>
      
      <div className="flex gap-2 mt-4">
        <QuickReplyButton 
          label="Olá, como posso ajudar?" 
          onClick={() => setMessage('Olá, como posso ajudar?')} 
          disabled={isLoading}
        />
        <QuickReplyButton 
          label="Estamos analisando seu caso" 
          onClick={() => setMessage('Estamos analisando seu caso e retornaremos em breve.')} 
          disabled={isLoading}
        />
        <QuickReplyButton 
          label="Obrigado pelo contato" 
          onClick={() => setMessage('Obrigado pelo seu contato. Há mais alguma coisa em que eu possa ajudar?')} 
          disabled={isLoading}
        />
      </div>
    </div>
  )
}

// Componente auxiliar para respostas rápidas
function QuickReplyButton({ 
  label, 
  onClick, 
  disabled 
}: { 
  label: string 
  onClick: () => void 
  disabled?: boolean 
}) {
  return (
    <Button 
      type="button" 
      variant="outline" 
      size="sm" 
      onClick={onClick} 
      disabled={disabled}
      className="text-xs whitespace-nowrap"
    >
      {label}
    </Button>
  )
} 