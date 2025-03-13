/**
 * Authentication service for Supabase
 */
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { BaseService, supabase } from './base-service';

// Types
interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key: string;
  permissions: string[];
  created_at: string;
  expires_at: string | null;
  last_used_at: string | null;
}

interface ApiKeyValidation {
  valid: boolean;
  userId?: string;
  role?: string;
  permissions?: string[];
}

interface SessionResult {
  success: boolean;
  session: any | null;
  error?: string;
}

/**
 * Authentication service for managing users and API keys
 */
export class AuthService extends BaseService {
  constructor() {
    super('auth.api_keys');
  }

  /**
   * Get the current session
   */
  async getSession(): Promise<SessionResult> {
    try {
      // For development/testing environments
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        return { 
          success: true, 
          session: { 
            user: { 
              id: 'dev-user-id', 
              role: 'admin',
              email: 'dev@example.com'
            } 
          } 
        };
      }
      
      // For production, use real session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        return { success: false, session: null, error: error.message };
      }
      
      return { success: true, session: data.session };
    } catch (error) {
      return { 
        success: false, 
        session: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Validate an API key
   */
  async validateApiKey(apiKey: string): Promise<ApiKeyValidation> {
    try {
      // For development mode, accept test keys
      if (process.env.NODE_ENV === 'development' && apiKey.startsWith('test-')) {
        return {
          valid: true,
          userId: 'dev-user',
          role: 'admin',
          permissions: ['*'],
        };
      }
      
      // Query the API keys table
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*, auth.users(id, role)')
        .eq('key', apiKey)
        .single();
      
      if (error || !data) {
        return { valid: false };
      }
      
      // Check if the key is expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return { valid: false };
      }
      
      // Update last used timestamp
      await supabase
        .from(this.tableName)
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', data.id);
      
      return {
        valid: true,
        userId: data.user_id,
        role: data.users?.role || 'user',
        permissions: data.permissions,
      };
    } catch (error) {
      console.error('Error validating API key:', error);
      return { valid: false };
    }
  }

  /**
   * Create a new API key for a user
   */
  async createApiKey(userId: string, name: string, permissions: string[] = [], expiresAt?: string): Promise<ApiKey | null> {
    try {
      // Generate a random API key
      const key = `key_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      const { data, error } = await supabase
        .from(this.tableName)
        .insert({
          user_id: userId,
          name,
          key,
          permissions,
          expires_at: expiresAt,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating API key:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error creating API key:', error);
      return null;
    }
  }

  /**
   * Get all API keys for a user
   */
  async getUserApiKeys(userId: string): Promise<ApiKey[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error getting user API keys:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error getting user API keys:', error);
      return [];
    }
  }

  /**
   * Delete an API key
   */
  async deleteApiKey(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);
      
      return !error;
    } catch (error) {
      console.error('Error deleting API key:', error);
      return false;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('auth.users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error getting user by ID:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }
}

// Create and export service instance
export const authService = new AuthService();

// Export individual functions from the service
export const {
  getSession,
  validateApiKey,
  createApiKey,
  getUserApiKeys,
  deleteApiKey,
  getUserById,
} = authService;
