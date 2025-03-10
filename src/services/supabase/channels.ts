import { supabase } from '../../lib/supabase';
import type { Channel } from '../../types';
import type { CreateChannelInput, UpdateChannelInput } from '../../types/channels';

export async function getChannels() {
  const { data, error } = await supabase
    .from('channels')
    .select('*')
    .order('name');
  
  if (error) {
    throw new Error(`Error fetching channels: ${error.message}`);
  }
  
  return data as Channel[];
}

export async function getChannelById(id: string) {
  const { data, error } = await supabase
    .from('channels')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(`Error fetching channel: ${error.message}`);
  }
  
  return data as Channel;
}

export async function createChannel(channel: CreateChannelInput) {
  const { data, error } = await supabase
    .from('channels')
    .insert(channel)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error creating channel: ${error.message}`);
  }
  
  return data as Channel;
}

export async function updateChannel(id: string, channel: UpdateChannelInput) {
  const { data, error } = await supabase
    .from('channels')
    .update(channel)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error updating channel: ${error.message}`);
  }
  
  return data as Channel;
}

export async function deleteChannel(id: string) {
  const { error } = await supabase
    .from('channels')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(`Error deleting channel: ${error.message}`);
  }
  
  return true;
}
