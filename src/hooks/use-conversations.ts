'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchConversations, 
  fetchConversationById, 
  createConversation, 
  editConversation,
  sendMessageToConversation
} from '../app/actions/conversation-actions';
import type { 
  CreateConversationInput, 
  UpdateConversationInput,
  SendMessageInput,
  ConversationWithMessages
} from '../types/conversations';

/**
 * Custom hook for managing conversations
 */
export function useConversations() {
  const queryClient = useQueryClient();

  // Fetch all conversations
  const { 
    data: conversations = [], 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => fetchConversations(),
  });

  // Create a new conversation
  const createMutation = useMutation({
    mutationFn: (data: CreateConversationInput) => createConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  // Update an existing conversation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateConversationInput }) => 
      editConversation(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation', variables.id] });
    },
  });

  // Send a message to a conversation
  const sendMessageMutation = useMutation({
    mutationFn: ({ conversationId, data }: { conversationId: string; data: SendMessageInput }) => 
      sendMessageToConversation(conversationId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversation', variables.conversationId] });
    },
  });

  return {
    conversations,
    isLoading,
    error,
    refetch,
    createConversation: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateConversation: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
  };
}

/**
 * Custom hook for managing a single conversation
 */
export function useConversation(id: string) {
  const queryClient = useQueryClient();

  // Fetch a single conversation with messages
  const { 
    data: conversation,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['conversation', id],
    queryFn: () => fetchConversationById(id),
    enabled: !!id,
  });

  // Update the conversation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateConversationInput) => editConversation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', id] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  // Send a message to the conversation
  const sendMessageMutation = useMutation({
    mutationFn: (data: SendMessageInput) => sendMessageToConversation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', id] });
    },
  });

  return {
    conversation,
    isLoading,
    error,
    refetch,
    updateConversation: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
  };
}
