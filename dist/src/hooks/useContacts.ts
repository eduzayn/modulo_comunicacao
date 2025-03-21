/**
 * useContacts.ts
 * 
 * Hooks para gerenciamento de contatos utilizando TanStack Query.
 * Fornece funcionalidades para buscar, criar, atualizar e excluir contatos.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MutationConfig, QueryConfig } from '@/lib/react-query';
import { fetchMany, fetchOne, createOne, updateOne, deleteOne } from '@/services/api';
import { Database } from '@/types/supabase';

// Tipos
type Contact = Database['public']['Tables']['contacts']['Row'];
type ContactInsert = Database['public']['Tables']['contacts']['Insert'];
type ContactUpdate = Database['public']['Tables']['contacts']['Update'];

// Chaves de query para o TanStack Query
const contactKeys = {
  all: ['contacts'] as const,
  lists: () => [...contactKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...contactKeys.lists(), filters] as const,
  details: () => [...contactKeys.all, 'detail'] as const,
  detail: (id: string) => [...contactKeys.details(), id] as const,
};

// HOOKS DE CONSULTA

/**
 * Hook para buscar um contato pelo ID
 */
export function useContact(
  contactId: string,
  config?: QueryConfig<Contact, Error>
) {
  return useQuery<Contact, Error>({
    queryKey: contactKeys.detail(contactId),
    queryFn: async () => {
      const response = await fetchOne<Contact>('contacts', contactId);
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    enabled: !!contactId && (config?.enabled !== false),
    ...config
  });
}

/**
 * Hook para buscar lista de contatos com filtros opcionais
 */
export function useContacts(
  filters?: {
    user_id?: string;
    company?: string;
    tags?: string[];
    is_favorite?: boolean;
  },
  config?: QueryConfig<Contact[], Error>
) {
  return useQuery<Contact[], Error>({
    queryKey: contactKeys.list(filters || {}),
    queryFn: async () => {
      const response = await fetchMany<Contact>('contacts', {
        filters,
        orderBy: { column: 'full_name', ascending: true }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    },
    ...config
  });
}

/**
 * Hook para buscar contatos favoritos
 */
export function useFavoriteContacts(
  userId: string,
  config?: QueryConfig<Contact[], Error>
) {
  return useContacts(
    { user_id: userId, is_favorite: true },
    config
  );
}

// HOOKS DE MUTAÇÃO

/**
 * Hook para criar um novo contato
 */
export function useCreateContact(config?: MutationConfig<Contact, Error, ContactInsert>) {
  const queryClient = useQueryClient();

  return useMutation<Contact, Error, ContactInsert>({
    mutationFn: async (newContact) => {
      const response = await createOne<Contact>('contacts', newContact);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidar cache para forçar nova busca
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      
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
 * Hook para atualizar um contato existente
 */
export function useUpdateContact(config?: MutationConfig<Contact, Error, { id: string; data: ContactUpdate }>) {
  const queryClient = useQueryClient();

  return useMutation<Contact, Error, { id: string; data: ContactUpdate }>({
    mutationFn: async ({ id, data }) => {
      const response = await updateOne<Contact>('contacts', id, data);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidar cache para forçar nova busca
      queryClient.invalidateQueries({ queryKey: contactKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      
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
 * Hook para alternar um contato como favorito
 */
export function useToggleFavoriteContact(config?: MutationConfig<Contact, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation<Contact, Error, string>({
    mutationFn: async (id) => {
      // Buscar o contato atual para inverter o valor de is_favorite
      const currentResponse = await fetchOne<Contact>('contacts', id);
      
      if (currentResponse.error) {
        throw new Error(currentResponse.error.message);
      }
      
      const currentContact = currentResponse.data;
      const newFavoriteStatus = !currentContact.is_favorite;
      
      // Atualizar o status de favorito
      const response = await updateOne<Contact>('contacts', id, { 
        is_favorite: newFavoriteStatus 
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidar cache para forçar nova busca
      queryClient.invalidateQueries({ queryKey: contactKeys.detail(variables) });
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      
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
 * Hook para excluir um contato
 */
export function useDeleteContact(config?: MutationConfig<Contact, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation<Contact, Error, string>({
    mutationFn: async (id) => {
      const response = await deleteOne<Contact>('contacts', id);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidar cache para forçar nova busca
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.removeQueries({ queryKey: contactKeys.detail(variables) });
      
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