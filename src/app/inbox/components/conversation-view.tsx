'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { Loader2, ArrowLeft, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ConversationActions } from './conversation-actions'
import { ConversationReply } from './conversation-reply'
import { logger } from '@/lib/logger'
import { useConversationEvents } from '@/hooks/useConversationEvents'

// Cliente Supabase para operações no banco de dados
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface ConversationViewProps {
  conversationId: string
  onBack?: () => void
}

interface Message {
  id: string
  content: string
  created_at: string
  sender_type: 'user' | 'agent' | 'system'
  sender_id: string
  sender_name?: string
  avatar_url?: string
}

interface Conversation {
  id: string
  channel_id: string
  channel_type: string
  status: string
  subject?: string
  customer_name: string
  customer_email?: string
  customer_phone?: string
  assigned_to?: string
  assigned_name?: string
  created_at: string
  updated_at: string
  last_message_at: string
}

export function ConversationView({
  conversationId,
  onBack
}: ConversationViewProps) {
  const { useConversationUpdates } = useConversationEvents()
  
  // Consulta para obter detalhes da conversa
  const {
    data: conversation,
    isLoading: isLoadingConversation,
    error: conversationError,
    refetch: refetchConversation
  } = useQuery<Conversation>({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .single()
        
        if (error) throw error
        return data
      } catch (err) {
        logger.error('Erro ao carregar conversa', { error: err, conversationId })
        throw err
      }
    }
  })
  
  // Consulta para obter mensagens da conversa
  const {
    data: messages,
    isLoading: isLoadingMessages,
    error: messagesError,
    refetch: refetchMessages
  } = useQuery<Message[]>({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at')
        
        if (error) throw error
        return data
      } catch (err) {
        logger.error('Erro ao carregar mensagens', { error: err, conversationId })
        throw err
      }
    }
  })
  
  // Escutar atualizações da conversa
  useConversationUpdates(conversationId, () => {
    // Atualizar dados quando a conversa for modificada
    refetchConversation()
    refetchMessages()
  })
  
  // Formatação de data para exibição
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'às' HH:mm", {
      locale: ptBR,
    })
  }
  
  // Função para renderizar mensagens agrupadas por remetente
  const renderMessages = () => {
    if (!messages || messages.length === 0) {
      return (
        <div className="flex justify-center items-center p-8 text-muted-foreground">
          Nenhuma mensagem encontrada
        </div>
      )
    }
    
    return messages.map((message, index) => {
      const isCustomer = message.sender_type === 'user'
      const isSystem = message.sender_type === 'system'
      
      return (
        <div 
          key={message.id}
          className={`flex ${isCustomer ? 'justify-start' : isSystem ? 'justify-center' : 'justify-end'} mb-4`}
        >
          {isSystem ? (
            <div className="bg-muted rounded-md px-4 py-2 max-w-[80%] text-sm text-center">
              <Clock className="h-4 w-4 inline mr-2" />
              {message.content}
            </div>
          ) : (
            <div className={`flex ${isCustomer ? 'flex-row' : 'flex-row-reverse'} gap-2 max-w-[80%]`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.avatar_url} />
                <AvatarFallback>
                  {isCustomer 
                    ? (conversation?.customer_name?.[0] || 'C').toUpperCase() 
                    : (message.sender_name?.[0] || 'A').toUpperCase()
                  }
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {isCustomer 
                      ? conversation?.customer_name || 'Cliente'
                      : message.sender_name || 'Atendente'
                    }
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(message.created_at)}
                  </span>
                </div>
                <div className={`rounded-lg px-3 py-2 ${
                  isCustomer ? 'bg-secondary' : 'bg-primary text-primary-foreground'
                }`}>
                  {message.content}
                </div>
              </div>
            </div>
          )}
        </div>
      )
    })
  }
  
  // Estado de carregamento
  if (isLoadingConversation || isLoadingMessages) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  
  // Estado de erro
  if (conversationError || messagesError || !conversation) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <p className="text-destructive mb-2">Erro ao carregar conversa</p>
        <Button onClick={() => {
          refetchConversation()
          refetchMessages()
        }}>
          Tentar novamente
        </Button>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Cabeçalho com informações da conversa */}
      <div className="bg-card p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">
                  {conversation.customer_name}
                </h2>
                <Badge variant={conversation.status === 'open' ? 'default' : 'secondary'}>
                  {conversation.status === 'open' ? 'Em aberto' : 'Fechado'}
                </Badge>
                {conversation.channel_type && (
                  <Badge variant="outline">
                    {conversation.channel_type === 'whatsapp' 
                      ? 'WhatsApp' 
                      : conversation.channel_type === 'email' 
                        ? 'Email' 
                        : conversation.channel_type}
                  </Badge>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                {conversation.customer_email && (
                  <span className="mr-3">{conversation.customer_email}</span>
                )}
                {conversation.customer_phone && (
                  <span>{conversation.customer_phone}</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Componente de ações da conversa */}
          <ConversationActions 
            conversationId={conversation.id}
            channelId={conversation.channel_id}
            status={conversation.status}
            assignedTo={conversation.assigned_to}
          />
        </div>
        
        {conversation.assigned_to && (
          <div className="mt-2 flex items-center">
            <span className="text-sm text-muted-foreground">
              Atribuído para: <span className="font-medium text-foreground">{conversation.assigned_name || 'Agente'}</span>
            </span>
          </div>
        )}
      </div>
      
      {/* Corpo da conversa - mensagens */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderMessages()}
      </div>
      
      {/* Área de resposta - componente de resposta */}
      <div className="p-4 border-t bg-background">
        <ConversationReply 
          conversationId={conversation.id}
          channelId={conversation.channel_id}
          disabled={conversation.status === 'closed'}
        />
      </div>
    </div>
  )
} 