'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Conversation } from '@/types';
import type { 
  CreateConversationInput, 
  UpdateConversationInput,
  SendMessageInput,
  GetConversationsInput
} from '@/types/conversations';

// Create a function to get the query client
const getQueryClient = () => {
  try {
    return useQueryClient();
  } catch (error) {
    console.error('Error getting QueryClient:', error);
    return null;
  }
};

export function useConversations(params?: GetConversationsInput) {
  // Get the query client safely
  const queryClient = getQueryClient();
  
  const queryString = params 
    ? `?${Object.entries(params)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join('&')}`
    : '';
  
  const conversationsQuery = useQuery({
    queryKey: ['conversations', params],
    queryFn: async () => {
      const response = await fetch(`/api/communication/conversations${queryString}`);
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      return response.json() as Promise<Conversation[]>;
    },
  });
  
  const createConversationMutation = useMutation({
    mutationFn: async (data: CreateConversationInput) => {
      const response = await fetch('/api/communication/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create conversation');
      }
      
      return response.json() as Promise<Conversation>;
    },
    onSuccess: () => {
      queryClient?.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
  
  return {
    conversations: conversationsQuery.data || [],
    isLoading: conversationsQuery.isLoading,
    isError: conversationsQuery.isError,
    error: conversationsQuery.error,
    createConversation: createConversationMutation.mutate,
    isCreating: createConversationMutation.isPending,
  };
}

export function useConversation(id: string) {
  const queryClient = useQueryClient();
  
  const conversationQuery = useQuery({
    queryKey: ['conversation', id],
    queryFn: async () => {
      const response = await fetch(`/api/communication/conversations/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }
      return response.json() as Promise<Conversation>;
    },
    enabled: !!id,
  });
  
  const updateConversationMutation = useMutation({
    mutationFn: async (data: UpdateConversationInput) => {
      const response = await fetch(`/api/communication/conversations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update conversation');
      }
      
      return response.json() as Promise<Conversation>;
    },
    onSuccess: (data) => {
      queryClient?.setQueryData(['conversation', id], data);
      queryClient?.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
  
  const sendMessageMutation = useMutation({
    mutationFn: async (data: SendMessageInput) => {
      const response = await fetch(`/api/communication/conversations/${id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient?.invalidateQueries({ queryKey: ['conversation', id] });
      queryClient?.invalidateQueries({ queryKey: ['messages', id] });
    },
  });
  
  // Add prefetch function for messages
  const prefetchMessages = async (conversationId: string = id) => {
    if (!conversationId || !queryClient) return;
    
    await queryClient.prefetchQuery({
      queryKey: ['messages', conversationId],
      queryFn: async () => {
        const response = await fetch(`/api/communication/conversations/${conversationId}/messages`);
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        return response.json();
      },
    });
  };
  
  return {
    conversation: conversationQuery.data,
    isLoading: conversationQuery.isLoading,
    isError: conversationQuery.isError,
    error: conversationQuery.error,
    updateConversation: updateConversationMutation.mutate,
    isUpdating: updateConversationMutation.isPending,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    prefetchMessages,
  };
}
