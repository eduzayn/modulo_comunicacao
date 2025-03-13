'use server';

import { revalidatePath } from 'next/cache';
import { 
  getChannels, 
  getChannelById, 
  createChannel, 
  updateChannel, 
  deleteChannel 
} from '@/services/supabase/channels';
import type { CreateChannelInput, UpdateChannelInput } from '@/types/channels';

// Define types locally to avoid import errors
export interface Channel {
  id: string;
  name: string;
  type: 'whatsapp' | 'email' | 'chat' | 'sms' | 'push';
  status: 'active' | 'inactive' | 'maintenance';
  config: Record<string, string | number | boolean | object | null>;
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
export async function getChannelsInternal() {
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
    return await getChannels();
  } catch (error) {
    console.error('Error fetching channels:', error);
    return [];
  }
}

/**
 * Fetch all channels
 * Server action that retrieves all channels
 */
export async function fetchChannels() {
  try {
    const channels = useMockData ? await getChannelsInternal() : await getChannels();
    return { 
      success: true, 
      data: channels, 
      error: null 
    };
  } catch (error: unknown) {
    console.error('Error fetching channels:', error);
    return { 
      success: false, 
      data: null, 
      error: error.message || 'Failed to fetch channels' 
    };
  }
}

/**
 * Fetch a channel by ID
 * Server action that retrieves a specific channel
 */
export async function fetchChannelById(id: string) {
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
        },
        error: null
      };
    }
    
    const channel = await getChannelById(id);
    return { 
      success: true, 
      data: channel, 
      error: null 
    };
  } catch (error: unknown) {
    console.error('Error fetching channel:', error);
    return { 
      success: false, 
      data: null, 
      error: error.message || 'Failed to fetch channel' 
    };
  }
}

/**
 * Add a new channel
 * Server action that creates a channel and revalidates paths
 */
export async function addChannel(data: CreateChannelInput) {
  try {
    // For development without Supabase, return mock data
    if (useMockData) {
      return { 
        success: true, 
        data: {
          id: 'mock-channel-id',
          name: data.name,
          type: data.type,
          status: data.status || 'active',
          config: data.config,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        error: null
      };
    }
    
    const channel = await createChannel(data);
    // Revalidate the channels list page
    revalidatePath('/channels');
    return { 
      success: true, 
      data: channel, 
      error: null 
    };
  } catch (error: unknown) {
    console.error('Error creating channel:', error);
    return { 
      success: false, 
      data: null, 
      error: error.message || 'Failed to create channel' 
    };
  }
}

/**
 * Edit an existing channel
 * Server action that updates a channel and revalidates paths
 */
export async function editChannel(id: string, data: UpdateChannelInput) {
  try {
    // For development without Supabase, return mock data
    if (useMockData) {
      return { 
        success: true, 
        data: {
          id,
          ...data,
          updatedAt: new Date().toISOString()
        },
        error: null
      };
    }
    
    const channel = await updateChannel(id, data);
    // Revalidate both the channel detail page and the channels list page
    revalidatePath(`/channels/${id}`);
    revalidatePath('/channels');
    return { 
      success: true, 
      data: channel, 
      error: null 
    };
  } catch (error: unknown) {
    console.error('Error updating channel:', error);
    return { 
      success: false, 
      data: null, 
      error: error.message || 'Failed to update channel' 
    };
  }
}

/**
 * Remove a channel
 * Server action that deletes a channel and revalidates paths
 */
export async function removeChannel(id: string) {
  try {
    // For development without Supabase, return success
    if (useMockData) {
      return {
        success: true,
        error: null
      };
    }
    
    await deleteChannel(id);
    // Revalidate the channels list page
    revalidatePath('/channels');
    return { 
      success: true, 
      error: null 
    };
  } catch (error: unknown) {
    console.error('Error deleting channel:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to delete channel' 
    };
  }
}
