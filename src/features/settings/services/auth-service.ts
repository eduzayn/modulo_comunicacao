import { supabase } from '@/lib/supabase/config';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;
}

export const authService = {
  async login({ email, password }: LoginCredentials) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: error instanceof Error ? error.message : 'Falha na autenticação',
        },
      };
    }
  },

  async register({ email, password, fullName }: RegisterCredentials) {
    try {
      // Primeiro, cria o usuário
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      // Depois, insere o perfil
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: fullName,
            status: 'ativo',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        
        if (profileError) throw profileError;
      }
      
      return { success: true, data: authData };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'REGISTER_ERROR',
          message: error instanceof Error ? error.message : 'Falha no registro',
        },
      };
    }
  },

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'LOGOUT_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao sair',
        },
      };
    }
  },

  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'RESET_PASSWORD_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao recuperar senha',
        },
      };
    }
  },

  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_PASSWORD_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao atualizar senha',
        },
      };
    }
  },

  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { success: true, data: data.user };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_USER_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao obter usuário atual',
        },
      };
    }
  }
}; 