/**
 * api.ts
 * 
 * Serviço base para chamadas de API utilizando o Supabase.
 * Fornece funções genéricas para operações CRUD e tratamento de erros.
 */

import { supabase } from '@/lib/supabase';
import { ApiResponse } from '@/lib/react-query';
import { Database } from '@/types/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export class AppError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 500, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.details = details;
  }
}

// Erros padronizados para a aplicação
export const appErrors = {
  NOT_AUTHENTICATED: new AppError('Usuário não autenticado.', 401),
  NOT_AUTHORIZED: new AppError('Usuário não autorizado para esta operação.', 403),
  NOT_FOUND: new AppError('Recurso não encontrado.', 404),
  INVALID_DATA: new AppError('Dados inválidos ou incompletos.', 400),
  UNEXPECTED_ERROR: new AppError('Ocorreu um erro inesperado. Tente novamente.', 500),
};

/**
 * Função genérica para processar respostas do Supabase e tratar erros
 */
export async function handleSupabaseResponse<T>(
  promise: Promise<{ data: T | null; error: PostgrestError | null }>
): Promise<ApiResponse<T>> {
  try {
    const { data, error } = await promise;

    if (error) {
      console.error('Erro na operação do Supabase:', error);
      
      // Mapeamento de erros do Supabase para erros da aplicação
      if (error.code === 'PGRST301') {
        return { 
          data: null, 
          error: {
            message: 'Recurso não encontrado.',
            status: 404,
            details: error
          }
        };
      }
      
      if (error.code === 'PGRST204') {
        return { 
          data: null, 
          error: {
            message: 'Proibido. Você não tem permissão para acessar este recurso.',
            status: 403,
            details: error
          }
        };
      }

      return { 
        data: null, 
        error: {
          message: error.message || 'Ocorreu um erro inesperado.',
          status: error.code ? 400 : 500,
          details: error
        }
      };
    }

    if (data === null) {
      return { 
        data: null, 
        error: {
          message: 'Nenhum dado encontrado.',
          status: 404
        }
      };
    }

    return { data, error: null } as ApiResponse<T>;
  } catch (err: any) {
    console.error('Erro inesperado:', err);
    return { 
      data: null, 
      error: {
        message: err.message || 'Ocorreu um erro inesperado ao processar a requisição.',
        status: 500,
        details: err
      }
    };
  }
}

// Funções genéricas para operações CRUD que podem ser reutilizadas pelos serviços

export async function fetchOne<T>(
  table: keyof Database['public']['Tables'],
  id: string
): Promise<ApiResponse<T>> {
  return handleSupabaseResponse<T>(
    supabase.from(table).select('*').eq('id', id).single()
  );
}

export async function fetchMany<T>(
  table: keyof Database['public']['Tables'],
  options?: {
    filters?: Record<string, any>;
    select?: string;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    offset?: number;
  }
): Promise<ApiResponse<T[]>> {
  let query = supabase.from(table).select(options?.select || '*');

  // Aplicar filtros
  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else {
          query = query.eq(key, value);
        }
      }
    });
  }

  // Aplicar ordenação
  if (options?.orderBy) {
    const { column, ascending = true } = options.orderBy;
    query = query.order(column, { ascending });
  }

  // Aplicar paginação
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  return handleSupabaseResponse<T[]>(query);
}

export async function createOne<T>(
  table: keyof Database['public']['Tables'],
  data: any
): Promise<ApiResponse<T>> {
  return handleSupabaseResponse<T>(
    supabase.from(table).insert(data).select().single()
  );
}

export async function updateOne<T>(
  table: keyof Database['public']['Tables'],
  id: string,
  data: any
): Promise<ApiResponse<T>> {
  return handleSupabaseResponse<T>(
    supabase.from(table).update(data).eq('id', id).select().single()
  );
}

export async function deleteOne<T>(
  table: keyof Database['public']['Tables'],
  id: string
): Promise<ApiResponse<T>> {
  return handleSupabaseResponse<T>(
    supabase.from(table).delete().eq('id', id).select().single()
  );
} 