import { useState, useEffect } from 'react'
import { events, EventType } from '@/lib/events'
import { useToast } from '@/components/ui/use-toast'
import { logger } from '@/lib/logger'

interface ConversationEventParams {
  conversationId: string
  channelId?: string
  metadata?: Record<string, any>
}

export function useConversationEvents() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})

  // Função para emitir evento de nova conversa
  const emitNewConversation = async (params: ConversationEventParams) => {
    try {
      setIsLoading({ ...isLoading, newConversation: true })
      
      await events.emit('conversation.created', {
        conversationId: params.conversationId,
        channelId: params.channelId || 'unknown',
        metadata: params.metadata || {}
      }, 'app')
      
      toast({
        title: 'Conversa criada',
        description: 'Nova conversa registrada no sistema'
      })
      
      logger.info('Evento de nova conversa emitido', {
        conversationId: params.conversationId
      })
      
    } catch (error) {
      const err = error as Error
      toast({
        title: 'Erro ao criar conversa',
        description: err.message,
        variant: 'destructive'
      })
      
      logger.error('Erro ao emitir evento de nova conversa', {
        error: err.message,
        stack: err.stack
      })
    } finally {
      setIsLoading(prev => ({ ...prev, newConversation: false }))
    }
  }

  // Função para emitir evento de nova mensagem
  const emitNewMessage = async (params: ConversationEventParams) => {
    try {
      setIsLoading({ ...isLoading, newMessage: true })
      
      await events.emit('message.created', {
        conversationId: params.conversationId,
        channelId: params.channelId || 'unknown',
        metadata: params.metadata || {}
      }, 'app')
      
      logger.info('Evento de nova mensagem emitido', {
        conversationId: params.conversationId
      })
      
    } catch (error) {
      const err = error as Error
      toast({
        title: 'Erro ao registrar mensagem',
        description: err.message,
        variant: 'destructive'
      })
      
      logger.error('Erro ao emitir evento de nova mensagem', {
        error: err.message,
        stack: err.stack
      })
    } finally {
      setIsLoading(prev => ({ ...prev, newMessage: false }))
    }
  }

  // Função para emitir evento de atribuição de conversa
  const emitConversationAssigned = async (params: ConversationEventParams & { assignedTo: string }) => {
    try {
      setIsLoading({ ...isLoading, conversationAssigned: true })
      
      await events.emit('conversation.assigned', {
        conversationId: params.conversationId,
        channelId: params.channelId || 'unknown',
        assignedTo: params.assignedTo,
        metadata: params.metadata || {}
      }, 'app')
      
      toast({
        title: 'Conversa atribuída',
        description: 'Conversa atribuída com sucesso'
      })
      
      logger.info('Evento de atribuição de conversa emitido', {
        conversationId: params.conversationId,
        assignedTo: params.assignedTo
      })
      
    } catch (error) {
      const err = error as Error
      toast({
        title: 'Erro ao atribuir conversa',
        description: err.message,
        variant: 'destructive'
      })
      
      logger.error('Erro ao emitir evento de atribuição de conversa', {
        error: err.message,
        stack: err.stack
      })
    } finally {
      setIsLoading(prev => ({ ...prev, conversationAssigned: false }))
    }
  }

  // Função para emitir evento de fechamento de conversa
  const emitConversationClosed = async (params: ConversationEventParams) => {
    try {
      setIsLoading({ ...isLoading, conversationClosed: true })
      
      await events.emit('conversation.closed', {
        conversationId: params.conversationId,
        channelId: params.channelId || 'unknown',
        metadata: params.metadata || {}
      }, 'app')
      
      toast({
        title: 'Conversa fechada',
        description: 'Conversa fechada com sucesso'
      })
      
      logger.info('Evento de fechamento de conversa emitido', {
        conversationId: params.conversationId
      })
      
    } catch (error) {
      const err = error as Error
      toast({
        title: 'Erro ao fechar conversa',
        description: err.message,
        variant: 'destructive'
      })
      
      logger.error('Erro ao emitir evento de fechamento de conversa', {
        error: err.message,
        stack: err.stack
      })
    } finally {
      setIsLoading(prev => ({ ...prev, conversationClosed: false }))
    }
  }

  // Hook para monitorar atualizações de conversas (opcional: para componentes que precisam reagir a eventos)
  const useConversationUpdates = (conversationId: string, callback: (data: any) => void) => {
    useEffect(() => {
      // Registrar handlers para eventos de atualização de conversa
      const unsubscribeAssigned = events.on('conversation.assigned', (event) => {
        if (event.payload.conversationId === conversationId) {
          callback(event.payload)
        }
      })
      
      const unsubscribeMessage = events.on('message.created', (event) => {
        if (event.payload.conversationId === conversationId) {
          callback(event.payload)
        }
      })
      
      const unsubscribeClosed = events.on('conversation.closed', (event) => {
        if (event.payload.conversationId === conversationId) {
          callback(event.payload)
        }
      })
      
      // Limpar os handlers quando o componente for desmontado
      return () => {
        unsubscribeAssigned()
        unsubscribeMessage()
        unsubscribeClosed()
      }
    }, [conversationId, callback])
  }

  return {
    emitNewConversation,
    emitNewMessage,
    emitConversationAssigned,
    emitConversationClosed,
    useConversationUpdates,
    isLoading
  }
} 