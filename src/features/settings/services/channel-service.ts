import { supabase } from '@/lib/supabase/config';
import { Channel, ChannelConfig } from '@/types/database';
import { TABELAS } from '@/lib/supabase/config';

export const channelService = {
  async getChannels() {
    try {
      const { data, error } = await supabase
        .from(TABELAS.CHANNELS)
        .select('*')
        .order('name');
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_CHANNELS_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao obter canais',
        },
      };
    }
  },
  
  async getChannelById(id: string) {
    try {
      const { data, error } = await supabase
        .from(TABELAS.CHANNELS)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_CHANNEL_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao obter canal',
        },
      };
    }
  },
  
  async createChannel(channel: Omit<Channel, 'id' | 'created_at'>) {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from(TABELAS.CHANNELS)
        .insert({
          ...channel,
          created_at: now,
        })
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CREATE_CHANNEL_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao criar canal',
        },
      };
    }
  },
  
  async updateChannel(id: string, channel: Partial<Omit<Channel, 'id' | 'created_at'>>) {
    try {
      const { data, error } = await supabase
        .from(TABELAS.CHANNELS)
        .update({
          ...channel,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_CHANNEL_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao atualizar canal',
        },
      };
    }
  },
  
  async deleteChannel(id: string) {
    try {
      const { error } = await supabase
        .from(TABELAS.CHANNELS)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'DELETE_CHANNEL_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao excluir canal',
        },
      };
    }
  },
  
  async getChannelConfig(channelId: string) {
    try {
      const { data, error } = await supabase
        .from(TABELAS.CHANNEL_CONFIGS)
        .select('*')
        .eq('channel_id', channelId)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_CHANNEL_CONFIG_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao obter configuração do canal',
        },
      };
    }
  },
  
  async updateChannelConfig(channelId: string, config: Partial<Omit<ChannelConfig, 'id' | 'channel_id' | 'created_at'>>) {
    try {
      // Verificar se a configuração já existe
      const { data: existingConfig, error: checkError } = await supabase
        .from(TABELAS.CHANNEL_CONFIGS)
        .select('id')
        .eq('channel_id', channelId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      let result;
      
      if (!existingConfig) {
        // Criar nova configuração
        result = await supabase
          .from(TABELAS.CHANNEL_CONFIGS)
          .insert({
            channel_id: channelId,
            ...config,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();
      } else {
        // Atualizar configuração existente
        result = await supabase
          .from(TABELAS.CHANNEL_CONFIGS)
          .update({
            ...config,
            updated_at: new Date().toISOString(),
          })
          .eq('channel_id', channelId)
          .select()
          .single();
      }
      
      if (result.error) throw result.error;
      
      return { success: true, data: result.data };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_CHANNEL_CONFIG_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao atualizar configuração do canal',
        },
      };
    }
  },
  
  async toggleChannelStatus(id: string, active: boolean) {
    try {
      const { data, error } = await supabase
        .from(TABELAS.CHANNELS)
        .update({
          is_active: active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'TOGGLE_CHANNEL_STATUS_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao alterar status do canal',
        },
      };
    }
  },
  
  async getActiveChannels() {
    try {
      const { data, error } = await supabase
        .from(TABELAS.CHANNELS)
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_ACTIVE_CHANNELS_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao obter canais ativos',
        },
      };
    }
  },
  
  async getChannelByType(type: string) {
    try {
      const { data, error } = await supabase
        .from(TABELAS.CHANNELS)
        .select('*')
        .eq('type', type)
        .eq('is_active', true);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_CHANNEL_BY_TYPE_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao obter canal por tipo',
        },
      };
    }
  },
  
  async getChannelTemplates(channelId: string) {
    try {
      const { data, error } = await supabase
        .from(TABELAS.MESSAGE_TEMPLATES)
        .select('*')
        .eq('channel_id', channelId)
        .order('name');
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_CHANNEL_TEMPLATES_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao obter templates do canal',
        },
      };
    }
  },
  
  async createMessageTemplate(template: { channel_id: string; name: string; content: string; variables?: any }) {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from(TABELAS.MESSAGE_TEMPLATES)
        .insert({
          ...template,
          created_at: now,
        })
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CREATE_TEMPLATE_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao criar template de mensagem',
        },
      };
    }
  },
  
  async updateMessageTemplate(id: string, template: Partial<{ name: string; content: string; variables?: any }>) {
    try {
      const { data, error } = await supabase
        .from(TABELAS.MESSAGE_TEMPLATES)
        .update({
          ...template,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_TEMPLATE_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao atualizar template de mensagem',
        },
      };
    }
  },
  
  async deleteMessageTemplate(id: string) {
    try {
      const { error } = await supabase
        .from(TABELAS.MESSAGE_TEMPLATES)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'DELETE_TEMPLATE_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao excluir template de mensagem',
        },
      };
    }
  }
}; 