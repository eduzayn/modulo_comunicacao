import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with fallback for development/testing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

// Create a mock client if credentials are missing
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    // Return mock client for development/testing
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              single: async () => ({ data: null, error: new Error('Mock client') })
            })
          })
        }),
        update: () => ({
          eq: async () => ({ error: null })
        })
      }),
      auth: {
        getSession: async () => ({ data: { session: null }, error: null })
      }
    };
  }
  
  return createClient(supabaseUrl, supabaseKey);
};

const supabase = createSupabaseClient();

export const authService = {
  /**
   * Validates an API key
   * @param apiKey The API key to validate
   * @returns Object with validation result and user ID if valid
   */
  async validateApiKey(apiKey: string) {
    try {
      // For development without Supabase, allow a test key
      if (process.env.NODE_ENV === 'development' && apiKey === 'test-api-key') {
        return { valid: true, userId: 'test-user-id' };
      }
      
      // Query the API keys table to validate the key
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, user_id, expires_at')
        .eq('key_hash', apiKey)
        .eq('is_active', true)
        .single();
      
      if (error || !data) {
        return { valid: false, userId: null };
      }
      
      // Check if the key has expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return { valid: false, userId: null };
      }
      
      // Update last used timestamp
      await supabase
        .from('api_keys')
        .update({ last_used: new Date().toISOString() })
        .eq('id', data.id);
      
      return { valid: true, userId: data.user_id };
    } catch (error) {
      console.error('API key validation error:', error);
      return { valid: false, userId: null };
    }
  },
  
  /**
   * Gets the current session
   * @returns Object with session data if authenticated
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        return { success: false, session: null, error: error.message };
      }
      
      return { success: true, session: data.session };
    } catch (error: any) {
      return { success: false, session: null, error: error.message };
    }
  },
  
  /**
   * Deletes an API key
   * @param keyId The ID of the API key to delete
   * @returns Boolean indicating success
   */
  async deleteApiKey(keyId: string) {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', keyId);
      
      return !error;
    } catch (error) {
      console.error('Error deleting API key:', error);
      return false;
    }
  }
};
