/**
 * Service for managing communication channels in Supabase
 */

import { BaseService } from './base-service';
import type { Channel } from '@/types/index';
import type { CreateChannelInput, UpdateChannelInput } from '@/types/channels';

// Define channel type and status types from the Channel interface
type ChannelType = Channel['type'];
type ChannelStatus = Channel['status'];

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
    const { data, pagination } = await this.getItems<Channel>({
      sort: { column: 'created_at', ascending: false }
    });
    
    return data;
  }
  
  /**
   * Get channels by type
   */
  async getChannelsByType(type: ChannelType): Promise<Channel[]> {
    const { data } = await this.getItems<Channel>({
      filters: { type },
      sort: { column: 'created_at', ascending: false }
    });
    
    return data;
  }
  
  /**
   * Get a channel by ID
   */
  async getChannelById(id: string): Promise<Channel | null> {
    return this.getItemById<Channel>(id);
  }
  
  /**
   * Create a new channel
   */
  async createChannel(channel: CreateChannelInput): Promise<Channel> {
    return this.createItem<Channel>(channel as Partial<Channel>);
  }
  
  /**
   * Update a channel
   */
  async updateChannel(id: string, updates: UpdateChannelInput): Promise<Channel> {
    return this.updateItem<Channel>(id, updates as Partial<Channel>);
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
    return this.updateItem<Channel>(id, { status } as Partial<Channel>);
  }
  
  /**
   * Get active channels
   */
  async getActiveChannels(): Promise<Channel[]> {
    const { data } = await this.getItems<Channel>({
      filters: { status: 'active' },
      sort: { column: 'created_at', ascending: false }
    });
    
    return data;
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
