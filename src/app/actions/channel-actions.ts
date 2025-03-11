'use server';

import { revalidatePath } from 'next/cache';
import { 
  getChannels as getChannelsService, 
  getChannelById as getChannelByIdService, 
  createChannel as createChannelService, 
  updateChannel as updateChannelService, 
  deleteChannel as deleteChannelService 
} from '@/services/supabase/channels';
import type { CreateChannelInput, UpdateChannelInput } from '@/types/channels';

// Define types locally to avoid import errors
export interface Channel {
  id: string;
  name: string;
  type: 'whatsapp' | 'email' | 'chat' | 'sms' | 'push';
  status: 'active' | 'inactive' | 'maintenance';
  config: any;
  createdAt: string;
  updatedAt: string;
}

// Authentication is now handled by the main site
// Mock data for development/testing
const useMockData = process.env.NODE_ENV === 'development';

/**
 * Get all channels
 * @returns Array of channels
 */
export async function getChannels() {
  try {
    // For development without Supabase, return mock data
    if (useMockData) {
      return [
        {
          id: 'mock-channel-1',
          name: 'WhatsApp Channel',
          type: 'whatsapp',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'mock-channel-2',
          name: 'Email Channel',
          type: 'email',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
    
    // Use the service function
    return await getChannelsService();
  } catch (error) {
    console.error('Error fetching channels:', error);
    return [];
  }
}

/**
 * Create a new channel
 * @param channel Channel data to create
 * @returns Object with success status and data or error
 */
export async function createChannel(channel: CreateChannelInput) {
  try {
    // For development without Supabase, return mock data
    if (useMockData) {
      return {
        success: true,
        data: {
          id: 'mock-channel-id',
          name: channel.name,
          type: channel.type,
          status: channel.status || 'active',
          config: channel.config,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    }
    
    // Use the service function
    const data = await createChannelService(channel);
    
    // Revalidate the channels path to update the UI
    revalidatePath('/channels');
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error creating channel:', error);
    return {
      success: false,
      error: error.message || 'Failed to create channel'
    };
  }
}

/**
 * Get a channel by ID
 * @param id Channel ID
 * @returns Channel object or null
 */
export async function getChannelById(id: string) {
  try {
    // For development without Supabase, return mock data
    if (useMockData) {
      return {
        success: true,
        data: {
          id,
          name: 'Mock Channel',
          type: 'whatsapp',
          status: 'active',
          config: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    }
    
    // Use the service function
    const data = await getChannelByIdService(id);
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error fetching channel:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch channel'
    };
  }
}

/**
 * Update a channel
 * @param id Channel ID
 * @param channel Channel data to update
 * @returns Object with success status and data or error
 */
export async function updateChannel(id: string, channel: Partial<Channel>) {
  try {
    // For development without Supabase, return mock data
    if (useMockData) {
      return {
        success: true,
        data: {
          id,
          ...channel,
          updatedAt: new Date().toISOString()
        }
      };
    }
    
    // Use the service function
    const data = await updateChannelService(id, channel as UpdateChannelInput);
    
    // Revalidate the channels path to update the UI
    revalidatePath(`/channels/${id}`);
    revalidatePath('/channels');
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error updating channel:', error);
    return {
      success: false,
      error: error.message || 'Failed to update channel'
    };
  }
}

/**
 * Delete a channel
 * @param id Channel ID
 * @returns Object with success status and error if applicable
 */
export async function deleteChannel(id: string) {
  try {
    // For development without Supabase, return success
    if (useMockData) {
      return {
        success: true
      };
    }
    
    // Use the service function
    await deleteChannelService(id);
    
    // Revalidate the channels path to update the UI
    revalidatePath('/channels');
    
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Error deleting channel:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete channel'
    };
  }
}

// Server actions with standardized response format
export async function fetchChannels() {
  try {
    return { data: await getChannels(), error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function fetchChannelById(id: string) {
  try {
    const result = await getChannelById(id);
    return { data: result.data, error: result.success ? null : result.error };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function addChannel(data: CreateChannelInput) {
  try {
    const result = await createChannel(data);
    if (!result.success) {
      return { data: null, error: result.error };
    }
    return { data: result.data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function editChannel(id: string, data: UpdateChannelInput) {
  try {
    const result = await updateChannel(id, data);
    if (!result.success) {
      return { data: null, error: result.error };
    }
    return { data: result.data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function removeChannel(id: string) {
  try {
    const result = await deleteChannel(id);
    return { success: result.success, error: result.success ? null : result.error };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
