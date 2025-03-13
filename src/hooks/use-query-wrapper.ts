/**
 * Standardized hook implementation for data fetching
 * 
 * This file provides wrapper hooks for React Query to ensure
 * consistent patterns across the application.
 */

'use client';

import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  UseQueryOptions, 
  UseMutationOptions 
} from '@tanstack/react-query';
import { useDevAuth } from './use-dev-auth';
import { authenticatedJsonFetch } from '@/lib/api-client';

/**
 * Wrapper hook for useQuery with authentication
 */
export function useApiQuery<TData, TError = unknown>(
  queryKey: string[],
  url: string,
  options?: UseQueryOptions<TData, TError, TData>
) {
  const { getAuthHeaders } = useDevAuth();
  
  return useQuery<TData, TError, TData>({
    queryKey,
    queryFn: async () => {
      return authenticatedJsonFetch<TData>(url, {}, getAuthHeaders());
    },
    ...options,
  });
}

/**
 * Wrapper hook for useMutation with authentication
 */
export function useApiMutation<TData, TVariables, TError = unknown>(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  // const queryClient = useQueryClient();
  const { getAuthHeaders } = useDevAuth();
  
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables) => {
      return authenticatedJsonFetch<TData>(
        url,
        {
          method,
          body: JSON.stringify(variables),
        },
        getAuthHeaders()
      );
    },
    ...options,
  });
}

/**
 * Hook for invalidating queries by key pattern
 */
export function useQueryInvalidation() {
  // const queryClient = useQueryClient();
  
  return {
    invalidateQueries: (queryKey: string[]) => {
      return queryClient.invalidateQueries({ queryKey });
    },
    setQueryData: <T>(queryKey: string[], data: T) => {
      return queryClient.setQueryData(queryKey, data);
    },
    getQueryData: <T>(queryKey: string[]) => {
      return queryClient.getQueryData<T>(queryKey);
    },
  };
}

/**
 * Hook for optimistic updates with React Query
 */
export function useOptimisticMutation<TData, TVariables, TError = unknown>(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
  queryKey: string[],
  updateFn: (oldData: TData | undefined, variables: TVariables) => TData,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  // const queryClient = useQueryClient();
  const { getAuthHeaders } = useDevAuth();
  
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables) => {
      return authenticatedJsonFetch<TData>(
        url,
        {
          method,
          body: JSON.stringify(variables),
        },
        getAuthHeaders()
      );
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData<TData>(queryKey);
      
      // Optimistically update to the new value
      queryClient.setQueryData<TData>(queryKey, (old) => updateFn(old, variables));
      
      // Return a context object with the snapshot
      return { previousData };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData<TData>(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey });
    },
    ...options,
  });
}
