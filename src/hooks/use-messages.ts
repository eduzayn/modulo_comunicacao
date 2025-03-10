'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SendMessageInput as ImportedSendMessageInput } from '@/types/conversations';

// Define Message interface since it's not exported from conversations.ts
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'document';
  status: 'sending' | 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// Local version of SendMessageInput for this hook
interface MessageInput {
  content: string;
  type?: string;
}

export function useMessages(conversationId: string) {
  const queryClient = useQueryClient();
  
  const messagesQuery = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const response = await fetch(`/api/communication/conversations/${conversationId}/messages`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      return response.json() as Promise<Message[]>;
    },
    enabled: !!conversationId,
    staleTime: 1000 * 30, // 30 seconds for messages
  });
  
  const sendMessageMutation = useMutation({
    mutationFn: async (data: MessageInput) => {
      const response = await fetch(`/api/communication/conversations/${conversationId}/messages`, {
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
      
      return response.json() as Promise<Message>;
    },
    onMutate: async (newMessageData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['messages', conversationId] });
      
      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData<Message[]>(['messages', conversationId]) || [];
      
      // Optimistically update to the new value
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId,
        senderId: 'current-user', // Assuming current user is sending
        content: newMessageData.content,
        type: (newMessageData.type as 'text' | 'image' | 'file' | 'audio' | 'document') || 'text',
        status: 'sending',
        createdAt: new Date(),
      };
      
      queryClient.setQueryData(['messages', conversationId], [...previousMessages, optimisticMessage]);
      
      // Return a context object with the snapshot
      return { previousMessages };
    },
    onError: (err, newMessage, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', conversationId], context.previousMessages);
      }
    },
    onSuccess: (newMessage) => {
      // Update the messages query with the actual message from the server
      queryClient.setQueryData(['messages', conversationId], (old: Message[] = []) => {
        // Remove the optimistic message and add the real one
        return old
          .filter(msg => !msg.id.startsWith('temp-'))
          .concat(newMessage);
      });
      
      // Also update the conversation to show it has a new message
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
    },
  });
  
  return {
    messages: messagesQuery.data || [],
    isLoading: messagesQuery.isLoading,
    isError: messagesQuery.isError,
    error: messagesQuery.error,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    refetch: messagesQuery.refetch,
  };
}
