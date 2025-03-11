/**
 * Supabase client configuration
 * 
 * This module provides a configured Supabase client for use throughout the application.
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Get a Supabase client with admin privileges
 * 
 * This should only be used in server-side code where admin access is required.
 */
export function getAdminClient() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations');
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Create a Supabase client with a specific user's JWT
 * 
 * This is useful for operations that need to be performed with a user's permissions.
 */
export function createClientWithToken(token: string) {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}
