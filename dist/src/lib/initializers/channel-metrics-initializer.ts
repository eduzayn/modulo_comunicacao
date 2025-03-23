/**
 * Inicializador do sistema de métricas de canais
 * 
 * Este módulo inicializa o monitoramento de métricas específicas dos canais
 * de comunicação, como WhatsApp, Facebook, Email, etc.
 */

import { events } from '@/lib/events';
import { logger } from '@/lib/logger';
import { metrics, MetricType } from '@/services/metrics';
import type { Channel } from '@/types';

// Mapeamento de tipos de eventos para métricas de canal
const channelEventMetrics: Record<string, MetricType> = {
  'message.created': 'message_received',
  'conversation.created': 'conversation_started',
  'conversation.assigned': 'conversation_assigned',
  'conversation.closed': 'conversation_closed'
};

/**
 * Inicializa o sistema de métricas para canais de comunicação
 */
export function initializeChannelMetricsSystem() {
  try {
    // Registra listeners para eventos específicos dos canais
    Object.entries(channelEventMetrics).forEach(([eventType, metricType]) => {
      events.on(eventType as any, async (event) => {
        try {
          if (!event.payload.channelId) {
            logger.debug(`Evento ${eventType} sem channelId, não registrando métrica`);
            return;
          }
          
          // Registrar métrica específica do canal
          await metrics.recordMetric({
            type: metricType,
            value: 1,
            channel_id: event.payload.channelId,
            conversation_id: event.payload.conversationId || event.payload.id,
            timestamp: event.timestamp,
            metadata: {
              eventType,
              source: event.source || 'system'
            }
          });
          
        } catch (error) {
          logger.error(`Erro ao registrar métrica de canal para ${eventType}`, { 
            error,
            channelId: event.payload.channelId
          });
        }
      });
    });
    
    logger.info('Sistema de métricas de canais inicializado com sucesso');
    return true;
  } catch (error) {
    logger.error('Erro ao inicializar sistema de métricas de canais', { error });
    return false;
  }
} 