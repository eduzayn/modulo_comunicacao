/**
 * Processador de eventos de conversação
 * 
 * Este serviço conecta o sistema de eventos com os middlewares de conversação,
 * garantindo que os eventos corretos sejam encaminhados para o processamento adequado.
 */

import { events, Event, EventType } from '@/lib/events'
import { logger } from '@/lib/logger'
import { processConversationEvent } from '@/services/conversation-integration'
import { enqueue } from '@/services/queue'
import { createClient } from '@supabase/supabase-js'

// Cliente Supabase para operações no banco de dados
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Tabela para armazenar o histórico de eventos processados
const EVENT_HISTORY_TABLE = 'event_history'

// Mapeamento de prioridades para diferentes tipos de eventos
const eventPriorities: Record<EventType, number> = {
  'conversation.created': 5,
  'conversation.updated': 4,
  'conversation.assigned': 6,
  'conversation.closed': 4,
  'message.created': 7,
  'message.updated': 3,
  'message.deleted': 2,
  'agent.online': 3,
  'agent.offline': 3,
  'agent.busy': 3,
  'agent.available': 3,
  'system.error': 9,
  'system.warning': 6,
  'system.maintenance': 8
}

/**
 * Inicializa os handlers de eventos relacionados à conversação
 */
export function initConversationEventHandlers(): void {
  logger.info('Inicializando handlers de eventos de conversação')
  
  // Registrar handler para conversas criadas
  events.on('conversation.created', async (event) => {
    await handleConversationEvent(event)
  })
  
  // Registrar handler para mensagens criadas
  events.on('message.created', async (event) => {
    await handleConversationEvent(event)
  })
  
  // Registrar handler para conversas atribuídas
  events.on('conversation.assigned', async (event) => {
    await handleConversationEvent(event)
  })
  
  // Registrar handler para conversas fechadas
  events.on('conversation.closed', async (event) => {
    await handleConversationEvent(event)
  })
  
  logger.info('Handlers de eventos de conversação inicializados com sucesso')
}

/**
 * Manipula um evento de conversação, mapeando para o formato adequado
 * e despachando para o processador de conversações
 */
async function handleConversationEvent(event: Event): Promise<void> {
  try {
    // Mapear o evento para o formato de ConversationEvent
    const conversationEvent = events.mapToConversationEvent(event)
    
    if (!conversationEvent) {
      logger.warn(`Evento não mapeável para conversationEvent: ${event.type}`)
      return
    }
    
    // Salvar no histórico de eventos
    await saveEventHistory(event)
    
    // Para eventos de alta prioridade, processar imediatamente
    if (eventPriorities[event.type] >= 7) {
      logger.info(`Processando evento de alta prioridade ${event.type} imediatamente`)
      await processConversationEvent(conversationEvent)
      return
    }
    
    // Para eventos de baixa prioridade, adicionar à fila
    logger.info(`Enfileirando evento ${event.type} para processamento posterior`)
    await enqueue('process_conversation_event', {
      conversationEvent,
      originalEvent: event
    }, eventPriorities[event.type])
    
  } catch (error) {
    const err = error as Error
    logger.error(`Erro ao manipular evento de conversação: ${err.message}`, {
      eventType: event.type,
      error: err.message,
      stack: err.stack
    })
  }
}

/**
 * Salva o evento no histórico para rastreabilidade
 */
async function saveEventHistory(event: Event): Promise<void> {
  try {
    await supabase.from(EVENT_HISTORY_TABLE).insert({
      event_type: event.type,
      payload: event.payload,
      source: event.source || 'system',
      processed_at: new Date().toISOString(),
      metadata: {
        original_timestamp: event.timestamp
      }
    })
  } catch (error) {
    // Não falhar o processamento do evento se o salvamento do histórico falhar
    logger.warn('Falha ao salvar histórico de evento', { error })
  }
}

/**
 * Emite um evento do sistema de forma segura
 */
export async function emitSystemEvent<T = any>(
  eventType: EventType, 
  payload: T, 
  source: string = 'system'
): Promise<void> {
  try {
    await events.emit(eventType, payload, source)
  } catch (error) {
    const err = error as Error
    logger.error(`Erro ao emitir evento do sistema: ${err.message}`, {
      eventType,
      error: err.message,
      stack: err.stack
    })
  }
}

/**
 * Inicializa o processador de eventos
 */
export function initEventProcessor(): void {
  initConversationEventHandlers()
  logger.info('Processador de eventos inicializado com sucesso')
}

// API pública do módulo
export const eventProcessor = {
  init: initEventProcessor,
  emitSystemEvent
}

export default eventProcessor 