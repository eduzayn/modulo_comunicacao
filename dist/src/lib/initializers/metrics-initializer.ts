/**
 * Inicializador do sistema de métricas (fenícios)
 * 
 * Este módulo inicializa o sistema de métricas para captura de indicadores
 * de desempenho a partir dos eventos do sistema.
 */

import { metrics } from '@/services/metrics';
import { logger } from '@/lib/logger';

/**
 * Inicializa o sistema de métricas (fenícios)
 */
export async function initializeMetricsSystem(): Promise<boolean> {
  try {
    // Registra os listeners de eventos para capturar métricas
    await metrics.initMetricsListeners();
    logger.info('Sistema de métricas (fenícios) inicializado com sucesso');
    return true;
  } catch (error) {
    logger.error('Erro ao inicializar sistema de métricas (fenícios)', { error });
    return false;
  }
} 