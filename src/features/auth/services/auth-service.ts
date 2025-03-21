import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/config';
import { 
  LoginCredentials, 
  RegisterCredentials, 
  AuthServiceResponse, 
  AuthenticatedUser 
} from '../types';
import { TABELAS } from '@/lib/supabase/config';

// Esquemas de validação
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  fullName: z.string().min(3, "Nome completo é obrigatório"),
});

const emailSchema = z.object({
  email: z.string().email("Email inválido")
});

const passwordSchema = z.object({
  newPassword: z.string().min(6, "Nova senha deve ter pelo menos 6 caracteres")
});

const actionClient = createSafeActionClient();

export const authService = {
  // Login usando email e senha
  login: actionClient
    .schema(loginSchema)
    .action(async ({ parsedInput }): Promise<AuthServiceResponse> => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: parsedInput.email,
          password: parsedInput.password,
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
    }),

  // Registro de novos usuários
  register: actionClient
    .schema(registerSchema)
    .action(async ({ parsedInput }): Promise<AuthServiceResponse> => {
      try {
        // Primeiro, cria o usuário
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: parsedInput.email,
          password: parsedInput.password,
        });
        
        if (authError) throw authError;
        
        // Depois, insere o perfil
        if (authData.user) {
          const { error: profileError } = await supabase
            .from(TABELAS.PROFILES)
            .insert({
              id: authData.user.id,
              name: parsedInput.fullName,
              email: parsedInput.email,
              role: 'agent', // Papel padrão
              is_active: true,
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
    }),

  // Logout
  logout: actionClient
    .action(async (): Promise<AuthServiceResponse> => {
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
    }),

  // Solicitação de reset de senha
  resetPassword: actionClient
    .schema(emailSchema)
    .action(async ({ parsedInput }): Promise<AuthServiceResponse> => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(parsedInput.email, {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
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
    }),

  // Atualização de senha
  updatePassword: actionClient
    .schema(passwordSchema)
    .action(async ({ parsedInput }): Promise<AuthServiceResponse> => {
      try {
        const { error } = await supabase.auth.updateUser({
          password: parsedInput.newPassword,
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
    }),

  // Obter usuário atual (com dados de perfil)
  async getCurrentUser(): Promise<AuthServiceResponse<AuthenticatedUser | null>> {
    try {
      // Obter dados de sessão
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      if (!sessionData.session) return { success: true, data: null };
      
      // Obter dados de usuário
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!userData.user) return { success: true, data: null };
      
      // Obter dados de perfil
      const { data: profileData, error: profileError } = await supabase
        .from(TABELAS.PROFILES)
        .select('*')
        .eq('id', userData.user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') throw profileError;
      
      // Montar o objeto de usuário autenticado
      const authenticatedUser: AuthenticatedUser = {
        ...userData.user,
        profile: profileData ? {
          id: profileData.id,
          name: profileData.name,
          avatar_url: profileData.avatar_url,
          role: profileData.role,
          department: profileData.department,
        } : undefined
      };
      
      return { success: true, data: authenticatedUser };
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