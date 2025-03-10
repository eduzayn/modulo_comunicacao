'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchConversations, 
  fetchConversationById, 
  fetchConversationMessages,
  addConversation, 
  editConversation,
  sendMessageToConversation
} from '../app/actions/conversation-actions';
import type { Conversation } from '../types';
import type { 
  CreateConversationInput, 
  UpdateConversationInput,
  SendMessageInput,
  GetConversationsInput
} from '../types/conversations';

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
  
  const conversationsQuery = useQuery({
    queryKey: ['conversations', params],
    queryFn: () => fetchConversations(params),
  });
  
  const createConversationMutation = useMutation({
    mutationFn: (data: CreateConversationInput) => addConversation(data),
    onSuccess: () => {
      queryClient?.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
  
  return {
    conversations: conversationsQuery.data?.data || [],
    isLoading: conversationsQuery.isLoading,
    isError: conversationsQuery.isError,
    error: conversationsQuery.error || conversationsQuery.data?.error,
    createConversation: createConversationMutation.mutate,
    isCreating: createConversationMutation.isPending,
  };
}

export function useConversation(id: string) {
  const queryClient = useQueryClient();
  
  const conversationQuery = useQuery({
    queryKey: ['conversation', id],
    queryFn: () => fetchConversationById(id),
    enabled: !!id,
  });
  
  const messagesQuery = useQuery({
    queryKey: ['conversation', id, 'messages'],
    queryFn: () => fetchConversationMessages(id),
    enabled: !!id,
  });
  
  const updateConversationMutation = useMutation({
    mutationFn: (data: UpdateConversationInput) => editConversation(id, data),
    onSuccess: (result) => {
      if (result.data) {
        queryClient.setQueryData(['conversation', id], result.data);
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      }
    },
  });
  
  const sendMessageMutation = useMutation({
    mutationFn: (message: SendMessageInput) => sendMessageToConversation(id, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', id, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversation', id] });
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
    conversation: conversationQuery.data?.data,
    messages: messagesQuery.data?.data || [],
    isLoading: conversationQuery.isLoading || messagesQuery.isLoading,
    isError: conversationQuery.isError || messagesQuery.isError,
    error: conversationQuery.error || conversationQuery.data?.error || messagesQuery.error || messagesQuery.data?.error,
    updateConversation: updateConversationMutation.mutate,
    isUpdating: updateConversationMutation.isPending,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    prefetchMessages,
  };
}
