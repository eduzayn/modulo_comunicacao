/**
 * Serviço para registro e processamento de métricas e indicadores de desempenho (fenícios)
 * 
 * Este serviço captura e registra dados de operações nos canais e alimenta o sistema de relatórios.
 */

import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { events } from '@/lib/events';
import { nanoid } from 'nanoid';

// Tabelas para armazenamento de métricas
const METRICS_TABLE = 'communication.metrics';
const METRICS_DAILY_TABLE = 'communication.metrics_daily';
const CHANNELS_METRICS_TABLE = 'communication.channels_metrics';

// Tipos de métricas que o sistema captura
export type MetricType = 
  | 'message_sent'
  | 'message_received'
  | 'conversation_started'
  | 'conversation_assigned'
  | 'conversation_closed'
  | 'response_time'
  | 'resolution_time'
  | 'satisfaction_rating';

// Interface para uma métrica básica
export interface Metric {
  id?: string;
  type: MetricType;
  value: number;
  channel_id?: string;
  conversation_id?: string;
  user_id?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

/**
 * Registra uma nova métrica no sistema
 * 
 * @param metric Dados da métrica a ser registrada
 * @returns ID da métrica registrada ou null em caso de erro
 */
export async function recordMetric(metric: Omit<Metric, 'id'>): Promise<string | null> {
  try {
    const metricId = nanoid();
    const metricWithId = {
      id: metricId,
      ...metric,
      timestamp: metric.timestamp || new Date().toISOString()
    };
    
    // Inserir na tabela principal de métricas
    const { error } = await supabaseAdmin
      .from(METRICS_TABLE)
      .insert(metricWithId);
    
    if (error) throw error;
    
    // Emitir evento para notificar o sistema sobre a nova métrica
    await events.emit('system.maintenance', {
      action: 'metric_recorded',
      metricId,
      metricType: metric.type,
      channelId: metric.channel_id,
    }, 'metrics');
    
    // Atualizar agregações diárias
    await updateDailyMetrics(metric);
    
    // Atualizar métricas específicas do canal
    if (metric.channel_id) {
      await updateChannelMetrics(metric);
    }
    
    return metricId;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error('Erro ao registrar métrica', { 
      error: err.message, 
      metricType: metric.type,
      channelId: metric.channel_id
    });
    return null;
  }
}

/**
 * Atualiza as métricas diárias agregadas
 * 
 * @param metric Métrica para agregação
 */
async function updateDailyMetrics(metric: Metric): Promise<void> {
  try {
    const date = new Date(metric.timestamp).toISOString().split('T')[0];
    
    // Verificar se já existe registro para a data
    const { data: existingMetric, error: queryError } = await supabaseAdmin
      .from(METRICS_DAILY_TABLE)
      .select('*')
      .eq('date', date)
      .eq('type', metric.type)
      .eq('channel_id', metric.channel_id || 'all')
      .single();
    
    if (queryError && !existingMetric) {
      // Criar novo registro diário
      await supabaseAdmin
        .from(METRICS_DAILY_TABLE)
        .insert({
          date,
          type: metric.type,
          channel_id: metric.channel_id || 'all',
          count: 1,
          sum: metric.value,
          avg: metric.value,
          min: metric.value,
          max: metric.value
        });
    } else if (existingMetric) {
      // Atualizar registro existente
      const newCount = existingMetric.count + 1;
      const newSum = existingMetric.sum + metric.value;
      const newAvg = newSum / newCount;
      const newMin = Math.min(existingMetric.min, metric.value);
      const newMax = Math.max(existingMetric.max, metric.value);
      
      await supabaseAdmin
        .from(METRICS_DAILY_TABLE)
        .update({
          count: newCount,
          sum: newSum,
          avg: newAvg,
          min: newMin,
          max: newMax,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingMetric.id);
    }
  } catch (error) {
    logger.error('Erro ao atualizar métricas diárias', { error });
    // Não propagar o erro para não interromper o fluxo principal
  }
}

/**
 * Atualiza as métricas específicas do canal
 * 
 * @param metric Métrica para atualização
 */
async function updateChannelMetrics(metric: Metric): Promise<void> {
  if (!metric.channel_id) return;
  
  try {
    // Verificar se já existe registro para o canal
    const { data: channelMetrics, error: queryError } = await supabaseAdmin
      .from(CHANNELS_METRICS_TABLE)
      .select('*')
      .eq('channel_id', metric.channel_id)
      .single();
    
    const now = new Date().toISOString();
    
    if (queryError && !channelMetrics) {
      // Criar novo registro de métricas para o canal
      const newMetrics: Record<string, any> = {
        channel_id: metric.channel_id,
        created_at: now,
        updated_at: now,
        total_messages: 0,
        total_conversations: 0,
        avg_response_time: 0,
        avg_resolution_time: 0,
        avg_satisfaction: 0
      };
      
      // Incrementar valores específicos baseados no tipo de métrica
      updateMetricsByType(newMetrics, metric);
      
      await supabaseAdmin
        .from(CHANNELS_METRICS_TABLE)
        .insert(newMetrics);
    } else if (channelMetrics) {
      // Preparar dados para atualização
      const updateData: Record<string, any> = {
        updated_at: now
      };
      
      // Atualizar valores baseados no tipo de métrica
      updateMetricsByType(updateData, metric, channelMetrics);
      
      await supabaseAdmin
        .from(CHANNELS_METRICS_TABLE)
        .update(updateData)
        .eq('channel_id', metric.channel_id);
    }
  } catch (error) {
    logger.error('Erro ao atualizar métricas do canal', { 
      error, 
      channelId: metric.channel_id 
    });
    // Não propagar o erro para não interromper o fluxo principal
  }
}

/**
 * Atualiza os valores de métricas baseados no tipo
 */
function updateMetricsByType(
  data: Record<string, any>, 
  metric: Metric, 
  existing?: Record<string, any>
) {
  switch (metric.type) {
    case 'message_sent':
    case 'message_received':
      data.total_messages = (existing?.total_messages || 0) + 1;
      break;
      
    case 'conversation_started':
      data.total_conversations = (existing?.total_conversations || 0) + 1;
      break;
      
    case 'response_time':
      // Calcular média de tempo de resposta
      if (existing) {
        const totalResponses = (existing.response_count || 0) + 1;
        const totalTime = (existing.avg_response_time * (totalResponses - 1)) + metric.value;
        data.avg_response_time = totalTime / totalResponses;
        data.response_count = totalResponses;
      } else {
        data.avg_response_time = metric.value;
        data.response_count = 1;
      }
      break;
      
    case 'resolution_time':
      // Calcular média de tempo de resolução
      if (existing) {
        const totalResolutions = (existing.resolution_count || 0) + 1;
        const totalTime = (existing.avg_resolution_time * (totalResolutions - 1)) + metric.value;
        data.avg_resolution_time = totalTime / totalResolutions;
        data.resolution_count = totalResolutions;
      } else {
        data.avg_resolution_time = metric.value;
        data.resolution_count = 1;
      }
      break;
      
    case 'satisfaction_rating':
      // Calcular média de satisfação
      if (existing) {
        const totalRatings = (existing.satisfaction_count || 0) + 1;
        const totalRating = (existing.avg_satisfaction * (totalRatings - 1)) + metric.value;
        data.avg_satisfaction = totalRating / totalRatings;
        data.satisfaction_count = totalRatings;
      } else {
        data.avg_satisfaction = metric.value;
        data.satisfaction_count = 1;
      }
      break;
  }
}

/**
 * Busca métricas agregadas para utilização em relatórios
 * 
 * @param channelId ID do canal ou 'all' para todos os canais
 * @param dateFrom Data inicial no formato ISO
 * @param dateTo Data final no formato ISO
 * @returns Métricas agregadas por dia
 */
export async function getMetricsForReports(
  channelId: string = 'all',
  dateFrom: string,
  dateTo: string
) {
  try {
    let query = supabaseAdmin
      .from(METRICS_DAILY_TABLE)
      .select('*')
      .gte('date', dateFrom)
      .lte('date', dateTo);
    
    if (channelId !== 'all') {
      query = query.eq('channel_id', channelId);
    }
    
    const { data, error } = await query.order('date', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    logger.error('Erro ao buscar métricas para relatórios', { error });
    return [];
  }
}

/**
 * Registra eventos no sistema de métricas
 */
export function initMetricsListeners() {
  // Registrar mensagem enviada
  events.on('message.created', async (event) => {
    try {
      const payload = event.payload;
      await recordMetric({
        type: 'message_sent',
        value: 1,
        channel_id: payload.channelId,
        conversation_id: payload.conversationId,
        user_id: payload.senderId,
        timestamp: event.timestamp,
        metadata: {
          message_type: payload.messageType || 'text'
        }
      });
    } catch (error) {
      logger.error('Erro ao registrar métrica de mensagem', { error });
    }
  });
  
  // Registrar início de conversa
  events.on('conversation.created', async (event) => {
    try {
      const payload = event.payload;
      await recordMetric({
        type: 'conversation_started',
        value: 1,
        channel_id: payload.channelId,
        conversation_id: payload.conversationId,
        timestamp: event.timestamp
      });
    } catch (error) {
      logger.error('Erro ao registrar métrica de início de conversa', { error });
    }
  });
  
  // Registrar fechamento de conversa
  events.on('conversation.closed', async (event) => {
    try {
      const payload = event.payload;
      
      // Calcular tempo de resolução (do início até o fechamento)
      if (payload.startTime) {
        const startTime = new Date(payload.startTime).getTime();
        const endTime = new Date(event.timestamp).getTime();
        const resolutionTimeMinutes = (endTime - startTime) / (1000 * 60);
        
        await recordMetric({
          type: 'resolution_time',
          value: resolutionTimeMinutes,
          channel_id: payload.channelId,
          conversation_id: payload.conversationId,
          timestamp: event.timestamp,
          metadata: {
            resolution_type: payload.closeReason || 'resolved'
          }
        });
      }
      
    } catch (error) {
      logger.error('Erro ao registrar métrica de fechamento de conversa', { error });
    }
  });
  
  logger.info('Inicializados listeners de métricas');
}

// Export API pública do módulo
export const metrics = {
  recordMetric,
  getMetricsForReports,
  initMetricsListeners
};

export default metrics;
