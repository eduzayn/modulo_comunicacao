import { useState, useCallback } from 'react'
import { Message, Conversation, ChatState } from '@/types/chat'
import { sendMessage, createConversation, archiveConversation } from '@/services/ai'

export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    conversation: null,
    isLoading: false,
    error: null
  })

  const startConversation = useCallback(async (userId: string, metadata?: any) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      const conversationId = await createConversation(userId, metadata)
      setState(prev => ({
        ...prev,
        conversation: {
          id: conversationId,
          title: 'Nova Conversa',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: userId,
          status: 'active',
          metadata
        }
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao iniciar conversa'
      }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const sendMessageToAI = useCallback(async (content: string) => {
    if (!state.conversation) {
      setState(prev => ({
        ...prev,
        error: 'Nenhuma conversa ativa'
      }))
      return
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      const message = await sendMessage(content, state.conversation.id)
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, message]
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao enviar mensagem'
      }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [state.conversation])

  const archiveCurrentConversation = useCallback(async () => {
    if (!state.conversation) {
      setState(prev => ({
        ...prev,
        error: 'Nenhuma conversa ativa'
      }))
      return
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      await archiveConversation(state.conversation.id)
      setState(prev => ({
        ...prev,
        conversation: null,
        messages: []
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao arquivar conversa'
      }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [state.conversation])

  return {
    messages: state.messages,
    conversation: state.conversation,
    isLoading: state.isLoading,
    error: state.error,
    startConversation,
    sendMessage: sendMessageToAI,
    archiveConversation: archiveCurrentConversation
  }
} 