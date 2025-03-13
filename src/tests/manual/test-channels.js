/**
 * Manual test script for channels functionality
 */

// Import using ES6 syntax instead of require
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Test function to list all channels
async function listChannels() {
  try {
    const { data, error } = await supabase
      .from('channels')
      .select('*');
    
    if (error) throw error;
    
    console.log('Channels:', data);
    return data;
  } catch (error) {
    console.error('Error listing channels:', error.message);
    return null;
  }
}

// Test function to create a channel
async function createChannel(channelData) {
  try {
    const { data, error } = await supabase
      .from('channels')
      .insert(channelData)
      .select()
      .single();
    
    if (error) throw error;
    
    console.log('Created channel:', data);
    return data;
  } catch (error) {
    console.error('Error creating channel:', error.message);
    return null;
  }
}

// Run tests
async function runTests() {
  console.log('Running channel tests...');
  
  // List existing channels
  await listChannels();
  
  // Create a test channel
  const testChannel = {
    name: 'Test Channel',
    type: 'email',
    status: 'active',
    config: { apiKey: 'test-key' }
  };
  
  await createChannel(testChannel);
  
  // List channels again to verify creation
  await listChannels();
}

// Execute tests
runTests().catch(console.error);
