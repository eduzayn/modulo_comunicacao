import { renderHook, act } from '@testing-library/react-hooks';
import { useConversations, useConversation } from '@/hooks/use-conversations';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@/lib/query-client';
import { Conversation, Message } from '@/types/conversations';

// Mock the API client
jest.mock('@/lib/api-client', () => ({
  authenticatedJsonFetch: jest.fn(),
}));

// Mock the auth hook
jest.mock('@/hooks/use-dev-auth', () => ({
  useDevAuth: () => ({
    getAuthHeaders: () => ({ 'x-api-key': 'test-key' }),
    isAuthenticated: true,
  }),
}));

const mockMessages = [
  {
    id: 'm1',
    conversation_id: '1',
    content: 'Hello, how can I help you?',
    sender_id: 'agent-1',
    sender_type: 'system',
    created_at: '2025-03-10T12:05:00Z',
  },
  {
    id: 'm2',
    conversation_id: '1',
    content: 'I have a question about my account',
    sender_id: 'user-1',
    sender_type: 'user',
    created_at: '2025-03-10T12:06:00Z',
  },
];

const mockConversations = [
  {
    id: '1',
    title: 'Support Conversation',
    status: 'open',
    channel_id: 'channel-1',
    user_id: 'user-1',
    created_at: '2025-03-10T12:00:00Z',
    updated_at: '2025-03-10T12:06:00Z',
    messages: mockMessages,
  },
  {
    id: '2',
    title: 'Sales Inquiry',
    status: 'open',
    channel_id: 'channel-2',
    user_id: 'user-2',
    created_at: '2025-03-10T11:00:00Z',
    updated_at: '2025-03-10T11:30:00Z',
    messages: [],
  },
];

describe('useConversations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch conversations successfully', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: {
        items: mockConversations,
        pagination: {
          page: 1,
          pageSize: 20,
          total: 2,
          totalPages: 1,
        }
      },
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    const wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useConversations(), { wrapper });
    
    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.conversations).toEqual([]);
    
    // Wait for the query to resolve
    await waitForNextUpdate();
    
    // After loading, we should have conversations
    expect(result.current.isLoading).toBe(false);
    expect(result.current.conversations).toEqual(mockConversations);
    expect(result.current.pagination).toBeDefined();
    expect(result.current.pagination.total).toBe(2);
    expect(result.current.isError).toBe(false);
    
    // Verify API was called correctly
    expect(authenticatedJsonFetch).toHaveBeenCalledWith(
      '/api/communication/conversations?page=1&pageSize=20',
      {},
      { 'x-api-key': 'test-key' }
    );
  });
  
  it('should handle error when fetching conversations', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    authenticatedJsonFetch.mockRejectedValueOnce(new Error('Failed to fetch conversations'));
    
    const wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useConversations(), { wrapper });
    
    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);
    
    // Wait for the query to resolve (with error)
    await waitForNextUpdate();
    
    // After error, we should have error state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeDefined();
    expect(result.current.conversations).toEqual([]);
  });
  
  it('should create a new conversation successfully', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    
    // Mock the initial fetch
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: {
        items: mockConversations,
        pagination: {
          page: 1,
          pageSize: 20,
          total: 2,
          totalPages: 1,
        }
      },
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    // Mock the mutation
    const newConversation = {
      title: 'New Conversation',
      channel_id: 'channel-3',
      status: 'open',
    };
    
    const createdConversation = {
      ...newConversation,
      id: '3',
      user_id: 'user-1',
      created_at: '2025-03-10T13:00:00Z',
      updated_at: '2025-03-10T13:00:00Z',
      messages: [],
    };
    
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: createdConversation,
      timestamp: '2025-03-10T13:00:00Z'
    });
    
    // Mock the refetch after mutation
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: {
        items: [...mockConversations, createdConversation],
        pagination: {
          page: 1,
          pageSize: 20,
          total: 3,
          totalPages: 1,
        }
      },
      timestamp: '2025-03-10T13:00:00Z'
    });
    
    const wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useConversations(), { wrapper });
    
    // Wait for initial fetch
    await waitForNextUpdate();
    
    // Create a new conversation
    act(() => {
      result.current.createConversation(newConversation);
    });
    
    // Wait for mutation to complete
    await waitForNextUpdate();
    
    // Verify API was called correctly for mutation
    expect(authenticatedJsonFetch).toHaveBeenCalledWith(
      '/api/communication/conversations',
      {
        method: 'POST',
        body: JSON.stringify(newConversation)
      },
      { 'x-api-key': 'test-key' }
    );
  });
  
  it('should handle pagination correctly', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    
    // Mock the initial fetch (page 1)
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: {
        items: mockConversations,
        pagination: {
          page: 1,
          pageSize: 20,
          total: 22,
          totalPages: 2,
        }
      },
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    const wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useConversations(), { wrapper });
    
    // Wait for initial fetch
    await waitForNextUpdate();
    
    // Mock the second page fetch
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: {
        items: [
          {
            id: '3',
            title: 'Another Conversation',
            status: 'closed',
            channel_id: 'channel-1',
            user_id: 'user-3',
            created_at: '2025-03-09T12:00:00Z',
            updated_at: '2025-03-09T12:30:00Z',
            messages: [],
          }
        ],
        pagination: {
          page: 2,
          pageSize: 20,
          total: 22,
          totalPages: 2,
        }
      },
      timestamp: '2025-03-10T12:01:00Z'
    });
    
    // Change page
    act(() => {
      result.current.setPage(2);
    });
    
    // Wait for the second fetch
    await waitForNextUpdate();
    
    // Verify API was called correctly for second page
    expect(authenticatedJsonFetch).toHaveBeenCalledWith(
      '/api/communication/conversations?page=2&pageSize=20',
      {},
      { 'x-api-key': 'test-key' }
    );
    
    // Verify pagination state updated
    expect(result.current.pagination.page).toBe(2);
  });
});

describe('useConversation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch a single conversation with messages', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    
    // Mock the conversation fetch
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: mockConversations[0],
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    // Mock the messages fetch
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: {
        items: mockMessages,
        pagination: {
          page: 1,
          pageSize: 20,
          total: 2,
          totalPages: 1,
        }
      },
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useConversation('1'), { wrapper });
    
    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.conversation).toBeUndefined();
    
    // Wait for the queries to resolve
    await waitForNextUpdate();
    
    // After loading, we should have the conversation and messages
    expect(result.current.isLoading).toBe(false);
    expect(result.current.conversation).toEqual(mockConversations[0]);
    expect(result.current.messages).toEqual(mockMessages);
    expect(result.current.isError).toBe(false);
    
    // Verify API was called correctly
    expect(authenticatedJsonFetch).toHaveBeenCalledWith(
      '/api/communication/conversations/1',
      {},
      { 'x-api-key': 'test-key' }
    );
    
    expect(authenticatedJsonFetch).toHaveBeenCalledWith(
      '/api/communication/conversations/1/messages?page=1&pageSize=20',
      {},
      { 'x-api-key': 'test-key' }
    );
  });
  
  it('should send a message successfully', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    
    // Mock the conversation fetch
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: mockConversations[0],
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    // Mock the messages fetch
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: {
        items: mockMessages,
        pagination: {
          page: 1,
          pageSize: 20,
          total: 2,
          totalPages: 1,
        }
      },
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    // Mock the send message mutation
    const newMessage = {
      content: 'This is a new message',
      sender_type: 'user',
    };
    
    const createdMessage: Message = {
      id: 'm3',
      conversation_id: '1',
      content: 'This is a new message',
      sender_id: 'user-1',
      sender_type: 'user',
      created_at: '2025-03-10T12:10:00Z',
    };
    
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: createdMessage,
      timestamp: '2025-03-10T12:10:00Z'
    });
    
    // Mock the refetch messages after sending
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: {
        items: [...mockMessages, createdMessage],
        pagination: {
          page: 1,
          pageSize: 20,
          total: 3,
          totalPages: 1,
        }
      },
      timestamp: '2025-03-10T12:10:00Z'
    });
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useConversation('1'), { wrapper });
    
    // Wait for initial fetches
    await waitForNextUpdate();
    
    // Send a message
    act(() => {
      result.current.sendMessage(newMessage);
    });
    
    // Wait for mutation to complete
    await waitForNextUpdate();
    
    // Verify API was called correctly for sending message
    expect(authenticatedJsonFetch).toHaveBeenCalledWith(
      '/api/communication/conversations/1/messages',
      {
        method: 'POST',
        body: JSON.stringify(newMessage)
      },
      { 'x-api-key': 'test-key' }
    );
  });
  
  it('should update conversation status successfully', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    
    // Mock the conversation fetch
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: mockConversations[0],
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    // Mock the messages fetch
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: {
        items: mockMessages,
        pagination: {
          page: 1,
          pageSize: 20,
          total: 2,
          totalPages: 1,
        }
      },
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    // Mock the update status mutation
    const updatedConversation = {
      ...mockConversations[0],
      status: 'closed',
      updated_at: '2025-03-10T12:15:00Z'
    };
    
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: updatedConversation,
      timestamp: '2025-03-10T12:15:00Z'
    });
    
    // Mock the refetch after mutation
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: updatedConversation,
      timestamp: '2025-03-10T12:15:00Z'
    });
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useConversation('1'), { wrapper });
    
    // Wait for initial fetches
    await waitForNextUpdate();
    
    // Update conversation status
    act(() => {
      result.current.updateStatus('closed');
    });
    
    // Wait for mutation to complete
    await waitForNextUpdate();
    
    // Verify API was called correctly for updating status
    expect(authenticatedJsonFetch).toHaveBeenCalledWith(
      '/api/communication/conversations/1',
      {
        method: 'PUT',
        body: JSON.stringify({ status: 'closed' })
      },
      { 'x-api-key': 'test-key' }
    );
  });
});
