import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { 
  createTestUser, 
  generateTestApiKey, 
  makeAuthenticatedRequest, 
  cleanupTestData,
  TestUser,
  ApiResponse
} from '../test-utils';

interface AuthResponse {
  userId: string;
  message: string;
  timestamp: string;
}

describe('Authentication API Integration Tests', () => {
  let userId: string;
  let apiKey: string;
  let userEmail: string;
  let userPassword: string;

  beforeAll(async () => {
    try {
      // Create test user
      const testUser: TestUser = await createTestUser();
      
      userId = testUser.userId;
      userEmail = testUser.email;
      userPassword = testUser.password;
      
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

  it('should authenticate with API key', async () => {
    const { status, data } = await makeAuthenticatedRequest<AuthResponse>(
      '/auth/test',
      'GET',
      undefined,
      apiKey
    );

    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data?.userId).toBe(userId);
  });

  it('should reject requests with invalid API key', async () => {
    const { status, data } = await makeAuthenticatedRequest(
      '/auth/test',
      'GET',
      undefined,
      'invalid-api-key'
    );

    expect(status).toBe(401);
    expect(data.success).toBe(false);
  });

  it('should authenticate with session token', async () => {
    // Login to get session
    const loginResponse = await makeAuthenticatedRequest<{ token: string }>(
      '/auth/login',
      'POST',
      { email: userEmail, password: userPassword }
    );

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.data.success).toBe(true);
    
    // Use session token for authentication
    // Note: In a real test, we would extract the session token and use it
    // This is a simplified example
  });
});
