'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchChannels, 
  fetchChannelById, 
  addChannel, 
  editChannel, 
  removeChannel 
} from '../app/actions/channel-actions';
// // import type { Channel } from '../types';
// import type { Channel } from '../types/channels';

export function useChannels() {
  const queryClient = useQueryClient();
  
  const channelsQuery = useQuery({
    queryKey: ['channels'],
    queryFn: () => fetchChannels(),
  });
  
  const createChannelMutation = useMutation({
    mutationFn: (data: CreateChannelInput) => addChannel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
    },
  });
  
  const updateChannelMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateChannelInput }) => 
      editChannel(id, data),
    onSuccess: (result) => {
      if (result.data) {
        queryClient.setQueryData(['channel', result.data.id], result.data);
        queryClient.invalidateQueries({ queryKey: ['channels'] });
      }
    },
  });
  
  const deleteChannelMutation = useMutation({
    mutationFn: (id: string) => removeChannel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
    }
  });

  return {
    channels: channelsQuery.data?.data || [],
    isLoading: channelsQuery.isLoading,
    isError: channelsQuery.isError,
    error: channelsQuery.error || channelsQuery.data?.error,
    createChannel: createChannelMutation.mutate,
    updateChannel: updateChannelMutation.mutate,
    deleteChannel: deleteChannelMutation.mutate,
    isCreating: createChannelMutation.isPending,
    isUpdating: updateChannelMutation.isPending,
    isDeleting: deleteChannelMutation.isPending
  };
}

export function useChannel(id: string) {
  const queryClient = useQueryClient();
  
  const channelQuery = useQuery({
    queryKey: ['channel', id],
    queryFn: () => fetchChannelById(id),
    enabled: !!id,
  });
  
  const updateChannelMutation = useMutation({
    mutationFn: (data: UpdateChannelInput) => editChannel(id, data),
    onSuccess: (result) => {
      if (result.data) {
        queryClient.setQueryData(['channel', id], result.data);
        queryClient.invalidateQueries({ queryKey: ['channels'] });
      }
    },
  });
  
  return {
    channel: channelQuery.data?.data,
    isLoading: channelQuery.isLoading,
    isError: channelQuery.isError,
    error: channelQuery.error || channelQuery.data?.error,
    updateChannel: updateChannelMutation.mutate,
    isUpdating: updateChannelMutation.isPending,
  };
}
