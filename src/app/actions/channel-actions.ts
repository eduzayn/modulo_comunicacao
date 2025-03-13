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

/**
 * Fetch all channels
 * Server action that retrieves all channels
 */
export async function fetchChannels() {
  try {
    const channels = await getChannels();
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
