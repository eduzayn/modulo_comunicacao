/**
 * Serviço de integração de middlewares com o sistema de eventos
 * 
 * Este módulo conecta o sistema de eventos com os middlewares de processamento,
 * como regras de atribuição e horários comerciais, garantindo que os eventos
 * sejam processados corretamente pelos middlewares apropriados.
 */

import { createClient } from '@supabase/supabase-js'
import { events, EventType, Event } from '@/lib/events'
import { logger } from '@/lib/logger'
import { ConversationIntegrationService } from './conversation-integration'
import { assignmentRulesMiddleware } from './assignment-rules-middleware'
import { businessHoursMiddleware } from './business-hours-middleware'
import { enqueue } from './queue'

// Cliente Supabase para operações no banco de dados
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Serviço de integração de conversas
const conversationService = new ConversationIntegrationService()

/**
 * Inicializa os handlers para os middlewares
 */
export function initMiddlewareHandlers() {
  logger.info('Inicializando handlers para middlewares')
  
  // Registrar evento de nova conversa
  events.on('conversation.created', async (event) => {
    try {
      logger.info('Processando evento conversation.created', { 
        conversationId: event.payload.conversationId 
      })
      
      // Buscar dados da conversa
      const { data: conversation, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', event.payload.conversationId)
        .single()
      
      if (error || !conversation) {
        throw new Error(`Erro ao buscar conversa: ${error?.message || 'Conversa não encontrada'}`)
      }
      
      // Verificar horários comerciais
      const conversationWithSchedule = await businessHoursMiddleware(conversation)
      
      // Se estiver dentro do horário comercial, aplicar regras de atribuição
      if (!conversationWithSchedule.receivedOutsideBusinessHours || 
          process.env.ALLOW_ASSIGNMENT_OUTSIDE_HOURS === 'true') {
        await assignmentRulesMiddleware(conversationWithSchedule)
      } else {
        logger.info(`Conversa ${conversation.id} não será atribuída por estar fora do horário comercial`)
      }
      
      // Registrar evento processado
      await registerProcessedEvent(event.type, event.payload.conversationId)
      
    } catch (error) {
      const err = error as Error
      logger.error(`Erro ao processar evento conversation.created: ${err.message}`, {
        conversationId: event.payload.conversationId,
        stack: err.stack
      })
    }
  })
  
  // Registrar evento de nova mensagem
  events.on('message.created', async (event) => {
    try {
      logger.info('Processando evento message.created', { 
        conversationId: event.payload.conversationId 
      })
      
      // Buscar dados da conversa
      const { data: conversation, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', event.payload.conversationId)
        .single()
      
      if (error || !conversation) {
        throw new Error(`Erro ao buscar conversa: ${error?.message || 'Conversa não encontrada'}`)
      }
      
      // Verificar horários comerciais para respostas automáticas
      await businessHoursMiddleware(conversation)
      
      // Se a conversa está aberta mas sem atribuição, tentar aplicar regras
      if (conversation.status === 'open' && !conversation.assigned_to) {
        await assignmentRulesMiddleware(conversation)
      }
      
      // Registrar evento processado
      await registerProcessedEvent(event.type, event.payload.conversationId)
      
    } catch (error) {
      const err = error as Error
      logger.error(`Erro ao processar evento message.created: ${err.message}`, {
        conversationId: event.payload.conversationId,
        stack: err.stack
      })
    }
  })
  
  // Registrar evento de conversa atribuída
  events.on('conversation.assigned', async (event) => {
    try {
      logger.info('Processando evento conversation.assigned', { 
        conversationId: event.payload.conversationId,
        assignedTo: event.payload.assignedTo
      })
      
      // Atualizar conversa com a atribuição
      await supabase
        .from('conversations')
        .update({
          assigned_to: event.payload.assignedTo,
          updated_at: new Date().toISOString()
        })
        .eq('id', event.payload.conversationId)
      
      // Registrar evento processado
      await registerProcessedEvent(event.type, event.payload.conversationId)
      
    } catch (error) {
      const err = error as Error
      logger.error(`Erro ao processar evento conversation.assigned: ${err.message}`, {
        conversationId: event.payload.conversationId,
        stack: err.stack
      })
    }
  })
  
  // Registrar evento de conversa fechada
  events.on('conversation.closed', async (event) => {
    try {
      logger.info('Processando evento conversation.closed', { 
        conversationId: event.payload.conversationId 
      })
      
      // Atualizar status da conversa
      await supabase
        .from('conversations')
        .update({
          status: 'closed',
          closed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', event.payload.conversationId)
      
      // Registrar evento processado
      await registerProcessedEvent(event.type, event.payload.conversationId)
      
    } catch (error) {
      const err = error as Error
      logger.error(`Erro ao processar evento conversation.closed: ${err.message}`, {
        conversationId: event.payload.conversationId,
        stack: err.stack
      })
    }
  })
  
  logger.info('Handlers para middlewares inicializados com sucesso')
}

/**
 * Registra um evento processado no histórico
 */
async function registerProcessedEvent(eventType: EventType, conversationId: string) {
  try {
    await supabase
      .from('event_history')
      .insert({
        event_type: eventType,
        conversation_id: conversationId,
        processed_at: new Date().toISOString(),
        status: 'processed'
      })
    
    logger.debug(`Evento ${eventType} registrado no histórico`, { conversationId })
  } catch (error) {
    const err = error as Error
    logger.error(`Erro ao registrar evento no histórico: ${err.message}`, {
      eventType,
      conversationId,
      stack: err.stack
    })
  }
}

/**
 * Reinicia o processamento de eventos não processados
 */
export async function reprocessPendingEvents() {
  try {
    logger.info('Verificando eventos pendentes para reprocessamento')
    
    // Buscar eventos pendentes
    const { data: pendingEvents, error } = await supabase
      .from('event_history')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(50)
    
    if (error) {
      throw new Error(`Erro ao buscar eventos pendentes: ${error.message}`)
    }
    
    if (!pendingEvents || pendingEvents.length === 0) {
      logger.info('Nenhum evento pendente encontrado')
      return
    }
    
    logger.info(`Encontrados ${pendingEvents.length} eventos pendentes para reprocessamento`)
    
    // Reprocessar cada evento pendente
    for (const event of pendingEvents) {
      await enqueue('event-processing', {
        eventId: event.id,
        eventType: event.event_type,
        conversationId: event.conversation_id
      }, 5)
      
      logger.info(`Evento ${event.id} (${event.event_type}) enfileirado para reprocessamento`, {
        conversationId: event.conversation_id
      })
    }
    
  } catch (error) {
    const err = error as Error
    logger.error(`Erro ao reprocessar eventos pendentes: ${err.message}`, {
      stack: err.stack
    })
  }
}

// Exportar a API pública do módulo
export const middlewareIntegration = {
  init: initMiddlewareHandlers,
  reprocessPendingEvents
} 