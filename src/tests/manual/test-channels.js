/**
 * Manual test script for channels functionality
 * 
 * This script is used for manual testing of the channels API.
 * It's not part of the automated test suite.
 */

// Import the fetch function in a way that's compatible with ESLint
const fetch = require('node-fetch');

// Base URL for the API
const API_BASE_URL = 'http://localhost:3000/api';

// Test creating a channel
async function testCreateChannel() {
  try {
    const response = await fetch(`${API_BASE_URL}/channels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Channel',
        type: 'whatsapp',
        config: {
          apiKey: 'test-key',
          phoneNumber: '+1234567890',
        },
      }),
    });

    const data = await response.json();
    console.log('Create Channel Response:', data);
    return data.id;
  } catch (error) {
    console.error('Error creating channel:', error);
    return null;
  }
}

// Test getting all channels
async function testGetChannels() {
  try {
    const response = await fetch(`${API_BASE_URL}/channels`);
    const data = await response.json();
    console.log('Get Channels Response:', data);
  } catch (error) {
    console.error('Error getting channels:', error);
  }
}

// Test getting a specific channel
async function testGetChannel(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/channels/${id}`);
    const data = await response.json();
    console.log('Get Channel Response:', data);
  } catch (error) {
    console.error('Error getting channel:', error);
  }
}

// Test updating a channel
async function testUpdateChannel(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/channels/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Updated Test Channel',
        status: 'inactive',
      }),
    });

    const data = await response.json();
    console.log('Update Channel Response:', data);
  } catch (error) {
    console.error('Error updating channel:', error);
  }
}

// Test deleting a channel
async function testDeleteChannel(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/channels/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    console.log('Delete Channel Response:', data);
  } catch (error) {
    console.error('Error deleting channel:', error);
  }
}

// Run the tests
async function runTests() {
  console.log('Starting channel API tests...');
  
  // Create a channel and get its ID
  const channelId = await testCreateChannel();
  
  if (channelId) {
    // Get all channels
    await testGetChannels();
    
    // Get the specific channel
    await testGetChannel(channelId);
    
    // Update the channel
    await testUpdateChannel(channelId);
    
    // Delete the channel
    await testDeleteChannel(channelId);
  }
  
  console.log('Channel API tests completed.');
}

// Run the tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testCreateChannel,
  testGetChannels,
  testGetChannel,
  testUpdateChannel,
  testDeleteChannel,
  runTests,
};
