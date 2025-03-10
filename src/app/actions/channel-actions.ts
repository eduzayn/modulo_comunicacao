'use server';

import { revalidatePath } from 'next/cache';
import { 
  getChannels, 
  getChannelById, 
  createChannel, 
  updateChannel, 
  deleteChannel 
} from '../../services/supabase/channels';
import type { CreateChannelInput, UpdateChannelInput } from '../../types/channels';

export async function fetchChannels() {
  try {
    return { data: await getChannels(), error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function fetchChannelById(id: string) {
  try {
    return { data: await getChannelById(id), error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function addChannel(data: CreateChannelInput) {
  try {
    const channel = await createChannel(data);
    revalidatePath('/channels');
    return { data: channel, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function editChannel(id: string, data: UpdateChannelInput) {
  try {
    const channel = await updateChannel(id, data);
    revalidatePath(`/channels/${id}`);
    revalidatePath('/channels');
    return { data: channel, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function removeChannel(id: string) {
  try {
    await deleteChannel(id);
    revalidatePath('/channels');
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
