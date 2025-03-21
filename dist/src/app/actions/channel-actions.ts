/**
 * channel-actions.ts
 * 
 * Description: Server actions for channel operations
 * 
 * @module app/actions/channel-actions
 * @author Devin AI
 * @created 2025-03-12
 */
'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { Channel, CreateChannelInput, UpdateChannelInput } from '@/types/channels';
import { events } from '@/lib/events';

const CHANNEL_TABLE = 'communication.channels';

/**
 * Fetch channels
 * 
 * @param params - Query parameters
 * @returns Channels data and error
 */
export async function getChannels(params: Record<string, string> = {}) {
  try {
    let query = supabaseAdmin
      .from(CHANNEL_TABLE)
      .select('*');
    
    // Aplicar filtros se fornecidos
    if (params.status) {
      query = query.eq('status', params.status);
    }
    
    if (params.type) {
      query = query.eq('type', params.type);
    }
    
    // Ordenar por data de criação (mais recentes primeiro)
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return { data: data as Channel[], error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Erro ao buscar canais', { error: errorMessage });
    return { data: null, error: errorMessage };
  }
}

/**
 * Fetch channel by ID
 * 
 * @param id - Channel ID
 * @returns Channel data and error
 */
export async function getChannelById(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from(CHANNEL_TABLE)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { data: data as Channel, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Erro ao buscar canal por ID', { id, error: errorMessage });
    return { data: null, error: errorMessage };
  }
}

/**
 * Create channel
 * 
 * @param data - Channel data to create
 * @returns Created channel data and error
 */
export async function createChannel(data: CreateChannelInput) {
  try {
    const channelData = {
      name: data.name,
      type: data.type,
      status: data.status || 'active',
      config: data.config || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: newChannel, error } = await supabaseAdmin
      .from(CHANNEL_TABLE)
      .insert(channelData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Emitir evento de canal criado
    await events.emit('system.maintenance', {
      action: 'channel_created',
      channelId: newChannel.id,
      channelType: newChannel.type
    }, 'channel_management');
    
    revalidatePath('/communication');
    revalidatePath('/settings');
    
    return { data: newChannel as Channel, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Erro ao criar canal', { channelData: data, error: errorMessage });
    return { data: null, error: errorMessage };
  }
}

/**
 * Update channel
 * 
 * @param id - Channel ID
 * @param data - Channel data to update
 * @returns Updated channel data and error
 */
export async function updateChannel(id: string, data: UpdateChannelInput) {
  try {
    const channelData = {
      ...data,
      updated_at: new Date().toISOString()
    };
    
    const { data: updatedChannel, error } = await supabaseAdmin
      .from(CHANNEL_TABLE)
      .update(channelData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Emitir evento de canal atualizado
    await events.emit('system.maintenance', {
      action: 'channel_updated',
      channelId: updatedChannel.id,
      channelType: updatedChannel.type
    }, 'channel_management');
    
    revalidatePath(`/communication`);
    revalidatePath(`/settings`);
    
    return { data: updatedChannel as Channel, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Erro ao atualizar canal', { id, data, error: errorMessage });
    return { data: null, error: errorMessage };
  }
}

/**
 * Delete channel
 * 
 * @param id - Channel ID
 * @returns Success status and error
 */
export async function deleteChannel(id: string) {
  try {
    // Buscar dados do canal antes de excluir (para emitir evento)
    const { data: channelBeforeDelete } = await supabaseAdmin
      .from(CHANNEL_TABLE)
      .select('id, type')
      .eq('id', id)
      .single();
    
    const { error } = await supabaseAdmin
      .from(CHANNEL_TABLE)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Emitir evento de canal excluído
    if (channelBeforeDelete) {
      await events.emit('system.maintenance', {
        action: 'channel_deleted',
        channelId: channelBeforeDelete.id,
        channelType: channelBeforeDelete.type
      }, 'channel_management');
    }
    
    revalidatePath('/communication');
    revalidatePath('/settings');
    
    return { success: true, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Erro ao excluir canal', { id, error: errorMessage });
    return { success: false, error: errorMessage };
  }
}
