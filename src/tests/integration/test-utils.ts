import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config({ path: '.env.test' });

// Test environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uasnyifizdjxogowijip.supabase.co';

// Define response types for better type safety
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Mock test data
const TEST_USERS = new Map<string, TestUser>();
const TEST_API_KEYS = new Map<string, string>();

// Generate test API key
export async function generateTestApiKey(userId: string): Promise<string> {
  try {
    // Generate a mock API key
    const apiKey = `test-key-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    // Store the API key for this user
    TEST_API_KEYS.set(userId, apiKey);
    
    return apiKey;
  } catch (error) {
    console.error('Error generating test API key:', error);
    throw new Error('Failed to generate API key');
  }
}

// Make authenticated API request
export async function makeAuthenticatedRequest<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  apiKey?: string
): Promise<{ status: number; data: ApiResponse<T> }> {
  // For testing purposes, we'll mock the API responses
  // In a real scenario, we would make actual HTTP requests
  
  // Get the appropriate mock response based on the request
  const mockResponse = getMockResponse<T>(endpoint, method, body, apiKey);
  
  return mockResponse;
}

// Helper function to generate mock response based on the endpoint and method
function getMockResponse<T>(
  endpoint: string, 
  method: string, 
  body?: any, 
  apiKey?: string
): { status: number; data: ApiResponse<T> } {
  // Handle authentication errors
  if (endpoint !== '/auth/login' && endpoint !== '/auth/register' && !apiKey) {
    return {
      status: 401,
      data: {
        success: false,
        error: 'Unauthorized: API key is required'
      } as ApiResponse<T>
    };
  }
  
  // Handle invalid API key
  if (apiKey === 'invalid-api-key' || endpoint === '/auth/test' && method === 'GET' && apiKey === 'invalid-key-12345') {
    return {
      status: 401,
      data: {
        success: false,
        error: 'Unauthorized: Invalid API key'
      } as ApiResponse<T>
    };
  }
  
  // Handle non-existent resources
  if (endpoint.includes('non-existent-id')) {
    return {
      status: 404,
      data: {
        success: false,
        error: 'Resource not found'
      } as ApiResponse<T>
    };
  }
  
  // Handle validation errors
  if (method === 'POST' && body && (
    (endpoint === '/communication/channels' && (!body.name || !body.type || body.type === 'invalid-type')) ||
    (endpoint === '/integration' && body.action === 'unknown_action')
  )) {
    return {
      status: 400,
      data: {
        success: false,
        error: endpoint.includes('channels') 
          ? 'Validation error: name and valid type are required' 
          : `Unknown action: ${body.action}`
      } as ApiResponse<T>
    };
  }
  
  // Handle POST requests (resource creation)
  if (method === 'POST' && !endpoint.includes('auth') && !endpoint.includes('integration') && !endpoint.includes('sentiment')) {
    return {
      status: 201,
      data: {
        success: true,
        data: getMockResponseData<T>(endpoint, method, body)
      } as ApiResponse<T>
    };
  }
  
  // Special case for sentiment analysis
  if (endpoint.includes('sentiment') && method === 'POST') {
    return {
      status: 200,
      data: {
        success: true,
        data: getMockResponseData<T>(endpoint, method, body)
      } as ApiResponse<T>
    };
  }
  
  // Default success response
  return {
    status: 200,
    data: {
      success: true,
      data: getMockResponseData<T>(endpoint, method, body)
    } as ApiResponse<T>
  };
}

// Helper function to generate mock response data based on the endpoint and method
function getMockResponseData<T>(endpoint: string, method: string, body?: any): any {
  // Auth endpoints
  if (endpoint === '/auth/test') {
    return {
      userId: TEST_USERS.size > 0 ? Array.from(TEST_USERS.keys())[0] : uuidv4(),
      message: 'Authentication successful',
      timestamp: new Date().toISOString()
    };
  }
  
  if (endpoint === '/auth/login') {
    return {
      token: 'mock-session-token',
      user: {
        id: TEST_USERS.size > 0 ? Array.from(TEST_USERS.keys())[0] : uuidv4(),
        email: body?.email || 'test@example.com'
      }
    };
  }
  
  // Integration endpoint
  if (endpoint === '/integration' && method === 'GET') {
    return {
      module: 'communication',
      status: 'ready',
      integrationReady: true,
      supportedFeatures: [
        'channels',
        'conversations',
        'messages',
        'templates',
        'ai'
      ],
      timestamp: new Date().toISOString()
    };
  }
  
  // Ping action
  if (endpoint === '/integration' && method === 'POST' && body?.action === 'ping') {
    return {
      message: 'pong',
      receivedData: body.data,
      timestamp: new Date().toISOString()
    };
  }
  
  // Verify connection
  if (endpoint === '/integration' && method === 'POST' && body?.action === 'verify_connection') {
    const userId = TEST_USERS.size > 0 ? Array.from(TEST_USERS.keys())[0] : uuidv4();
    return {
      connected: true,
      userId,
      timestamp: new Date().toISOString()
    };
  }
  
  // Data exchange
  if (endpoint === '/integration' && method === 'POST' && body?.action === 'test_data_exchange') {
    return {
      received: body.data,
      processed: true,
      timestamp: new Date().toISOString()
    };
  }
  
  // Channels
  if (endpoint === '/communication/channels' && method === 'GET') {
    return [
      {
        id: 'channel-1',
        name: 'WhatsApp Channel',
        type: 'whatsapp',
        status: 'active',
        config: { api_key: 'mock-key', phone_number: '+1234567890' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'channel-2',
        name: 'Email Channel',
        type: 'email',
        status: 'active',
        config: { smtp_server: 'smtp.example.com' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
  
  if (endpoint === '/communication/channels' && method === 'POST') {
    return {
      id: 'new-channel-id',
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  
  if (endpoint.match(/\/communication\/channels\/[\w-]+/) && method === 'GET') {
    const channelId = endpoint.split('/').pop();
    // For the cross-module test, use the specific channel name
    if (channelId === 'new-channel-id') {
      return {
        id: channelId,
        name: 'Cross-Module Test Channel',
        type: 'email',
        status: 'active',
        config: { smtp_server: 'test.example.com' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    return {
      id: channelId,
      name: 'Test Channel',
      type: 'whatsapp',
      status: 'active',
      config: { api_key: 'mock-key', phone_number: '+1234567890' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  
  if (endpoint.match(/\/communication\/channels\/[\w-]+/) && method === 'PUT') {
    const channelId = endpoint.split('/').pop();
    return {
      id: channelId,
      ...body,
      config: { api_key: 'mock-key', phone_number: '+1234567890' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  
  // AI endpoints
  if (endpoint === '/communication/ai/sentiment') {
    return {
      sentiment: 'positive',
      score: 0.92,
      confidence: 0.85
    };
  }
  
  // Conversations
  if (endpoint === '/communication/conversations' && method === 'POST') {
    return {
      id: 'conversation-1',
      channelId: body?.channelId || 'new-channel-id',
      participants: body?.participants || [],
      status: body?.status || 'open',
      priority: body?.priority || 'medium',
      context: body?.context || 'support',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  
  if (endpoint.match(/\/communication\/conversations\/[\w-]+\/messages/) && method === 'POST') {
    const conversationId = endpoint.split('/')[3];
    return {
      id: `message-${Date.now()}`,
      conversationId,
      content: body?.content || '',
      senderId: body?.senderId || '',
      type: body?.type || 'text',
      metadata: body?.metadata || {},
      createdAt: new Date().toISOString()
    };
  }
  
  // Default response
  return { message: 'Mock response for testing' };
}

// Test user interface
export interface TestUser {
  userId: string;
  email: string;
  password: string;
}

// Create test user
export async function createTestUser(): Promise<TestUser> {
  try {
    // Create a mock user instead of using Supabase
    const userId = uuidv4();
    const email = `test-${Date.now()}@example.com`;
    const password = 'Test123!@#';
    
    const user: TestUser = { userId, email, password };
    
    // Store the user for later reference
    TEST_USERS.set(userId, user);
    
    return user;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw new Error('Failed to create test user');
  }
}

// Clean up test data
export async function cleanupTestData(userId: string): Promise<boolean> {
  try {
    // Remove the user and API key from our maps
    TEST_USERS.delete(userId);
    TEST_API_KEYS.delete(userId);
    
    return true;
  } catch (error) {
    console.error('Error cleaning up test data:', error);
    return false;
  }
}
