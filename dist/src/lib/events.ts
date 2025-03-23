/**
 * Sistema de eventos para comunicação entre módulos do sistema
 * 
 * Este módulo implementa um sistema pub/sub que permite que diferentes
 * partes do sistema se comuniquem através de eventos, garantindo um
 * baixo acoplamento entre os componentes.
 */

import { logger } from './logger'
import { ConversationEvent } from '@/services/conversation-integration'

// Tipos de eventos suportados pelo sistema
export type EventType = 
  // Eventos de conversação
  | 'conversation.created'
  | 'conversation.updated'
  | 'conversation.assigned'
  | 'conversation.closed'
  | 'message.created'
  | 'message.updated'
  | 'message.deleted'
  
  // Eventos de atendimento
  | 'agent.online'
  | 'agent.offline'
  | 'agent.busy'
  | 'agent.available'
  
  // Eventos de sistema
  | 'system.error'
  | 'system.warning'
  | 'system.maintenance'

export interface Event<T = any> {
  type: EventType
  payload: T
  timestamp: string
  source?: string
}

type EventHandler<T = any> = (event: Event<T>) => void | Promise<void>

// Armazena os handlers para cada tipo de evento
const eventHandlers: Map<EventType, Set<EventHandler>> = new Map()

/**
 * Registra um handler para um tipo específico de evento
 */
export function on<T = any>(eventType: EventType, handler: EventHandler<T>): () => void {
  // Cria o conjunto de handlers para o tipo de evento, se ainda não existir
  if (!eventHandlers.has(eventType)) {
    eventHandlers.set(eventType, new Set())
  }
  
  // Adiciona o handler ao conjunto
  const handlers = eventHandlers.get(eventType)!
  handlers.add(handler as EventHandler)
  
  logger.debug(`Handler registrado para evento ${eventType}`)
  
  // Retorna uma função para remover o handler
  return () => {
    handlers.delete(handler as EventHandler)
    logger.debug(`Handler removido para evento ${eventType}`)
  }
}

/**
 * Emite um evento para todos os handlers registrados
 */
export async function emit<T = any>(eventType: EventType, payload: T, source?: string): Promise<void> {
  const handlers = eventHandlers.get(eventType)
  
  if (!handlers || handlers.size === 0) {
    logger.debug(`Nenhum handler registrado para evento ${eventType}`)
    return
  }
  
  const event: Event<T> = {
    type: eventType,
    payload,
    timestamp: new Date().toISOString(),
    source
  }
  
  logger.info(`Emitindo evento ${eventType}`, { 
    source, 
    payloadType: typeof payload, 
    handlers: handlers.size 
  })
  
  // Executa todos os handlers de forma assíncrona
  const promises = Array.from(handlers).map(async (handler) => {
    try {
      await handler(event)
    } catch (error) {
      logger.error(`Erro ao processar evento ${eventType} no handler`, { 
        eventType, 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      })
    }
  })
  
  // Aguarda todos os handlers terminarem
  await Promise.all(promises)
}

/**
 * Mapeia eventos do sistema para o formato de ConversationEvent
 * para integração com o serviço de conversação
 */
export function mapToConversationEvent(event: Event): ConversationEvent | null {
  switch (event.type) {
    case 'conversation.created':
      return {
        conversationId: event.payload.id,
        channelId: event.payload.channelId,
        eventType: 'new_conversation',
        metadata: {
          source: event.source,
          timestamp: event.timestamp
        }
      }
      
    case 'message.created':
      return {
        conversationId: event.payload.conversationId,
        channelId: event.payload.channelId || '',
        eventType: 'new_message',
        metadata: {
          messageId: event.payload.id,
          source: event.source,
          timestamp: event.timestamp
        }
      }
      
    case 'conversation.assigned':
    case 'conversation.closed':
      return {
        conversationId: event.payload.id,
        channelId: event.payload.channelId || '',
        eventType: 'status_change',
        metadata: {
          previousStatus: event.payload.previousStatus,
          newStatus: event.payload.status,
          source: event.source,
          timestamp: event.timestamp
        }
      }
      
    default:
      return null
  }
}

/**
 * Limpa todos os handlers (útil para testes)
 */
export function clearHandlers(): void {
  eventHandlers.clear()
  logger.debug('Todos os handlers de eventos foram removidos')
}

// API pública do módulo
export const events = {
  on,
  emit,
  mapToConversationEvent,
  clearHandlers
}

export default events 