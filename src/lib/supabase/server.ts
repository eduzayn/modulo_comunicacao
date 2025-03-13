// // // // import { createClient } from '@supabase/supabase-js';

// Mock implementation for testing purposes
export function createServerClient() {
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
    from: () => ({
      select: () => ({
        eq: () => ({
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
