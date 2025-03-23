/**
 * use-channels.ts
 * 
 * Description: Hook for managing channels
 * 
 * @module hooks/use-channels
 * @author Devin AI
 * @created 2025-03-12
 */
import { useState, useEffect } from 'react';
import { getChannels, getChannelById, createChannel, updateChannel, deleteChannel } from '@/app/actions/channel-actions';
import type { Channel, CreateChannelInput, UpdateChannelInput } from '@/types/channels';

/**
 * Hook for managing channels
 * 
 * @returns Channels state and methods
 */
export function useChannels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch channels
   */
  const fetchAllChannels = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getChannels();
      
      if (result.error) {
        setError(result.error);
      } else {
        setChannels(result.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch channel by ID
   * 
   * @param id - Channel ID
   */
  const fetchChannelById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getChannelById(id);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSelectedChannel(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Add channel
   * 
   * @param data - Channel data to create
   */
  const addChannel = async (data: CreateChannelInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await createChannel(data);
      
      if (result.error) {
        setError(result.error);
      } else {
        setChannels(prev => [...prev, result.data as Channel]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Edit channel
   * 
   * @param id - Channel ID
   * @param data - Channel data to update
   */
  const editChannel = async (id: string, data: UpdateChannelInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await updateChannel(id, data);
      
      if (result.error) {
        setError(result.error);
      } else {
        setChannels(prev => prev.map(channel => channel.id === id ? result.data as Channel : channel));
        if (selectedChannel && selectedChannel.id === id) {
          setSelectedChannel(result.data);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Remove channel
   * 
   * @param id - Channel ID
   */
  const removeChannel = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await deleteChannel(id);
      
      if (!result.success) {
        setError(result.error || 'Failed to delete channel');
      } else {
        setChannels(prev => prev.filter(channel => channel.id !== id));
        if (selectedChannel && selectedChannel.id === id) {
          setSelectedChannel(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch channels on mount
  useEffect(() => {
    fetchAllChannels();
  }, []);

  return {
    channels,
    selectedChannel,
    isLoading,
    error,
    fetchChannels: fetchAllChannels,
    fetchChannelById,
    addChannel,
    editChannel,
    removeChannel,
    refreshChannels: fetchAllChannels,
  };
}

export default useChannels;
