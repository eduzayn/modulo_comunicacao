'use server';

/**
 * auth.ts
 * 
 * Server actions para autenticação utilizando Supabase.
 * Fornece operações seguras de autenticação com validação.
 */

import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase';
import { appErrors } from '@/services/api';

// Tipo padronizado para respostas de actions
export type ActionResponse<T = any> = { 
  success: true; 
  data: T;
  message?: string;
} | { 
  success: false; 
  error: { 
    message: string;
    code?: string;
  } 
};

// Cliente para ações seguras
export const action = createSafeActionClient({
  // Personalizado para o tipo de resposta da aplicação
  handleReturnedServerError(error) {
    if (error.name === 'AppError') {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.status.toString()
        }
      };
    }

    // Erro genérico para qualquer outro erro
    return {
      success: false,
      error: {
        message: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        code: 'INTERNAL_ERROR'
      }
    };
  },
});

// Schema para validação de login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
});

// Action para login
export const loginAction = action
  .schema(loginSchema)
  .action(async ({ email, password }): Promise<ActionResponse> => {
    try {
      // Criar cliente do Supabase no servidor
      const supabase = createServerSupabaseClient();
      
      // Tentar fazer login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return {
          success: false,
          error: {
            message: error.message,
            code: error.status ? error.status.toString() : 'AUTH_ERROR'
          }
        };
      }
      
      // Verificar se a conta está ativa após o login
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user?.id)
        .single();
      
      if (userError || !userData) {
        return {
          success: false,
          error: {
            message: 'Não foi possível obter os dados do usuário',
            code: 'USER_NOT_FOUND'
          }
        };
      }
      
      if (!userData.is_active) {
        // Fazer logout pois a conta está inativa
        await supabase.auth.signOut();
        
        return {
          success: false,
          error: {
            message: 'Sua conta está desativada. Entre em contato com o administrador.',
            code: 'ACCOUNT_INACTIVE'
          }
        };
      }
      
      // Registrar último login
      await supabase
        .from('users')
        .update({ last_sign_in: new Date().toISOString() })
        .eq('id', data.user?.id);
      
      return {
        success: true,
        data: { userId: data.user?.id },
        message: 'Login realizado com sucesso'
      };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        error: {
          message: 'Ocorreu um erro ao tentar fazer login',
          code: 'AUTH_ERROR'
        }
      };
    }
  });

// Schema para validação de logout
const logoutSchema = z.object({});

// Action para logout
export const logoutAction = action
  .schema(logoutSchema)
  .action(async (): Promise<ActionResponse> => {
    try {
      // Criar cliente do Supabase no servidor
      const supabase = createServerSupabaseClient();
      
      // Fazer logout
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return {
          success: false,
          error: {
            message: error.message,
            code: error.status ? error.status.toString() : 'LOGOUT_ERROR'
          }
        };
      }
      
      return {
        success: true,
        data: null,
        message: 'Logout realizado com sucesso'
      };
    } catch (error) {
      console.error('Erro no logout:', error);
      return {
        success: false,
        error: {
          message: 'Ocorreu um erro ao tentar fazer logout',
          code: 'LOGOUT_ERROR'
        }
      };
    }
  });

// Schema para validação de recuperação de senha
const resetPasswordSchema = z.object({
  email: z.string().email('Email inválido')
});

// Action para recuperação de senha
export const resetPasswordAction = action
  .schema(resetPasswordSchema)
  .action(async ({ email }): Promise<ActionResponse> => {
    try {
      // Criar cliente do Supabase no servidor
      const supabase = createServerSupabaseClient();
      
      // Verificar se o email existe na base
      const { data: userExists, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();
      
      if (userError && userError.code !== 'PGRST116') {
        return {
          success: false,
          error: {
            message: 'Erro ao verificar usuário',
            code: 'USER_CHECK_ERROR'
          }
        };
      }
      
      if (!userExists) {
        // Por segurança, não informamos se o email existe ou não
        return {
          success: true,
          data: null,
          message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha'
        };
      }
      
      // Enviar email de recuperação de senha
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
      });
      
      if (error) {
        return {
          success: false,
          error: {
            message: error.message,
            code: error.status ? error.status.toString() : 'RESET_ERROR'
          }
        };
      }
      
      return {
        success: true,
        data: null,
        message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha'
      };
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      return {
        success: false,
        error: {
          message: 'Ocorreu um erro ao tentar recuperar a senha',
          code: 'RESET_ERROR'
        }
      };
    }
  });

// Schema para validação de alteração de senha
const changePasswordSchema = z.object({
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'A confirmação de senha deve ter pelo menos 6 caracteres')
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
});

// Action para alteração de senha
export const changePasswordAction = action
  .schema(changePasswordSchema)
  .action(async ({ password }): Promise<ActionResponse> => {
    try {
      // Criar cliente do Supabase no servidor
      const supabase = createServerSupabaseClient();
      
      // Obter sessão atual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        return {
          success: false,
          error: {
            message: 'Sessão inválida ou expirada',
            code: 'INVALID_SESSION'
          }
        };
      }
      
      // Alterar senha
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) {
        return {
          success: false,
          error: {
            message: error.message,
            code: error.status ? error.status.toString() : 'PASSWORD_CHANGE_ERROR'
          }
        };
      }
      
      return {
        success: true,
        data: null,
        message: 'Senha alterada com sucesso'
      };
    } catch (error) {
      console.error('Erro na alteração de senha:', error);
      return {
        success: false,
        error: {
          message: 'Ocorreu um erro ao tentar alterar a senha',
          code: 'PASSWORD_CHANGE_ERROR'
        }
      };
    }
  }); 