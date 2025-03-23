import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { events } from '@/lib/events'
import { eventProcessor } from '@/services/event-processor'

// Estender o tipo global para incluir a propriedade eventProcessorInitialized
declare global {
  var eventProcessorInitialized: boolean
}

// Esquema para validação dos payloads de eventos recebidos
const webhookEventSchema = z.object({
  // Campos obrigatórios
  event_type: z.string(),
  payload: z.record(z.any()),
  
  // Campos opcionais
  source: z.string().optional(),
  timestamp: z.string().datetime().optional(),
  signature: z.string().optional()
})

type WebhookEvent = z.infer<typeof webhookEventSchema>

// Mapeamento de tipos de eventos externos para eventos internos
const eventTypeMapping: Record<string, string> = {
  // Eventos de conversação
  'conversation.new': 'conversation.created',
  'conversation.update': 'conversation.updated',
  'conversation.assign': 'conversation.assigned',
  'conversation.close': 'conversation.closed',
  
  // Eventos de mensagem
  'message.new': 'message.created',
  'message.update': 'message.updated',
  'message.delete': 'message.deleted',
  
  // Eventos de agente
  'agent.status.online': 'agent.online',
  'agent.status.offline': 'agent.offline',
  'agent.status.busy': 'agent.busy',
  'agent.status.available': 'agent.available'
}

/**
 * Handler para webhooks de eventos
 * 
 * Este endpoint recebe eventos externos (webhooks) e os converte em eventos internos do sistema.
 */
export async function POST(request: NextRequest) {
  // Verificar se o processador de eventos está inicializado
  if (!global.eventProcessorInitialized) {
    eventProcessor.init()
    global.eventProcessorInitialized = true
  }
  
  try {
    // Obter e validar o payload
    const body = await request.json()
    const validationResult = webhookEventSchema.safeParse(body)
    
    if (!validationResult.success) {
      logger.warn('Webhook de evento inválido recebido', { 
        errors: validationResult.error.errors
      })
      
      return NextResponse.json(
        { error: 'Payload inválido', details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    const event = validationResult.data
    
    // Mapear o tipo de evento externo para o tipo interno
    const internalEventType = mapExternalEventType(event.event_type)
    
    if (!internalEventType) {
      logger.warn(`Tipo de evento externo não mapeável: ${event.event_type}`)
      return NextResponse.json(
        { error: 'Tipo de evento não suportado' },
        { status: 400 }
      )
    }
    
    // Verificar assinatura do webhook (em um ambiente de produção)
    if (process.env.NODE_ENV === 'production' && !verifyWebhookSignature(request, event)) {
      logger.warn('Assinatura de webhook inválida', { 
        eventType: event.event_type,
        source: event.source
      })
      
      return NextResponse.json(
        { error: 'Assinatura inválida' },
        { status: 401 }
      )
    }
    
    // Emitir o evento interno correspondente
    logger.info(`Webhook recebido: ${event.event_type} -> ${internalEventType}`)
    
    await events.emit(
      internalEventType as any, // Se o evento for mapeado corretamente, o tipo é válido
      event.payload,
      event.source || 'webhook'
    )
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    const err = error as Error
    logger.error(`Erro ao processar webhook de evento: ${err.message}`, { 
      error: err.message,
      stack: err.stack
    })
    
    return NextResponse.json(
      { error: 'Erro interno ao processar o webhook' },
      { status: 500 }
    )
  }
}

/**
 * Mapeia um tipo de evento externo para o tipo interno correspondente
 */
function mapExternalEventType(externalType: string): string | null {
  // Verificar se existe um mapeamento direto
  if (externalType in eventTypeMapping) {
    return eventTypeMapping[externalType]
  }
  
  // Tentar fazer um mapeamento genérico
  const parts = externalType.split('.')
  if (parts.length >= 2) {
    const entityAndAction = `${parts[0]}.${parts[1]}`
    
    if (entityAndAction in eventTypeMapping) {
      return eventTypeMapping[entityAndAction]
    }
  }
  
  return null
}

/**
 * Verifica a assinatura do webhook para garantir sua autenticidade
 */
function verifyWebhookSignature(request: NextRequest, event: WebhookEvent): boolean {
  // Em um ambiente de produção, você deve implementar a verificação da assinatura
  // utilizando um segredo compartilhado com o serviço que envia os webhooks
  
  // Por enquanto, retornamos true para permitir todos os webhooks em desenvolvimento
  if (process.env.NODE_ENV !== 'production') {
    return true
  }
  
  const signature = request.headers.get('x-webhook-signature')
  
  // Se não houver assinatura, rejeitar em produção
  if (!signature) {
    return false
  }
  
  // Implementar a lógica de verificação de assinatura
  // ...
  
  // Por enquanto, retornamos true para simplificar
  return true
} 