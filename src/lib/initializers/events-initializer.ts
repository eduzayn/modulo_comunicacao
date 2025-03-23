/**
 * Inicializador do sistema de eventos
 * 
 * Este módulo inicializa o sistema de eventos, registrando os
 * processadores e middlewares necessários.
 */

import { events } from '@/lib/events';
import { logger } from '@/lib/logger';
import { eventProcessor } from '@/services/event-processor';

/**
 * Inicializa o sistema de eventos
 */
export async function initializeEventsSystem(): Promise<boolean> {
  try {
    // Inicializa o processador de eventos
    await eventProcessor.init();
    
    // Registra handler para erros no sistema de eventos
    events.on('system.error', (event) => {
      logger.error('Erro no sistema de eventos', { 
        error: event.payload, 
        source: event.source,
        timestamp: event.timestamp
      });
    });
    
    logger.info('Sistema de eventos inicializado com sucesso');
    return true;
  } catch (error) {
    logger.error('Erro ao inicializar sistema de eventos', { error });
    return false;
  }
} 