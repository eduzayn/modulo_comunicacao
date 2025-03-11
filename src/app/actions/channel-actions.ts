import { createClient } from '@supabase/supabase-js';

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

export interface CreateChannelInput {
  name: string;
  type: Channel['type'];
  status?: Channel['status'];
  config: any;
}

// Initialize Supabase client with fallback for development/testing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

// Create a mock client if credentials are missing
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    // Return mock client for development/testing
    return {
      from: () => ({
        select: () => ({
          order: () => ({
            data: [], 
            error: null
          }),
          eq: () => ({
            single: async () => ({ data: null, error: null })
          })
        }),
        insert: () => ({
          select: () => ({
            single: async () => ({ data: { id: 'mock-id' }, error: null })
          })
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: async () => ({ data: null, error: null })
            })
          })
        }),
        delete: () => ({
          eq: async () => ({ error: null })
        })
      })
    };
  }
  
  return createClient(supabaseUrl, supabaseKey);
};

const supabase = createSupabaseClient();

/**
 * Get all channels
 * @returns Array of channels
 */
export async function getChannels() {
  try {
    // For development without Supabase, return mock data
    if (process.env.NODE_ENV === 'development' && (!supabaseUrl || !supabaseKey)) {
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
    
    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data || [];
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
    if (process.env.NODE_ENV === 'development' && (!supabaseUrl || !supabaseKey)) {
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
    
    const { data, error } = await supabase
      .from('channels')
      .insert({
        name: channel.name,
        type: channel.type,
        status: channel.status || 'active',
        config: channel.config
      })
      .select()
      .single();
    
    if (error) {
      return {
        success: false,
        error: error.message
      };
    }
    
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
    if (process.env.NODE_ENV === 'development' && (!supabaseUrl || !supabaseKey)) {
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
    
    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      return {
        success: false,
        error: error.message
      };
    }
    
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
    if (process.env.NODE_ENV === 'development' && (!supabaseUrl || !supabaseKey)) {
      return {
        success: true,
        data: {
          id,
          ...channel,
          updatedAt: new Date().toISOString()
        }
      };
    }
    
    const { data, error } = await supabase
      .from('channels')
      .update({
        ...channel,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return {
        success: false,
        error: error.message
      };
    }
    
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
    if (process.env.NODE_ENV === 'development' && (!supabaseUrl || !supabaseKey)) {
      return {
        success: true
      };
    }
    
    const { error } = await supabase
      .from('channels')
      .delete()
      .eq('id', id);
    
    if (error) {
      return {
        success: false,
        error: error.message
      };
    }
    
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
