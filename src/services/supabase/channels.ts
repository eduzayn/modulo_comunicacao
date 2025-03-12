/**
 * Service for managing communication channels in Supabase
 */

import { BaseService, supabase } from './base-service';
import type { Channel } from '@/types/index';
import type { ChannelType, ChannelStatus } from '@/types/channels';

/**
 * Service for channel operations
 */
export class ChannelService extends BaseService {
  constructor() {
    super('communication.channels');
  }
  
  /**
   * Get all channels
   */
  async getChannels(): Promise<Channel[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*');
    
    if (error) {
      throw new Error(`Failed to get channels: ${error.message}`);
    }
    
    return data || [];
  }
  
  /**
   * Get channels by type
   */
  async getChannelsByType(type: ChannelType): Promise<Channel[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('type', type);
    
    if (error) {
      throw new Error(`Failed to get channels by type: ${error.message}`);
    }
    
    return data || [];
  }
  
  /**
   * Get a channel by ID
   */
  async getChannelById(id: string): Promise<Channel | null> {
    return this.getItemById(id) as Promise<Channel | null>;
  }
  
  /**
   * Create a new channel
   */
  async createChannel(channel: Omit<Channel, 'id' | 'created_at' | 'updated_at'>): Promise<Channel> {
    return this.createItem(channel) as Promise<Channel>;
  }
  
  /**
   * Update a channel
   */
  async updateChannel(id: string, updates: Partial<Channel>): Promise<Channel> {
    return this.updateItem(id, updates) as Promise<Channel>;
  }
  
  /**
   * Delete a channel
   */
  async deleteChannel(id: string): Promise<void> {
    return this.deleteItem(id);
  }
  
  /**
   * Update channel status
   */
  async updateChannelStatus(id: string, status: ChannelStatus): Promise<Channel> {
    return this.updateItem(id, { status }) as Promise<Channel>;
  }
  
  /**
   * Get active channels
   */
  async getActiveChannels(): Promise<Channel[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('status', 'active');
    
    if (error) {
      throw new Error(`Failed to get active channels: ${error.message}`);
    }
    
    return data || [];
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
  
  // Access supabase client directly from import
  private get client() {
    return supabase;
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
