import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

export const createQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 60, // 1 hour (formerly cacheTime)
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  // Only run on client side
  if (typeof window !== 'undefined') {
    const persister = createSyncStoragePersister({
      storage: window.localStorage,
      key: 'edunexia-communication-cache',
      throttleTime: 1000, // 1 second
      // No maxAge property in the current version
    });

    persistQueryClient({
      queryClient,
      persister,
      dehydrateOptions: {
        shouldDehydrateQuery: (query) => {
          // Only cache specific queries
          const queryKey = query.queryKey[0];
          return (
            typeof queryKey === 'string' &&
            ['conversations', 'messages', 'templates', 'channels'].includes(queryKey)
          );
        },
      },
    });
  }

  return queryClient;
};
