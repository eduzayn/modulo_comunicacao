import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// Test environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

// Define response types for better type safety
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Create Supabase client for tests
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Generate test API key
export async function generateTestApiKey(userId: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: userId,
        key_hash: `test-key-${Date.now()}`,
        name: 'Integration Test Key',
        is_active: true,
        expires_at: new Date(Date.now() + 86400000).toISOString() // 24 hours
      })
      .select()
      .single();

    if (error) throw error;
    return data.key_hash;
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
  const url = `${API_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json() as ApiResponse<T>;
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error making request to ${url}:`, error);
    return { 
      status: 500, 
      data: { success: false, error: 'Request failed' } as ApiResponse<T>
    };
  }
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
    const email = `test-${Date.now()}@example.com`;
    const password = 'Test123!@#';

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user?.id) throw new Error('User created but no ID returned');
    
    return { userId: data.user.id, email, password };
  } catch (error) {
    console.error('Error creating test user:', error);
    throw new Error('Failed to create test user');
  }
}

// Clean up test data
export async function cleanupTestData(userId: string): Promise<boolean> {
  try {
    // Delete API keys
    await supabase
      .from('api_keys')
      .delete()
      .eq('user_id', userId);

    // Delete user
    await supabase.auth.admin.deleteUser(userId);

    return true;
  } catch (error) {
    console.error('Error cleaning up test data:', error);
    return false;
  }
}
