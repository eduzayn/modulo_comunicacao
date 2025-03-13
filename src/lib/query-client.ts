/**
 * Optimized React Query client configuration
 * 
 * This file provides a configured QueryClient with optimized
 * caching and stale-time settings.
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Create a configured QueryClient with optimized settings
 */
export const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      suspense: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Query key factory to ensure consistent keys across the application
 */
export const queryKeys = {
  channels: {
    all: ['channels'] as const,
    detail: (id: string) => ['channels', id] as const,
    byType: (type: string) => ['channels', 'type', type] as const,
  },
  conversations: {
    all: ['conversations'] as const,
    detail: (id: string) => ['conversations', id] as const,
    messages: (id: string) => ['conversations', id, 'messages'] as const,
    byStatus: (status: string) => ['conversations', 'status', status] as const,
  },
  templates: {
    all: ['templates'] as const,
    detail: (id: string) => ['templates', id] as const,
    byType: (type: string) => ['templates', 'type', type] as const,
  },
  ai: {
    settings: ['ai', 'settings'] as const,
    suggestions: (messageId: string) => ['ai', 'suggestions', messageId] as const,
    sentiment: (messageId: string) => ['ai', 'sentiment', messageId] as const,
  },
  user: {
    profile: ['user', 'profile'] as const,
    apiKeys: ['user', 'apiKeys'] as const,
  },
};
