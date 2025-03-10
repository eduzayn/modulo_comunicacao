import { supabase, supabaseAdmin } from '../../lib/supabase';
import type { Channel } from '../../types';
import type { CreateChannelInput, UpdateChannelInput } from '../../types/channels';
import type { Database } from '../../lib/database.types';

// Use admin client for operations that need to bypass RLS
const adminClient = supabaseAdmin || supabase;

// Type for database insert
type ChannelInsert = Database['public']['Tables']['channels']['Insert'];

export async function getChannels() {
  const { data, error } = await adminClient
    .from('channels')
    .select('*')
    .order('name');
  
  if (error) {
    throw new Error(`Error fetching channels: ${error.message}`);
  }
  
  // Convert database models to application models
  return data.map(channel => ({
    id: channel.id,
    name: channel.name,
    type: channel.type as Channel['type'],
    status: channel.status as Channel['status'],
    config: channel.config
  }));
}

export async function getChannelById(id: string) {
  const { data, error } = await adminClient
    .from('channels')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(`Error fetching channel: ${error.message}`);
  }
  
  // Convert database model to application model
  return {
    id: data.id,
    name: data.name,
    type: data.type as Channel['type'],
    status: data.status as Channel['status'],
    config: data.config
  };
}

export async function createChannel(channel: CreateChannelInput) {
  // Convert the input to match the database schema
  const dbChannel: ChannelInsert = {
    name: channel.name,
    type: channel.type,
    status: channel.status || 'active', // Default status if not provided
    config: channel.config as any // Cast to Json compatible type
  };
  
  const { data, error } = await adminClient
    .from('channels')
    .insert(dbChannel)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error creating channel: ${error.message}`);
  }
  
  // Convert database model to application model
  return {
    id: data.id,
    name: data.name,
    type: data.type as Channel['type'],
    status: data.status as Channel['status'],
    config: data.config
  };
}

export async function updateChannel(id: string, channel: UpdateChannelInput) {
  // Convert the input to match the database schema
  const dbChannel: Partial<Database['public']['Tables']['channels']['Update']> = {};
  if (channel.name !== undefined) dbChannel.name = channel.name;
  if (channel.status !== undefined) dbChannel.status = channel.status;
  if (channel.config !== undefined) dbChannel.config = channel.config as any;
  
  const { data, error } = await adminClient
    .from('channels')
    .update(dbChannel)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error updating channel: ${error.message}`);
  }
  
  // Convert database model to application model
  return {
    id: data.id,
    name: data.name,
    type: data.type as Channel['type'],
    status: data.status as Channel['status'],
    config: data.config
  };
}

export async function deleteChannel(id: string) {
  const { error } = await adminClient
    .from('channels')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(`Error deleting channel: ${error.message}`);
  }
  
  return true;
}
