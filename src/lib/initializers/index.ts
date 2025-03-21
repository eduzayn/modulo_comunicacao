/**
 * Inicializadores do sistema
 * 
 * Este módulo importa e exporta todos os inicializadores necessários
 * para que o sistema funcione corretamente.
 */

import { initializeEventsSystem } from './events-initializer';
import { initializeMetricsSystem } from './metrics-initializer';
import { initializeChannelMetricsSystem } from './channel-metrics-initializer';
import { initializeMiddlewareSystem } from './middleware-initializer';
import { initializeChannelsSystem } from './channels-initializer';
import { initializeMonitoringSystem } from './monitoring-initializer';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

// Flag para controlar se a inicialização já foi executada
let systemInitialized = false;
let initializationInProgress = false;

/**
 * Inicializa todos os subsistemas necessários para a aplicação
 */
export async function initializeSystem(): Promise<boolean> {
  if (systemInitialized) {
    logger.info('Sistema já inicializado. Pulando inicialização.', {
      systemState: 'already_initialized',
    });
    return true;
  }

  logger.info('Iniciando inicialização do sistema...', {
    systemState: 'initializing',
  });

  try {
    // Verificar e criar tabelas necessárias - componente crítico
    await ensureDatabaseTables();

    // Inicializar o sistema de eventos - componente crítico
    const eventsInitialized = await initializeEventsSystem();
    
    if (!eventsInitialized) {
      logger.error('Falha na inicialização do sistema de eventos', {
        systemState: 'initialization_failed',
      });
      return false;
    }
    
    // Marcar como inicializado mesmo antes de completar todas as inicializações não críticas
    systemInitialized = true;
    
    // Inicializar o sistema de métricas de forma assíncrona (não bloqueia a inicialização principal)
    initializeMetricsSystem().then(metricsInitialized => {
      if (!metricsInitialized) {
        logger.warn('Falha na inicialização do sistema de métricas', {
          systemState: 'metrics_initialization_failed',
        });
      } else {
        logger.info('Sistema de métricas inicializado com sucesso (assíncrono)', {
          systemState: 'metrics_initialized',
        });
      }
    }).catch(error => {
      logger.warn('Erro ao inicializar sistema de métricas de forma assíncrona', { error });
    });

    logger.info('Sistema inicializado com sucesso!', {
      systemState: 'initialized',
      eventsInitialized,
      metricsInitializing: 'async',
    });
    
    return true;
  } catch (error) {
    logger.error('Erro ao inicializar sistema', { error });
    return false;
  }
}

/**
 * Força a reinicialização do sistema, mesmo que já esteja inicializado
 */
export async function forceReinitialization(): Promise<boolean> {
  logger.info('Forçando reinicialização do sistema...', {
    systemState: 'reinitializing',
  });
  
  systemInitialized = false;
  return await initializeSystem();
}

/**
 * Verifica se o sistema já foi inicializado
 */
export function isSystemInitialized(): boolean {
  return systemInitialized;
}

/**
 * Verifica e cria as tabelas necessárias para o funcionamento do sistema
 */
async function ensureDatabaseTables(): Promise<void> {
  try {
    // Verificar se as tabelas necessárias existem
    const { data: tablesExist, error: tableCheckError } = await supabaseAdmin
      .rpc('check_table_exists', { p_table_name: 'event_history' });
    
    if (tableCheckError) {
      logger.error('Erro ao verificar existência das tabelas', { error: tableCheckError });
      logger.info('Considere executar o script SQL para criar as tabelas no Supabase Studio.');
      return;
    }
    
    // Se as tabelas não existirem, informamos ao usuário que deve executar o script SQL
    if (!tablesExist) {
      logger.info('Tabelas do sistema não encontradas. Execute o seguinte script SQL no Supabase Studio:');
      
      const createTableScript = `
-- Criar tabela de histórico de eventos
CREATE TABLE IF NOT EXISTS public.event_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(255) NOT NULL,
  event_data JSONB NOT NULL,
  processing_time FLOAT,
  status VARCHAR(50) DEFAULT 'processed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Criar tabela de configurações de middleware
CREATE TABLE IF NOT EXISTS public.middleware_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  middleware_name VARCHAR(255) NOT NULL UNIQUE,
  is_enabled BOOLEAN DEFAULT TRUE,
  config JSONB DEFAULT '{}'::jsonb,
  priority INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de estatísticas de middleware
CREATE TABLE IF NOT EXISTS public.middleware_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  middleware_name VARCHAR(255) NOT NULL,
  total_processed INTEGER DEFAULT 0,
  total_succeeded INTEGER DEFAULT 0,
  total_failed INTEGER DEFAULT 0,
  avg_processing_time FLOAT DEFAULT 0,
  last_processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de resumo de métricas
CREATE TABLE IF NOT EXISTS public.metrics_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  events_processed INTEGER DEFAULT 0,
  messages_processed INTEGER DEFAULT 0,
  avg_event_processing_time FLOAT DEFAULT 0,
  avg_middleware_time FLOAT DEFAULT 0,
  middleware_processed INTEGER DEFAULT 0,
  total_metrics INTEGER DEFAULT 0,
  active_conversations INTEGER DEFAULT 0,
  last_metric_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir registro inicial na tabela de métricas
INSERT INTO public.metrics_summary (
  events_processed, 
  messages_processed, 
  avg_event_processing_time,
  avg_middleware_time,
  middleware_processed,
  total_metrics,
  active_conversations
) VALUES (
  0, 0, 0, 0, 0, 0, 0
);
`;
      
      logger.info(createTableScript);
      logger.warn('As tabelas necessárias não foram encontradas, o sistema pode não funcionar corretamente.');
    } else {
      logger.info('Tabelas do sistema já existem. Estrutura de banco de dados OK.');
    }
  } catch (error) {
    logger.error('Erro ao verificar e criar tabelas do sistema', { error });
  }
}

export default {
  initializeSystem,
  forceReinitialization,
  isSystemInitialized
}; 