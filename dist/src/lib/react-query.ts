/**
 * react-query.ts
 * 
 * Configuração do TanStack Query para gerenciamento de estado e cache na aplicação.
 * Fornece um provedor padrão e configurações otimizadas.
 */

import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

// Configurações padrão do QueryClient
const defaultOptions = {
  queries: {
    staleTime: 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
    refetchOnWindowFocus: false,
  },
};

// Função para criar um novo QueryClient com as configurações padrão
export const getQueryClient = cache(() => new QueryClient({ defaultOptions }));

// Tipos comuns para os hooks de query
export type QueryConfig<TData, TError> = {
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  retry?: boolean | number;
  enabled?: boolean;
  initialData?: TData;
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
};

// Tipo para os hooks de mutação
export type MutationConfig<TData, TError, TVariables> = {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void;
};

// Tipo para respostas de API
export type ApiResponse<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: {
    message: string;
    status?: number;
    details?: unknown;
  };
}; 