import { supabase } from '@/lib/supabase'
import type { Message, Conversation } from '../types/chat.types'

/**
 * Envia uma mensagem para uma conversa existente
 * @param message Texto da mensagem
 * @param conversationId ID da conversa
 * @returns Promise com a mensagem criada
 */
export async function sendMessage(message: string, conversationId: string): Promise<Message> {
  try {
    // Primeiro salvamos a mensagem do usuário
    const { data: userMessage, error: userMessageError } = await supabase
      .from('messages')
      .insert({
        content: message,
        role: 'user',
        conversation_id: conversationId
      })
      .select()
      .single()

    if (userMessageError) throw userMessageError

    // Obtemos o contexto da conversa
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single()

    if (conversationError) throw conversationError

    // Obtemos o histórico recente da conversa
    const { data: messageHistory, error: messageHistoryError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10)

    if (messageHistoryError) throw messageHistoryError

    // Aqui você pode conectar com um serviço de IA como OpenAI
    // e obter uma resposta baseada no contexto da conversa
    
    // Para este exemplo, retornamos uma resposta simulada
    const aiResponse = {
      content: `Resposta à sua mensagem: "${message}"`,
      role: 'assistant',
      conversation_id: conversationId
    }

    // Salvamos a resposta do assistente no banco
    const { data: assistantMessage, error: assistantMessageError } = await supabase
      .from('messages')
      .insert(aiResponse)
      .select()
      .single()

    if (assistantMessageError) throw assistantMessageError

    // Formatamos a resposta para a interface
    return {
      id: assistantMessage.id,
      content: assistantMessage.content,
      sender: 'AI Assistant',
      timestamp: new Date(assistantMessage.created_at),
      type: 'text',
      status: 'sent'
    }
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    throw error
  }
}

/**
 * Cria uma nova conversa
 * @param userId ID do usuário
 * @param metadata Metadados adicionais da conversa
 * @returns Promise com o ID da conversa criada
 */
export async function createConversation(userId: string, metadata?: any): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        title: 'Nova Conversa',
        user_id: userId,
        status: 'active',
        metadata
      })
      .select()
      .single()

    if (error) throw error
    return data.id
  } catch (error) {
    console.error('Erro ao criar conversa:', error)
    throw error
  }
}

/**
 * Arquiva uma conversa existente
 * @param conversationId ID da conversa a ser arquivada
 */
export async function archiveConversation(conversationId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('conversations')
      .update({ status: 'archived' })
      .eq('id', conversationId)

    if (error) throw error
  } catch (error) {
    console.error('Erro ao arquivar conversa:', error)
    throw error
  }
} 