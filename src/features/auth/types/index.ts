import { User } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Tipos básicos para autenticação
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdateRequest {
  newPassword: string;
}

// Tipo para resposta de serviços de autenticação
export interface AuthServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Tipo para o usuário autenticado com informações adicionais
export interface AuthenticatedUser extends User {
  profile?: {
    id: string;
    name: string;
    avatar_url?: string;
    role: 'admin' | 'manager' | 'agent';
    department?: string;
  };
}

// Tipos específicos do Supabase
export type DbProfile = Database['public']['Tables']['profiles']['Row']; 