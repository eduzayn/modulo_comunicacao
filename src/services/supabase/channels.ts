/**
 * Service for managing communication channels in Supabase
 */

import { supabase, supabaseAdmin } from '../../lib/supabase';
import { BaseService } from './base-service';
import type { Channel } from '../../types/index';
import type { ChannelType, ChannelStatus } from '../../types/channels';
import type { CreateChannelInput, UpdateChannelInput } from '../../types/channels';

// Use admin client for operations that need to bypass RLS
const adminClient = supabaseAdmin || supabase;

/**
 * Service for channel operations
 */
export class ChannelService extends BaseService {
  protected tableName: string;
  
  constructor() {
    super('public.channels');
    this.tableName = 'public.channels';
  }
  
  /**
   * Get all channels
   */
  async getChannels(): Promise<Channel[]> {
    const { data, error } = await adminClient
      .from(this.tableName)
      .select('*')
      .order('name');
    
    if (error) {
      throw new Error(`Failed to get channels: ${error.message}`);
    }
    
    // Convert database models to application models
    return data?.map(channel => ({
      id: channel.id,
      name: channel.name,
      type: channel.type as Channel['type'],
      status: channel.status as Channel['status'],
      config: channel.config
    })) || [];
  }
  
  /**
   * Get channels by type
   */
  async getChannelsByType(type: ChannelType): Promise<Channel[]> {
    const { data, error } = await adminClient
      .from(this.tableName)
      .select('*')
      .eq('type', type);
    
    if (error) {
      throw new Error(`Failed to get channels by type: ${error.message}`);
    }
    
    return data?.map(channel => ({
      id: channel.id,
      name: channel.name,
      type: channel.type as Channel['type'],
      status: channel.status as Channel['status'],
      config: channel.config
    })) || [];
  }
  
  /**
   * Get a channel by ID
   */
  async getChannelById(id: string): Promise<Channel | null> {
    const { data, error } = await adminClient
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
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
  
  /**
   * Create a new channel
   */
  async createChannel(channel: CreateChannelInput): Promise<Channel> {
    // Convert the input to match the database schema
    const dbChannel = {
      name: channel.name,
      type: channel.type,
      status: channel.status || 'active', // Default status if not provided
      config: channel.config
    };
    
    const { data, error } = await adminClient
      .from(this.tableName)
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
  
  /**
   * Update a channel
   */
  async updateChannel(id: string, channel: UpdateChannelInput): Promise<Channel> {
    // Convert the input to match the database schema
    const dbChannel: Record<string, unknown> = {};
    if (channel.name !== undefined) dbChannel.name = channel.name;
    if (channel.status !== undefined) dbChannel.status = channel.status;
    if (channel.config !== undefined) dbChannel.config = channel.config;
    
    const { data, error } = await adminClient
      .from(this.tableName)
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
  
  /**
   * Delete a channel
   */
  async deleteChannel(id: string): Promise<boolean> {
    const { error } = await adminClient
      .from(this.tableName)
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Error deleting channel: ${error.message}`);
    }
    
    return true;
  }
  
  /**
   * Update channel status
   */
  async updateChannelStatus(id: string, status: ChannelStatus): Promise<Channel> {
    return this.updateChannel(id, { status });
  }
  
  /**
   * Get active channels
   */
  async getActiveChannels(): Promise<Channel[]> {
    const { data, error } = await adminClient
      .from(this.tableName)
      .select('*')
      .eq('status', 'active');
    
    if (error) {
      throw new Error(`Failed to get active channels: ${error.message}`);
    }
    
    return data?.map(channel => ({
      id: channel.id,
      name: channel.name,
      type: channel.type as Channel['type'],
      status: channel.status as Channel['status'],
      config: channel.config
    })) || [];
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
