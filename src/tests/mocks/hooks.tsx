import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Creates a wrapper with QueryClientProvider for testing hooks
 * 
 * @returns A React component wrapper with QueryClientProvider
 */
export function createQueryClientWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ({ children }: { children: any }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// Add display name to fix ESLint error
createQueryClientWrapper.displayName = 'QueryClientWrapper';
