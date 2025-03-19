/**
 * Supabase client configuration
 * 
 * This module provides a configured Supabase client for use throughout the application.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Initialize Supabase client using environment variables
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1ODYzMjIsImV4cCI6MjA1NzE2MjMyMn0.WGkiWL6VEazfIBHHz8LguEr8pRVy5XlbZT0iQ2rdfHU';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for browser usage (with anon key)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations that need to bypass RLS
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Get a Supabase client with admin privileges
 * 
 * This should only be used in server-side code where admin access is required.
 */
export function getAdminClient() {
  if (!supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations');
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
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
