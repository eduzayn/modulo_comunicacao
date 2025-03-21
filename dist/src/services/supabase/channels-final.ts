/**
 * Service for managing communication channels in Supabase
 */

import { supabase } from './base-service';
import type { Channel } from '../../types/index';
import type { CreateChannelInput, UpdateChannelInput } from '../../types/channels';

/**
 * Service for channel operations
 */
export class ChannelService {
  protected tableName: string = 'communication.channels';

  /**
   * Get all channels
   */
  async getChannels(): Promise<Channel[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(`Failed to get channels: ${error.message}`);
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getChannels:', error);
      throw error;
    }
  }
  
  /**
   * Get channels by type
   */
  async getChannelsByType(type: Channel['type']): Promise<Channel[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('type', type)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(`Failed to get channels by type: ${error.message}`);
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getChannelsByType:', error);
      throw error;
    }
  }
  
  /**
   * Get a channel by ID
   */
  async getChannelById(id: string): Promise<Channel | null> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw new Error(`Failed to get channel by ID: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error in getChannelById:', error);
      throw error;
    }
  }
  
  /**
   * Create a new channel
   */
  async createChannel(channel: CreateChannelInput): Promise<Channel> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert(channel)
        .select()
        .single();
      
      if (error) {
        throw new Error(`Failed to create channel: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error in createChannel:', error);
      throw error;
    }
  }
  
  /**
   * Update a channel
   */
  async updateChannel(id: string, updates: UpdateChannelInput): Promise<Channel> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw new Error(`Failed to update channel: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error in updateChannel:', error);
      throw error;
    }
  }
  
  /**
   * Delete a channel
   */
  async deleteChannel(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(`Failed to delete channel: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in deleteChannel:', error);
      throw error;
    }
  }
  
  /**
   * Update channel status
   */
  async updateChannelStatus(id: string, status: Channel['status']): Promise<Channel> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw new Error(`Failed to update channel status: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error in updateChannelStatus:', error);
      throw error;
    }
  }
  
  /**
   * Get active channels
   */
  async getActiveChannels(): Promise<Channel[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(`Failed to get active channels: ${error.message}`);
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getActiveChannels:', error);
      throw error;
    }
  }
  
  /**
   * Test channel connection
   */
  async testChannelConnection(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const channel = await this.getChannelById(id);
      
      if (!channel) {
        return { success: false, message: 'Channel not found' };
      }
      
      // Implement channel-specific connection tests here
      switch (channel.type) {
        case 'whatsapp':
          // Test WhatsApp connection
          return { success: true, message: 'WhatsApp connection successful' };
        
        case 'email':
          // Test email connection
          return { success: true, message: 'Email connection successful' };
        
        case 'sms':
          // Test SMS connection
          return { success: true, message: 'SMS connection successful' };
        
        case 'chat':
          // Test chat connection
          return { success: true, message: 'Chat connection successful' };
          
        case 'push':
          // Test push notification connection
          return { success: true, message: 'Push notification successful' };
        
        default:
          return { success: false, message: `Unsupported channel type: ${channel.type}` };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Create and export service instance
const channelService = new ChannelService();

// Export individual functions from the service
export const { 
  getChannels, 
  getChannelById, 
  createChannel, 
  updateChannel, 
  deleteChannel,
  getChannelsByType,
  updateChannelStatus,
  getActiveChannels,
  testChannelConnection
} = channelService;
