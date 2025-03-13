import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Mock implementation for testing purposes
export function createServerClient(cookieStore: any) {
  // During testing, we return a mock client
  return {
    auth: {
      getUser: async () => ({
        data: {
          user: {
            id: '1',
            email: 'admin@edunexia.com',
          }
        },
        error: null
      })
    },
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => ({
            data: {
              name: 'Administrador',
              role: 'admin',
            },
            error: null
          })
        })
      })
    })
  };
}

export default createServerClient;
