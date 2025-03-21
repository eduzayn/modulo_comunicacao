/**
 * useMessages.ts
 * 
 * Hooks para gerenciamento de mensagens utilizando TanStack Query.
 * Fornece funcionalidades para buscar, criar, atualizar e excluir mensagens.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MutationConfig, QueryConfig } from '@/lib/react-query';
import { fetchMany, fetchOne, createOne, updateOne, deleteOne } from '@/services/api';
import { Database } from '@/types/supabase';

// Tipos
type Message = Database['public']['Tables']['messages']['Row'];
type MessageInsert = Database['public']['Tables']['messages']['Insert'];
type MessageUpdate = Database['public']['Tables']['messages']['Update'];

// Chaves de query para o TanStack Query
const messageKeys = {
  all: ['messages'] as const,
  lists: () => [...messageKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...messageKeys.lists(), filters] as const,
  details: () => [...messageKeys.all, 'detail'] as const,
  detail: (id: string) => [...messageKeys.details(), id] as const,
};

// HOOKS DE CONSULTA

/**
 * Hook para buscar uma mensagem pelo ID
 */
export function useMessage(
  messageId: string,
  config?: QueryConfig<Message, Error>
) {
  return useQuery<Message, Error>({
    queryKey: messageKeys.detail(messageId),
    queryFn: async () => {
      const response = await fetchOne<Message>('messages', messageId);
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    enabled: !!messageId && (config?.enabled !== false),
    ...config
  });
}

/**
 * Hook para buscar lista de mensagens com filtros opcionais
 */
export function useMessages(
  filters?: {
    sender_id?: string;
    recipient_ids?: string[];
    status?: string;
    priority?: string;
    is_read?: boolean;
    tags?: string[];
  },
  config?: QueryConfig<Message[], Error>
) {
  return useQuery<Message[], Error>({
    queryKey: messageKeys.list(filters || {}),
    queryFn: async () => {
      const response = await fetchMany<Message>('messages', {
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
 * Hook para criar uma nova mensagem
 */
export function useCreateMessage(config?: MutationConfig<Message, Error, MessageInsert>) {
  const queryClient = useQueryClient();

  return useMutation<Message, Error, MessageInsert>({
    mutationFn: async (newMessage) => {
      const response = await createOne<Message>('messages', newMessage);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidar cache para forçar nova busca
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      
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
 * Hook para atualizar uma mensagem existente
 */
export function useUpdateMessage(config?: MutationConfig<Message, Error, { id: string; data: MessageUpdate }>) {
  const queryClient = useQueryClient();

  return useMutation<Message, Error, { id: string; data: MessageUpdate }>({
    mutationFn: async ({ id, data }) => {
      const response = await updateOne<Message>('messages', id, data);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidar cache para forçar nova busca
      queryClient.invalidateQueries({ queryKey: messageKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      
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
 * Hook para marcar uma mensagem como lida
 */
export function useMarkMessageAsRead(config?: MutationConfig<Message, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation<Message, Error, string>({
    mutationFn: async (id) => {
      const response = await updateOne<Message>('messages', id, { is_read: true });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidar cache para forçar nova busca
      queryClient.invalidateQueries({ queryKey: messageKeys.detail(variables) });
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      
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
 * Hook para excluir uma mensagem
 */
export function useDeleteMessage(config?: MutationConfig<Message, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation<Message, Error, string>({
    mutationFn: async (id) => {
      const response = await deleteOne<Message>('messages', id);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidar cache para forçar nova busca
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      queryClient.removeQueries({ queryKey: messageKeys.detail(variables) });
      
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