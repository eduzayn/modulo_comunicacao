'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getConversations, 
  getConversation, 
  createConversation, 
  addMessage,
  updateConversationStatus
} from '../actions/conversation-actions';
import type { Conversation, Message } from '../../src/modules/communication/types';

export function useConversations() {
  const queryClient = useQueryClient();
  
  const conversationsQuery = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });
  
  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
  
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'open' | 'closed' | 'pending' }) => 
      updateConversationStatus(id, status),
    onSuccess: (data) => {
      if (data.success && data.data) {
        queryClient.setQueryData(['conversations', data.data.id], data.data);
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      }
    },
  });
  
  return {
    conversations: conversationsQuery.data || [],
    isLoading: conversationsQuery.isLoading,
    isError: conversationsQuery.isError,
    error: conversationsQuery.error,
    createConversation: createConversationMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    isCreating: createConversationMutation.isLoading,
    isUpdating: updateStatusMutation.isLoading,
  };
}

export function useConversation(id: string) {
  const queryClient = useQueryClient();
  
  const conversationQuery = useQuery({
    queryKey: ['conversations', id],
    queryFn: () => getConversation(id),
    enabled: !!id,
  });
  
  const addMessageMutation = useMutation({
    mutationFn: (data: any) => addMessage(id, data),
    onSuccess: (data) => {
      if (data.success && data.data) {
        const currentConversation = queryClient.getQueryData<Conversation>(['conversations', id]);
        
        if (currentConversation) {
          queryClient.setQueryData(['conversations', id], {
            ...currentConversation,
            messages: [...(currentConversation.messages || []), data.data],
            updatedAt: new Date(),
          });
        }
        
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      }
    },
  });
  
  const updateStatusMutation = useMutation({
    mutationFn: (status: 'open' | 'closed' | 'pending') => updateConversationStatus(id, status),
    onSuccess: (data) => {
      if (data.success && data.data) {
        queryClient.setQueryData(['conversations', id], data.data);
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      }
    },
  });
  
  return {
    conversation: conversationQuery.data,
    isLoading: conversationQuery.isLoading,
    isError: conversationQuery.isError,
    error: conversationQuery.error,
    addMessage: addMessageMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    isSending: addMessageMutation.isLoading,
    isUpdating: updateStatusMutation.isLoading,
  };
}
