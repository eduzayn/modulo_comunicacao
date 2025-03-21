/**
 * Inicializador dos middlewares de processamento
 * 
 * Este módulo inicializa os middlewares necessários para o processamento
 * de mensagens e conversações no sistema.
 */

import { logger } from '@/lib/logger';
import { middlewareIntegration } from '@/services/middleware-integration';

/**
 * Inicializa os middlewares de processamento
 */
export function initializeMiddlewareSystem() {
  try {
    logger.info('Inicializando sistema de middlewares');
    
    // Inicializar handlers para middlewares
    middlewareIntegration.init();
    
    // Verificar e reprocessar eventos pendentes
    middlewareIntegration.reprocessPendingEvents()
      .catch(error => {
        logger.error('Erro ao reprocessar eventos pendentes', { error });
      });
    
    logger.info('Sistema de middlewares inicializado com sucesso');
    return true;
  } catch (error) {
    logger.error('Erro ao inicializar sistema de middlewares', { error });
    return false;
  }
} 