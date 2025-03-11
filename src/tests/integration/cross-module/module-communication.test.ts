import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { 
  createTestUser, 
  generateTestApiKey, 
  makeAuthenticatedRequest, 
  cleanupTestData,
  TestUser,
  ApiResponse
} from '../test-utils';

// Define types for better type safety
interface Channel {
  id: string;
  name: string;
  type: 'whatsapp' | 'email' | 'chat' | 'sms' | 'push';
  status: 'active' | 'inactive' | 'maintenance';
  config: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface Conversation {
  id: string;
  channelId: string;
  participants: string[];
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  context: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  type: 'text' | 'image' | 'file' | 'audio';
  metadata?: Record<string, any>;
  createdAt: string;
}

interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
}

describe('Cross-Module Communication Tests', () => {
  let userId: string;
  let apiKey: string;
  let channelId: string;
  let conversationId: string;

  beforeAll(async () => {
    try {
      // Create test user
      const testUser: TestUser = await createTestUser();
      
      userId = testUser.userId;
      
      // Generate API key
      apiKey = await generateTestApiKey(userId);
    } catch (error) {
      console.error('Setup failed:', error);
      throw error;
    }
  });

  afterAll(async () => {
    // Clean up test data
    await cleanupTestData(userId);
  });

  it('should create a channel and retrieve it from another module', async () => {
    // Create a channel in the communication module
    const channelData = {
      name: 'Cross-Module Test Channel',
      type: 'email',
      status: 'active',
      config: { smtp_server: 'test.example.com' }
    };

    const createResponse = await makeAuthenticatedRequest<Channel>(
      '/communication/channels',
      'POST',
      channelData,
      apiKey
    );

    expect(createResponse.status).toBe(201);
    expect(createResponse.data.success).toBe(true);
    expect(createResponse.data.data?.name).toBe(channelData.name);
    
    channelId = createResponse.data.data?.id as string;
    expect(channelId).toBeDefined();

    // Simulate retrieving the channel from another module
    // This would typically be a different endpoint in a real scenario
    const retrieveResponse = await makeAuthenticatedRequest<Channel>(
      `/communication/channels/${channelId}`,
      'GET',
      undefined,
      apiKey
    );

    expect(retrieveResponse.status).toBe(200);
    expect(retrieveResponse.data.success).toBe(true);
    expect(retrieveResponse.data.data?.id).toBe(channelId);
    expect(retrieveResponse.data.data?.name).toBe(channelData.name);
  });

  it('should create a conversation and send a message from another module', async () => {
    // Skip if channel creation failed
    if (!channelId) {
      console.warn('Skipping test: Channel ID not available');
      return;
    }

    // Create a conversation
    const conversationData = {
      channelId,
      participants: ['user1', 'agent1'],
      status: 'open',
      priority: 'medium',
      context: 'support'
    };

    const conversationResponse = await makeAuthenticatedRequest<Conversation>(
      '/communication/conversations',
      'POST',
      conversationData,
      apiKey
    );

    expect(conversationResponse.status).toBe(201);
    expect(conversationResponse.data.success).toBe(true);
    expect(conversationResponse.data.data?.channelId).toBe(channelId);
    
    conversationId = conversationResponse.data.data?.id as string;
    expect(conversationId).toBeDefined();

    // Send a message to the conversation (simulating from another module)
    const messageData = {
      content: 'This is a test message from another module',
      senderId: 'user1',
      type: 'text'
    };

    const messageResponse = await makeAuthenticatedRequest<Message>(
      `/communication/conversations/${conversationId}/messages`,
      'POST',
      messageData,
      apiKey
    );

    expect(messageResponse.status).toBe(201);
    expect(messageResponse.data.success).toBe(true);
    expect(messageResponse.data.data?.content).toBe(messageData.content);
    expect(messageResponse.data.data?.conversationId).toBe(conversationId);
  });

  it('should use AI services from another module', async () => {
    // Create a test message for sentiment analysis
    const messageData = {
      text: 'I am very happy with the service provided',
    };

    // Request sentiment analysis (simulating from another module)
    const sentimentResponse = await makeAuthenticatedRequest<SentimentAnalysis>(
      '/communication/ai/sentiment',
      'POST',
      messageData,
      apiKey
    );

    expect(sentimentResponse.status).toBe(200);
    expect(sentimentResponse.data.success).toBe(true);
    expect(sentimentResponse.data.data?.sentiment).toBeDefined();
  });

  it('should verify integration with the authentication module', async () => {
    // Test that the authentication module properly validates API keys
    const validKeyResponse = await makeAuthenticatedRequest(
      '/auth/test',
      'GET',
      undefined,
      apiKey
    );

    expect(validKeyResponse.status).toBe(200);
    expect(validKeyResponse.data.success).toBe(true);

    // Test with invalid key
    const invalidKeyResponse = await makeAuthenticatedRequest(
      '/auth/test',
      'GET',
      undefined,
      'invalid-key-12345'
    );

    expect(invalidKeyResponse.status).toBe(401);
    expect(invalidKeyResponse.data.success).toBe(false);
  });

  it('should handle cross-module data exchange', async () => {
    // Create a conversation first to ensure we have a valid ID
    const conversationData = {
      channelId: 'new-channel-id',
      participants: ['user1', 'agent1'],
      status: 'open',
      priority: 'medium',
      context: 'support'
    };

    const createResponse = await makeAuthenticatedRequest<Conversation>(
      '/communication/conversations',
      'POST',
      conversationData,
      apiKey
    );
    
    expect(createResponse.status).toBe(201);
    expect(createResponse.data.success).toBe(true);
    
    const testConversationId = createResponse.data.data?.id;
    expect(testConversationId).toBeDefined();

    // Simulate a request from another module to get conversation data
    const conversationResponse = await makeAuthenticatedRequest<Conversation>(
      `/communication/conversations/${testConversationId}`,
      'GET',
      undefined,
      apiKey
    );

    expect(conversationResponse.status).toBe(200);
    expect(conversationResponse.data.success).toBe(true);
    // Just verify we got a valid response with an ID
    // For this test, we just check that we got a valid response with an ID
    expect(conversationResponse.data.data?.id).toBeTruthy();

    // Simulate updating conversation from another module
    const updateData = {
      status: 'closed',
      priority: 'low'
    };

    const updateResponse = await makeAuthenticatedRequest<Conversation>(
      `/communication/conversations/${testConversationId}`,
      'PUT',
      updateData,
      apiKey
    );

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.data.success).toBe(true);
    expect(updateResponse.data.data?.status).toBe(updateData.status);
    expect(updateResponse.data.data?.priority).toBe(updateData.priority);
  });
});
