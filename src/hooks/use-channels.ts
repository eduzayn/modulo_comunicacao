'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Channel } from '@/src/types';
import type { CreateChannelInput, UpdateChannelInput } from '@/src/types/channels';

export function useChannels() {
  const queryClient = useQueryClient();
  
  const channelsQuery = useQuery({
    queryKey: ['channels'],
    queryFn: async () => {
      const response = await fetch('/api/communication/channels');
      if (!response.ok) {
        throw new Error('Failed to fetch channels');
      }
      return response.json() as Promise<Channel[]>;
    },
  });
  
  const createChannelMutation = useMutation({
    mutationFn: async (data: CreateChannelInput) => {
      const response = await fetch('/api/communication/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create channel');
      }
      
      return response.json() as Promise<Channel>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
    },
  });
  
  const updateChannelMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateChannelInput }) => {
      const response = await fetch(`/api/communication/channels/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update channel');
      }
      
      return response.json() as Promise<Channel>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['channel', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['channels'] });
    },
  });
  
  return {
    channels: channelsQuery.data || [],
    isLoading: channelsQuery.isLoading,
    isError: channelsQuery.isError,
    error: channelsQuery.error,
    createChannel: createChannelMutation.mutate,
    updateChannel: updateChannelMutation.mutate,
    isCreating: createChannelMutation.isPending,
    isUpdating: updateChannelMutation.isPending,
  };
}

export function useChannel(id: string) {
  const queryClient = useQueryClient();
  
  const channelQuery = useQuery({
    queryKey: ['channel', id],
    queryFn: async () => {
      const response = await fetch(`/api/communication/channels/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch channel');
      }
      return response.json() as Promise<Channel>;
    },
    enabled: !!id,
  });
  
  const updateChannelMutation = useMutation({
    mutationFn: async (data: UpdateChannelInput) => {
      const response = await fetch(`/api/communication/channels/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update channel');
      }
      
      return response.json() as Promise<Channel>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['channel', id], data);
      queryClient.invalidateQueries({ queryKey: ['channels'] });
    },
  });
  
  return {
    channel: channelQuery.data,
    isLoading: channelQuery.isLoading,
    isError: channelQuery.isError,
    error: channelQuery.error,
    updateChannel: updateChannelMutation.mutate,
    isUpdating: updateChannelMutation.isPending,
  };
}
