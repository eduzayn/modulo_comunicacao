import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useConversations } from '../../../hooks/use-conversations';

// Mock the server actions
jest.mock('../../../app/actions/conversations-actions', () => ({
  fetchConversations: jest.fn(),
  fetchConversationsById: jest.fn(),
  addConversations: jest.fn(),
  editConversations: jest.fn(),
  removeConversations: jest.fn(),
}));

// Import the mocked module
import * as conversationsActions from '../../../app/actions/conversations-actions';

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // Add display name to fix ESLint error
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

describe('useConversations hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch conversations on mount', async () => {
    const mockConversations = [
      { id: '1', name: 'Conversations 1', status: 'active' },
      { id: '2', name: 'Conversations 2', status: 'inactive' },
    ];

    conversationsActions.fetchConversations.mockResolvedValue({
      data: mockConversations,
      error: null,
    });

    const wrapper = createWrapper();
    const { result, waitFor } = renderHook(() => useConversations(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(conversationsActions.fetchConversations).toHaveBeenCalledTimes(1);
    expect(result.current.conversations).toEqual(mockConversations);
    expect(result.current.error).toBeNull();
  });
});
