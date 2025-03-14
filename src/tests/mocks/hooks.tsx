import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

// Create a wrapper with QueryClientProvider
export function createQueryClientWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// Helper function to render hooks with the QueryClientProvider
export function renderHookWithClient(hook: any) {
  const wrapper = createQueryClientWrapper();
  return renderHook(hook, { wrapper });
}
