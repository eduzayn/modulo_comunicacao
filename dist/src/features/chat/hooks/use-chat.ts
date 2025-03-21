'use client';

import { useState, useCallback } from 'react'
import type { Message, Conversation, ChatState } from '../types/chat.types'
import { 
  sendMessage as sendMessageService, 
  createConversation, 
  archiveConversation 
} from '../services/chat-service'

/**
 * Hook para gerenciar o estado e as operações relacionadas ao chat
 * @returns Objeto com estado e funções para interagir com o chat
 */
export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    conversation: null,
    isLoading: false,
    error: null
  })

  /**
   * Inicia uma nova conversa
   * @param userId ID do usuário
   * @param metadata Metadados adicionais da conversa
   */
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
        },
        isLoading: false
      }))
      return conversationId
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao iniciar conversa', 
        isLoading: false 
      }))
      throw error
    }
  }, [])

  /**
   * Envia uma mensagem para a conversa atual
   * @param messageText Texto da mensagem
   */
  const sendMessage = useCallback(async (messageText: string) => {
    if (!state.conversation) {
      setState(prev => ({ 
        ...prev, 
        error: 'Nenhuma conversa ativa para enviar mensagem' 
      }))
      return
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      // Adiciona a mensagem do usuário imediatamente para feedback visual
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        content: messageText,
        sender: 'Você',
        timestamp: new Date(),
        type: 'text',
        status: 'sent'
      }
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage]
      }))
      
      // Envia a mensagem para o serviço
      const response = await sendMessageService(messageText, state.conversation.id)
      
      // Atualiza o estado com a resposta da API
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, response],
        isLoading: false
      }))
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao enviar mensagem', 
        isLoading: false 
      }))
    }
  }, [state.conversation])

  /**
   * Arquiva a conversa atual
   */
  const endConversation = useCallback(async () => {
    if (!state.conversation) {
      return
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      await archiveConversation(state.conversation.id)
      
      setState(prev => ({
        ...prev,
        conversation: prev.conversation ? { ...prev.conversation, status: 'archived' } : null,
        isLoading: false
      }))
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao arquivar conversa', 
        isLoading: false 
      }))
    }
  }, [state.conversation])

  return {
    ...state,
    startConversation,
    sendMessage,
    endConversation
  }
} 