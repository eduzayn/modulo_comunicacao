import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { 
  createTestUser, 
  generateTestApiKey, 
  makeAuthenticatedRequest, 
  cleanupTestData,
  TestUser,
  ApiResponse
} from '../test-utils';

// Define channel types for better type safety
interface Channel {
  id: string;
  name: string;
  type: 'whatsapp' | 'email' | 'chat' | 'sms' | 'push';
  status: 'active' | 'inactive' | 'maintenance';
  config: Record<string, string | number | boolean | object | null>;
  createdAt: string;
  updatedAt: string;
}

describe('Channels API Integration Tests', () => {
  let userId: string;
  let apiKey: string;
  let channelId: string;

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

  it('should create a new channel', async () => {
    const channelData = {
      name: 'Test WhatsApp Channel',
      type: 'whatsapp',
      status: 'active',
      config: { api_key: 'test-key', phone_number: '+1234567890' }
    };

    const { status, data } = await makeAuthenticatedRequest<Channel>(
      '/communication/channels',
      'POST',
      channelData,
      apiKey
    );

    expect(status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data?.name).toBe(channelData.name);
    expect(data.data?.type).toBe(channelData.type);
    
    // Save channel ID for later tests
    channelId = data.data?.id as string;
    expect(channelId).toBeDefined();
  });

  it('should get all channels', async () => {
    const { status, data } = await makeAuthenticatedRequest<Channel[]>(
      '/communication/channels',
      'GET',
      undefined,
      apiKey
    );

    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data?.length).toBeGreaterThan(0);
  });

  it('should get a channel by ID', async () => {
    const { status, data } = await makeAuthenticatedRequest<Channel>(
      `/communication/channels/${channelId}`,
      'GET',
      undefined,
      apiKey
    );

    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data?.id).toBe(channelId);
  });

  it('should update a channel', async () => {
    const updateData = {
      name: 'Updated Test Channel',
      status: 'inactive'
    };

    const { status, data } = await makeAuthenticatedRequest<Channel>(
      `/communication/channels/${channelId}`,
      'PUT',
      updateData,
      apiKey
    );

    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data?.name).toBe(updateData.name);
    expect(data.data?.status).toBe(updateData.status);
  });

  it('should delete a channel', async () => {
    const { status, data } = await makeAuthenticatedRequest(
      `/communication/channels/${channelId}`,
      'DELETE',
      undefined,
      apiKey
    );

    expect(status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should return 404 for non-existent channel', async () => {
    const { status, data } = await makeAuthenticatedRequest(
      '/communication/channels/non-existent-id',
      'GET',
      undefined,
      apiKey
    );

    expect(status).toBe(404);
    expect(data.success).toBe(false);
  });

  it('should validate channel data on creation', async () => {
    const invalidChannelData = {
      // Missing required name field
      type: 'invalid-type', // Invalid type
      status: 'active'
    };

    const { status, data } = await makeAuthenticatedRequest(
      '/communication/channels',
      'POST',
      invalidChannelData,
      apiKey
    );

    expect(status).toBe(400);
    expect(data.success).toBe(false);
  });
});
