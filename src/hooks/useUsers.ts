/**
 * useUsers.ts
 * 
 * Hooks para gerenciamento de usuários utilizando TanStack Query.
 * Fornece funcionalidades para buscar, criar, atualizar e excluir usuários.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiResponse, MutationConfig, QueryConfig } from '@/lib/react-query';
import { fetchMany, fetchOne, createOne, updateOne, deleteOne, appErrors } from '@/services/api';
import { Database } from '@/types/supabase';

// Tipos
type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

// Chaves de query para o TanStack Query
const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// HOOKS DE CONSULTA

/**
 * Hook para buscar um usuário pelo ID
 */
export function useUser(
  userId: string,
  config?: QueryConfig<User, Error>
) {
  return useQuery<User, Error>({
    queryKey: userKeys.detail(userId),
    queryFn: async () => {
      const response = await fetchOne<User>('users', userId);
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    enabled: !!userId && (config?.enabled !== false),
    ...config
  });
}

/**
 * Hook para buscar lista de usuários com filtros opcionais
 */
export function useUsers(
  filters?: Record<string, any>,
  config?: QueryConfig<User[], Error>
) {
  return useQuery<User[], Error>({
    queryKey: userKeys.list(filters || {}),
    queryFn: async () => {
      const response = await fetchMany<User>('users', { 
        filters,
        orderBy: { column: 'created_at', ascending: false }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    },
    ...config
  });
}

// HOOKS DE MUTAÇÃO

/**
 * Hook para criar um novo usuário
 */
export function useCreateUser(config?: MutationConfig<User, Error, UserInsert>) {
  const queryClient = useQueryClient();

  return useMutation<User, Error, UserInsert>({
    mutationFn: async (newUser) => {
      const response = await createOne<User>('users', newUser);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidar cache para forçar nova busca
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      
      if (config?.onSuccess) {
        config.onSuccess(data, variables);
      }
    },
    onError: (error, variables) => {
      if (config?.onError) {
        config.onError(error, variables);
      }
    },
  });
}

/**
 * Hook para atualizar um usuário existente
 */
export function useUpdateUser(config?: MutationConfig<User, Error, { id: string; data: UserUpdate }>) {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: string; data: UserUpdate }>({
    mutationFn: async ({ id, data }) => {
      const response = await updateOne<User>('users', id, data);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidar cache para forçar nova busca
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      
      if (config?.onSuccess) {
        config.onSuccess(data, variables);
      }
    },
    onError: (error, variables) => {
      if (config?.onError) {
        config.onError(error, variables);
      }
    },
  });
}

/**
 * Hook para excluir um usuário
 */
export function useDeleteUser(config?: MutationConfig<User, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation<User, Error, string>({
    mutationFn: async (id) => {
      const response = await deleteOne<User>('users', id);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidar cache para forçar nova busca
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.removeQueries({ queryKey: userKeys.detail(variables) });
      
      if (config?.onSuccess) {
        config.onSuccess(data, variables);
      }
    },
    onError: (error, variables) => {
      if (config?.onError) {
        config.onError(error, variables);
      }
    },
  });
} 