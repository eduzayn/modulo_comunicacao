/**
 * Inicializador dos canais de comunicação
 * 
 * Este módulo inicializa os canais de comunicação ativos no sistema,
 * como WhatsApp, Facebook, Instagram, Email, etc.
 */

import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { events } from '@/lib/events';
import type { Channel } from '@/types';

// Indica se os canais foram inicializados
let channelsInitialized = false;

/**
 * Inicializa os canais de comunicação disponíveis
 */
export async function initializeChannelsSystem() {
  if (channelsInitialized) {
    logger.debug('Canais já inicializados, ignorando');
    return true;
  }

  try {
    logger.info('Inicializando canais de comunicação');
    
    // Buscar canais ativos do banco de dados
    const { data: activeChannels, error } = await supabaseAdmin
      .from('channels')
      .select('*')
      .eq('status', 'active');
    
    if (error) {
      throw new Error(`Erro ao buscar canais ativos: ${error.message}`);
    }
    
    if (!activeChannels || activeChannels.length === 0) {
      logger.warn('Nenhum canal ativo encontrado');
      channelsInitialized = true;
      return true;
    }
    
    logger.info(`${activeChannels.length} canais ativos encontrados`);
    
    // Inicializar cada canal
    for (const channel of activeChannels) {
      await initializeChannel(channel);
    }
    
    // Emitir evento de inicialização de canais
    await events.emit('system.maintenance', {
      action: 'channels_initialized',
      count: activeChannels.length
    }, 'system');
    
    channelsInitialized = true;
    logger.info('Canais de comunicação inicializados com sucesso');
    return true;
  } catch (error) {
    logger.error('Erro ao inicializar canais de comunicação', { error });
    return false;
  }
}

/**
 * Inicializa um canal específico
 */
async function initializeChannel(channel: Channel) {
  try {
    logger.info(`Inicializando canal: ${channel.name} (${channel.type})`, { channelId: channel.id });
    
    // Verificar configurações do canal
    if (!channel.config) {
      logger.error(`Canal ${channel.name} não possui configurações definidas`, { channelId: channel.id });
      return false;
    }
    
    // Verificar status do canal
    if (channel.status !== 'active') {
      logger.info(`Canal ${channel.name} não está ativo, ignorando inicialização`, { 
        channelId: channel.id,
        status: channel.status 
      });
      return false;
    }
    
    // Emitir evento de canal inicializado
    await events.emit('system.maintenance', {
      action: 'channel_initialized',
      channelId: channel.id,
      channelType: channel.type,
      channelName: channel.name
    }, 'system');
    
    logger.info(`Canal ${channel.name} inicializado com sucesso`, { channelId: channel.id });
    return true;
  } catch (error) {
    logger.error(`Erro ao inicializar canal ${channel.name}`, { channelId: channel.id, error });
    return false;
  }
} 