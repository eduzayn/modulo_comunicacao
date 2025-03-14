'use server';

import { revalidatePath } from 'next/cache';
import { 
  getChannels, 
  getChannelById, 
  createChannel, 
  updateChannel, 
  deleteChannel 
} from '../../services/supabase/channels';
import type { 
  CreateChannelInput, 
  UpdateChannelInput 
} from '../../types/channels';

/**
 * Fetch all channels
 * @returns Object with data and error properties
 */
export async function fetchChannels() {
  try {
    return { data: await getChannels(), error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { data: null, error: errorMessage };
  }
}

/**
 * Fetch a channel by ID
 * @param id - Channel ID
 * @returns Object with data and error properties
 */
export async function fetchChannelById(id: string) {
  try {
    return { data: await getChannelById(id), error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { data: null, error: errorMessage };
  }
}

/**
 * Add a new channel
 * @param data - Channel data
 * @returns Object with data and error properties
 */
export async function addChannel(data: CreateChannelInput) {
  try {
    const channel = await createChannel(data);
    revalidatePath('/channels');
    return { data: channel, error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { data: null, error: errorMessage };
  }
}

/**
 * Edit an existing channel
 * @param id - Channel ID
 * @param data - Updated channel data
 * @returns Object with data and error properties
 */
export async function editChannel(id: string, data: UpdateChannelInput) {
  try {
    const channel = await updateChannel(id, data);
    revalidatePath(`/channels/${id}`);
    revalidatePath('/channels');
    return { data: channel, error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { data: null, error: errorMessage };
  }
}

/**
 * Remove a channel
 * @param id - Channel ID
 * @returns Object with success and error properties
 */
export async function removeChannel(id: string) {
  try {
    await deleteChannel(id);
    revalidatePath('/channels');
    return { success: true, error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
}
