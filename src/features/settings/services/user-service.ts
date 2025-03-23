import { supabase } from '@/lib/supabase/config';
import { Profile } from '@/types/database';
import { TABELAS } from '@/lib/supabase/config';

export const userService = {
  async getProfiles(role?: 'admin' | 'agent' | 'manager') {
    try {
      let query = supabase
        .from(TABELAS.PROFILES)
        .select('*')
        .order('name');
      
      if (role) {
        query = query.eq('role', role);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_PROFILES_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao obter perfis',
        },
      };
    }
  },
  
  async getProfileById(id: string) {
    try {
      const { data, error } = await supabase
        .from(TABELAS.PROFILES)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_PROFILE_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao obter perfil',
        },
      };
    }
  },
  
  async updateProfile(id: string, profile: Partial<Omit<Profile, 'id' | 'created_at'>>) {
    try {
      const { data, error } = await supabase
        .from(TABELAS.PROFILES)
        .update({
          ...profile,
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
          code: 'UPDATE_PROFILE_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao atualizar perfil',
        },
      };
    }
  },
  
  async updateAvatar(id: string, avatarUrl: string) {
    try {
      const { data, error } = await supabase
        .from(TABELAS.PROFILES)
        .update({
          avatar_url: avatarUrl,
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
          code: 'UPDATE_AVATAR_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao atualizar avatar',
        },
      };
    }
  },
  
  async changeRole(id: string, role: 'admin' | 'agent' | 'manager') {
    try {
      const { data, error } = await supabase
        .from(TABELAS.PROFILES)
        .update({
          role,
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
          code: 'CHANGE_ROLE_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao alterar função',
        },
      };
    }
  },
  
  async deactivateUser(id: string) {
    try {
      const { data, error } = await supabase
        .from(TABELAS.PROFILES)
        .update({
          is_active: false,
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
          code: 'DEACTIVATE_USER_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao desativar usuário',
        },
      };
    }
  },
  
  async activateUser(id: string) {
    try {
      const { data, error } = await supabase
        .from(TABELAS.PROFILES)
        .update({
          is_active: true,
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
          code: 'ACTIVATE_USER_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao ativar usuário',
        },
      };
    }
  },
  
  async createProfile(profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from(TABELAS.PROFILES)
        .insert({
          ...profile,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CREATE_PROFILE_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao criar perfil',
        },
      };
    }
  },
  
  async getActiveAgents() {
    try {
      const { data, error } = await supabase
        .from(TABELAS.PROFILES)
        .select('*')
        .eq('role', 'agent')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_ACTIVE_AGENTS_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao obter agentes ativos',
        },
      };
    }
  },
  
  async getUserNotificationSettings(userId: string) {
    try {
      const { data, error } = await supabase
        .from(TABELAS.USER_SETTINGS)
        .select('notification_settings')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        // Se não encontrar configurações, criar com valores padrão
        if (error.code === 'PGRST116') { // código para "não encontrado" na API do Supabase
          const defaultSettings = {
            email_notifications: true,
            push_notifications: true,
            sound_enabled: true,
            new_message_alert: true,
            task_reminders: true,
            deal_updates: true,
          };
          
          const { data: newData, error: insertError } = await supabase
            .from(TABELAS.USER_SETTINGS)
            .insert({
              user_id: userId,
              notification_settings: defaultSettings,
              created_at: new Date().toISOString(),
            })
            .select()
            .single();
          
          if (insertError) throw insertError;
          
          return { success: true, data: { notification_settings: defaultSettings } };
        }
        
        throw error;
      }
      
      return { success: true, data: data.notification_settings };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_NOTIFICATION_SETTINGS_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao obter configurações de notificação',
        },
      };
    }
  },
  
  async updateUserNotificationSettings(userId: string, settings: any) {
    try {
      // Verificar se o usuário já tem configurações
      const { data: existingSettings, error: checkError } = await supabase
        .from(TABELAS.USER_SETTINGS)
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      let result;
      
      if (!existingSettings) {
        // Criar novas configurações
        result = await supabase
          .from(TABELAS.USER_SETTINGS)
          .insert({
            user_id: userId,
            notification_settings: settings,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();
      } else {
        // Atualizar configurações existentes
        result = await supabase
          .from(TABELAS.USER_SETTINGS)
          .update({
            notification_settings: settings,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
          .select()
          .single();
      }
      
      if (result.error) throw result.error;
      
      return { success: true, data: result.data.notification_settings };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_NOTIFICATION_SETTINGS_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao atualizar configurações de notificação',
        },
      };
    }
  }
}; 