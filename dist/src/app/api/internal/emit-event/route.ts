import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { events, EventType } from '@/lib/events'
import { eventProcessor } from '@/services/event-processor'

// Estender o tipo global para incluir a propriedade eventProcessorInitialized
declare global {
  var eventProcessorInitialized: boolean
}

// Esquema para validação dos payloads de eventos internos
const internalEventSchema = z.object({
  // Campos obrigatórios
  eventType: z.string(),
  payload: z.record(z.any()),
  
  // Campos opcionais
  source: z.string().optional(),
  
  // Campo para autorização
  apiKey: z.string().optional(),
})

/**
 * Endpoint para emissão de eventos internos dentro da aplicação
 * 
 * Este endpoint só deve ser chamado internamente, protegido por chave de API
 * para garantir que somente componentes autorizados possam emitir eventos.
 */
export async function POST(request: NextRequest) {
  // Verificar se o processador de eventos está inicializado
  if (!global.eventProcessorInitialized) {
    eventProcessor.init()
    global.eventProcessorInitialized = true
  }
  
  try {
    // Verificar origem da requisição
    const requestOrigin = request.headers.get('origin') || ''
    const isLocalRequest = requestOrigin.includes('localhost') || 
                           requestOrigin.includes('127.0.0.1') ||
                           request.url.includes('localhost') ||
                           request.url.includes('127.0.0.1')
    
    const isInternalRequest = isLocalRequest || 
                              requestOrigin === process.env.NEXT_PUBLIC_APP_URL
    
    // Em produção, apenas permitir requisições internas
    if (process.env.NODE_ENV === 'production' && !isInternalRequest) {
      logger.warn('Tentativa de emissão de evento bloqueada - origem não autorizada', {
        origin: requestOrigin
      })
      
      return NextResponse.json(
        { error: 'Acesso não autorizado' },
        { status: 403 }
      )
    }
    
    // Obter e validar o payload
    const body = await request.json()
    const validationResult = internalEventSchema.safeParse(body)
    
    if (!validationResult.success) {
      logger.warn('Payload de evento interno inválido', { 
        errors: validationResult.error.errors
      })
      
      return NextResponse.json(
        { error: 'Payload inválido', details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    const { eventType, payload, source, apiKey } = validationResult.data
    
    // Verificar chave de API em produção
    if (process.env.NODE_ENV === 'production') {
      if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
        logger.warn('Tentativa de emissão de evento com chave de API inválida', {
          eventType
        })
        
        return NextResponse.json(
          { error: 'Chave de API inválida' },
          { status: 401 }
        )
      }
    }
    
    // Verificar se o tipo de evento é suportado
    if (!isValidEventType(eventType)) {
      logger.warn(`Tipo de evento não suportado: ${eventType}`)
      
      return NextResponse.json(
        { error: 'Tipo de evento não suportado' },
        { status: 400 }
      )
    }
    
    // Emitir o evento
    logger.info(`Emitindo evento interno: ${eventType}`, {
      source: source || 'internal-api'
    })
    
    await events.emit(
      eventType as EventType,
      payload,
      source || 'internal-api'
    )
    
    return NextResponse.json({ 
      success: true, 
      message: `Evento ${eventType} emitido com sucesso` 
    })
    
  } catch (error) {
    const err = error as Error
    logger.error(`Erro ao processar emissão de evento interno: ${err.message}`, { 
      error: err.message,
      stack: err.stack
    })
    
    return NextResponse.json(
      { error: 'Erro interno ao processar o evento' },
      { status: 500 }
    )
  }
}

/**
 * Verifica se o tipo de evento fornecido é válido
 */
function isValidEventType(eventType: string): boolean {
  // Verificar se o evento é um tipo válido (definido no EventType)
  const validEventTypes = [
    // Eventos de conversação
    'conversation.created',
    'conversation.updated',
    'conversation.assigned',
    'conversation.closed',
    'message.created',
    'message.updated',
    'message.deleted',
    
    // Eventos de atendimento
    'agent.online',
    'agent.offline',
    'agent.busy',
    'agent.available',
    
    // Eventos de sistema
    'system.error',
    'system.warning',
    'system.maintenance'
  ]
  
  return validEventTypes.includes(eventType)
} 