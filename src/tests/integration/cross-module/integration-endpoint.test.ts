import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { 
  createTestUser, 
  generateTestApiKey, 
  makeAuthenticatedRequest, 
  cleanupTestData,
  TestUser,
  ApiResponse
} from '../test-utils';

describe('Integration Endpoint Tests', () => {
  let userId: string;
  let apiKey: string;

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

  it('should return integration status', async () => {
    const { status, data } = await makeAuthenticatedRequest(
      '/integration',
      'GET',
      undefined,
      apiKey
    );

    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data?.module).toBe('communication');
    expect(data.data?.integrationReady).toBe(true);
    expect(Array.isArray(data.data?.supportedFeatures)).toBe(true);
  });

  it('should handle ping action', async () => {
    const testData = { message: 'Hello from another module' };
    
    const { status, data } = await makeAuthenticatedRequest(
      '/integration',
      'POST',
      {
        action: 'ping',
        data: testData
      },
      apiKey
    );

    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data?.message).toBe('pong');
    expect(data.data?.receivedData).toEqual(testData);
  });

  it('should verify connection', async () => {
    const { status, data } = await makeAuthenticatedRequest(
      '/integration',
      'POST',
      {
        action: 'verify_connection'
      },
      apiKey
    );

    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data?.connected).toBe(true);
    expect(data.data?.userId).toBe(userId);
  });

  it('should handle data exchange', async () => {
    const testData = { 
      id: '123',
      name: 'Test Data',
      values: [1, 2, 3],
      nested: { key: 'value' }
    };
    
    const { status, data } = await makeAuthenticatedRequest(
      '/integration',
      'POST',
      {
        action: 'test_data_exchange',
        data: testData
      },
      apiKey
    );

    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data?.received).toEqual(testData);
    expect(data.data?.processed).toBe(true);
  });

  it('should reject unknown actions', async () => {
    const { status, data } = await makeAuthenticatedRequest(
      '/integration',
      'POST',
      {
        action: 'unknown_action',
        data: {}
      },
      apiKey
    );

    expect(status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Unknown action');
  });

  it('should reject unauthenticated requests', async () => {
    const { status, data } = await makeAuthenticatedRequest(
      '/integration',
      'GET'
      // No API key provided
    );

    expect(status).toBe(401);
    expect(data.success).toBe(false);
  });
});
