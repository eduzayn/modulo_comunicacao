import { Message } from '@/types/chat'
import { supabase } from '@/lib/supabase'

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
      .select('context, metadata')
      .eq('id', conversationId)
      .single()

    if (conversationError) throw conversationError

    // Obtemos o histórico de mensagens
    const { data: messageHistory, error: messageHistoryError } = await supabase
      .from('messages')
      .select('content, role')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10)

    if (messageHistoryError) throw messageHistoryError

    // Preparamos o prompt para a IA
    const prompt = {
      messages: messageHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      context: conversation.context,
      metadata: conversation.metadata
    }

    // Enviamos para a API de IA (endpoint a ser implementado)
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(prompt)
    })

    if (!response.ok) throw new Error('Falha ao obter resposta da IA')

    const aiResponse = await response.json()

    // Salvamos a resposta da IA
    const { data: assistantMessage, error: assistantMessageError } = await supabase
      .from('messages')
      .insert({
        content: aiResponse.content,
        role: 'assistant',
        conversation_id: conversationId
      })
      .select()
      .single()

    if (assistantMessageError) throw assistantMessageError

    return assistantMessage
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    throw error
  }
}

export async function createConversation(userId: string, metadata?: any): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
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