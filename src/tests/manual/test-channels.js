/**
 * Manual test script for channels service
 * Run with: node src/tests/manual/test-channels.js
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1ODYzMjIsImV4cCI6MjA1NzE2MjMyMn0.WGkiWL6VEazfIBHHz8LguEr8pRVy5XlbZT0iQ2rdfHU';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test channel data
const testChannel = {
  name: 'Test WhatsApp Channel',
  type: 'whatsapp',
  config: {
    apiKey: 'test-api-key',
    phoneNumber: '+5511999999999',
    webhookUrl: 'https://example.com/webhook'
  }
};

// Channel service implementation
class ChannelService {
  constructor() {
    this.tableName = 'communication.channels';
  }

  async getChannels() {
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
  
  async createChannel(channel) {
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
  
  async getChannelById(id) {
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
  
  async updateChannel(id, updates) {
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
  
  async deleteChannel(id) {
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
}

// Create service instance
const channelService = new ChannelService();

// Run tests
async function runTests() {
  console.log('Starting channel service tests...');
  
  try {
    // Test 1: Create a channel
    console.log('\n--- Test 1: Create a channel ---');
    const createdChannel = await channelService.createChannel(testChannel);
    console.log('Created channel:', createdChannel);
    
    if (!createdChannel || !createdChannel.id) {
      throw new Error('Failed to create channel');
    }
    
    const channelId = createdChannel.id;
    
    // Test 2: Get all channels
    console.log('\n--- Test 2: Get all channels ---');
    const channels = await channelService.getChannels();
    console.log(`Retrieved ${channels.length} channels`);
    
    if (!Array.isArray(channels) || channels.length === 0) {
      throw new Error('Failed to get channels or no channels found');
    }
    
    // Test 3: Get channel by ID
    console.log('\n--- Test 3: Get channel by ID ---');
    const channel = await channelService.getChannelById(channelId);
    console.log('Retrieved channel by ID:', channel);
    
    if (!channel || channel.id !== channelId) {
      throw new Error('Failed to get channel by ID');
    }
    
    // Test 4: Update channel
    console.log('\n--- Test 4: Update channel ---');
    const updates = {
      name: 'Updated Test Channel',
      status: 'inactive'
    };
    
    const updatedChannel = await channelService.updateChannel(channelId, updates);
    console.log('Updated channel:', updatedChannel);
    
    if (!updatedChannel || updatedChannel.name !== updates.name) {
      throw new Error('Failed to update channel');
    }
    
    // Test 5: Delete channel
    console.log('\n--- Test 5: Delete channel ---');
    await channelService.deleteChannel(channelId);
    console.log('Deleted channel');
    
    // Verify deletion
    const deletedChannel = await channelService.getChannelById(channelId);
    console.log('Attempt to get deleted channel:', deletedChannel);
    
    if (deletedChannel) {
      throw new Error('Channel was not deleted');
    }
    
    console.log('\nAll tests passed successfully!');
  } catch (error) {
    console.error('\nTest failed:', error.message);
    console.error(error);
  }
}

// Run the tests
runTests();
