'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getChannels, getChannel, createChannel, updateChannel } from '../actions/channel-actions';
import type { Channel } from '../../src/modules/communication/types';

export function useChannels() {
  const queryClient = useQueryClient();
  
  const channelsQuery = useQuery({
    queryKey: ['channels'],
    queryFn: getChannels,
  });
  
  const createChannelMutation = useMutation({
    mutationFn: createChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
    },
  });
  
  const updateChannelMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateChannel(id, data),
    onSuccess: (data) => {
      if (data.success && data.data) {
        queryClient.setQueryData(['channels', data.data.id], data.data);
        queryClient.invalidateQueries({ queryKey: ['channels'] });
      }
    },
  });
  
  return {
    channels: channelsQuery.data || [],
    isLoading: channelsQuery.isLoading,
    isError: channelsQuery.isError,
    error: channelsQuery.error,
    createChannel: createChannelMutation.mutate,
    updateChannel: updateChannelMutation.mutate,
    isCreating: createChannelMutation.isLoading,
    isUpdating: updateChannelMutation.isLoading,
  };
}

export function useChannel(id: string) {
  const queryClient = useQueryClient();
  
  const channelQuery = useQuery({
    queryKey: ['channels', id],
    queryFn: () => getChannel(id),
    enabled: !!id,
  });
  
  const updateChannelMutation = useMutation({
    mutationFn: (data: any) => updateChannel(id, data),
    onSuccess: (data) => {
      if (data.success && data.data) {
        queryClient.setQueryData(['channels', id], data.data);
        queryClient.invalidateQueries({ queryKey: ['channels'] });
      }
    },
  });
  
  return {
    channel: channelQuery.data,
    isLoading: channelQuery.isLoading,
    isError: channelQuery.isError,
    error: channelQuery.error,
    updateChannel: updateChannelMutation.mutate,
    isUpdating: updateChannelMutation.isLoading,
  };
}
