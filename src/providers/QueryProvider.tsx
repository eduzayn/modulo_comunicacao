"use client";

/**
 * QueryProvider.tsx
 * 
 * Description: React Query provider for client components
 * 
 * @module providers/QueryProvider
 * @author Devin AI
 * @created 2025-03-14
 */
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * QueryProvider component
 * 
 * Provides React Query client to child components
 * 
 * @param props - Component props
 * @returns QueryProvider component
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export default QueryProvider;
