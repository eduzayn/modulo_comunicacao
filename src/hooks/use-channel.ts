"use client";

/**
 * use-channel.ts
 * 
 * Description: Hook for managing a single channel
 * 
 * @module hooks/use-channel
 * @author Devin AI
 * @created 2025-03-12
 */
import { useState, useEffect } from 'react';
import { getChannelById, updateChannel, deleteChannel } from '@/app/actions/channel-actions';
import type { Channel, UpdateChannelInput } from '@/types/channels';

/**
 * Hook for managing a single channel
 * 
 * @param id - Channel ID
 * @returns Channel state and methods
 */
export function useChannel(id: string) {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch channel
   */
  const fetchChannel = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getChannelById(id);
      
      if (result.error) {
        setError(result.error);
      } else {
        setChannel(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update channel
   * 
   * @param data - Channel data to update
   */
  const updateChannelData = async (data: UpdateChannelInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await updateChannel(id, data);
      
      if (result.error) {
        setError(result.error);
      } else {
        setChannel(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete channel
   */
  const deleteChannelData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await deleteChannel(id);
      
      if (!result.success) {
        setError(result.error || 'Failed to delete channel');
      } else {
        setChannel(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch channel on mount or when ID changes
  useEffect(() => {
    if (id) {
      fetchChannel();
    }
  }, [id]);

  return {
    channel,
    isLoading,
    error,
    fetchChannel,
    updateChannel: updateChannelData,
    deleteChannel: deleteChannelData,
  };
}

export default useChannel;
