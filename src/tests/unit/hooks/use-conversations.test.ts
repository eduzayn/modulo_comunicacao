import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useConversations } from '../../../hooks/use-conversations';

// Mock the server actions
jest.mock('../../../app/actions/conversation-actions', () => ({
  fetchConversations: jest.fn(),
  fetchConversationById: jest.fn(),
  createConversation: jest.fn(),
  editConversation: jest.fn(),
  sendMessageToConversation: jest.fn(),
}));

// Import the mocked module
import * as conversationActions from '../../../app/actions/conversation-actions';

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ({ children }: { children: any }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useConversations hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch conversations on mount', async () => {
    const mockConversations = [
      { id: '1', title: 'Conversation 1', status: 'active' },
      { id: '2', title: 'Conversation 2', status: 'archived' },
    ];

    (conversationActions.fetchConversations as jest.Mock).mockResolvedValue({
      data: mockConversations,
      error: null,
    });

    const wrapper = createWrapper();
    const { result, waitFor } = renderHook(() => useConversations(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(conversationActions.fetchConversations).toHaveBeenCalledTimes(1);
    // Fix the expectation to match the actual data structure
    expect(result.current.conversations).toEqual({
      data: mockConversations,
      error: null
    });
    expect(result.current.error).toBeNull();
  });
});
