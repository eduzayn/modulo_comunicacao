import { renderHook, act } from '@testing-library/react-hooks';
import { useChannels, useChannel } from '@/hooks/use-channels';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@/lib/query-client';
import { Channel } from '@/types/channels';

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

const mockChannels: Channel[] = [
  { 
    id: '1', 
    name: 'WhatsApp Channel', 
    type: 'whatsapp', 
    status: 'active',
    config: { apiKey: 'masked-key' },
    created_at: '2025-03-10T12:00:00Z',
    updated_at: '2025-03-10T12:00:00Z'
  },
  { 
    id: '2', 
    name: 'Email Channel', 
    type: 'email', 
    status: 'active',
    config: { smtpServer: 'smtp.example.com' },
    created_at: '2025-03-10T12:00:00Z',
    updated_at: '2025-03-10T12:00:00Z'
  },
];

describe('useChannels', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch channels successfully', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: mockChannels,
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    const wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useChannels(), { wrapper });
    
    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.channels).toEqual([]);
    
    // Wait for the query to resolve
    await waitForNextUpdate();
    
    // After loading, we should have channels
    expect(result.current.isLoading).toBe(false);
    expect(result.current.channels).toEqual(mockChannels);
    expect(result.current.isError).toBe(false);
    
    // Verify API was called correctly
    expect(authenticatedJsonFetch).toHaveBeenCalledWith(
      '/api/communication/channels',
      {},
      { 'x-api-key': 'test-key' }
    );
  });
  
  it('should handle error when fetching channels', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    authenticatedJsonFetch.mockRejectedValueOnce(new Error('Failed to fetch channels'));
    
    const wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useChannels(), { wrapper });
    
    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);
    
    // Wait for the query to resolve (with error)
    await waitForNextUpdate();
    
    // After error, we should have error state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeDefined();
    expect(result.current.channels).toEqual([]);
  });
  
  it('should create a new channel successfully', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    
    // Mock the initial fetch
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: mockChannels,
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    // Mock the mutation
    const newChannel: Partial<Channel> = {
      name: 'New Channel',
      type: 'sms',
      status: 'active',
      config: { apiKey: 'new-key' }
    };
    
    const createdChannel: Channel = {
      ...newChannel,
      id: '3',
      created_at: '2025-03-10T13:00:00Z',
      updated_at: '2025-03-10T13:00:00Z'
    } as Channel;
    
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: createdChannel,
      timestamp: '2025-03-10T13:00:00Z'
    });
    
    // Mock the refetch after mutation
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: [...mockChannels, createdChannel],
      timestamp: '2025-03-10T13:00:00Z'
    });
    
    const wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useChannels(), { wrapper });
    
    // Wait for initial fetch
    await waitForNextUpdate();
    
    // Create a new channel
    act(() => {
      result.current.createChannel(newChannel);
    });
    
    // Wait for mutation to complete
    await waitForNextUpdate();
    
    // Verify API was called correctly for mutation
    expect(authenticatedJsonFetch).toHaveBeenCalledWith(
      '/api/communication/channels',
      {
        method: 'POST',
        body: JSON.stringify(newChannel)
      },
      { 'x-api-key': 'test-key' }
    );
  });
});

describe('useChannel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch a single channel by ID', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: mockChannels[0],
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useChannel('1'), { wrapper });
    
    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.channel).toBeUndefined();
    
    // Wait for the query to resolve
    await waitForNextUpdate();
    
    // After loading, we should have the channel
    expect(result.current.isLoading).toBe(false);
    expect(result.current.channel).toEqual(mockChannels[0]);
    expect(result.current.isError).toBe(false);
    
    // Verify API was called correctly
    expect(authenticatedJsonFetch).toHaveBeenCalledWith(
      '/api/communication/channels/1',
      {},
      { 'x-api-key': 'test-key' }
    );
  });
  
  it('should handle error when fetching a single channel', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    authenticatedJsonFetch.mockRejectedValueOnce(new Error('Channel not found'));
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useChannel('999'), { wrapper });
    
    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);
    
    // Wait for the query to resolve (with error)
    await waitForNextUpdate();
    
    // After error, we should have error state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeDefined();
    expect(result.current.channel).toBeUndefined();
  });
  
  it('should update a channel successfully', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    
    // Mock the initial fetch
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: mockChannels[0],
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    // Mock the update mutation
    const updatedChannel = {
      ...mockChannels[0],
      name: 'Updated Channel Name',
      updated_at: '2025-03-10T14:00:00Z'
    };
    
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: updatedChannel,
      timestamp: '2025-03-10T14:00:00Z'
    });
    
    // Mock the refetch after mutation
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: updatedChannel,
      timestamp: '2025-03-10T14:00:00Z'
    });
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useChannel('1'), { wrapper });
    
    // Wait for initial fetch
    await waitForNextUpdate();
    
    // Update the channel
    act(() => {
      result.current.updateChannel({ name: 'Updated Channel Name' });
    });
    
    // Wait for mutation to complete
    await waitForNextUpdate();
    
    // Verify API was called correctly for mutation
    expect(authenticatedJsonFetch).toHaveBeenCalledWith(
      '/api/communication/channels/1',
      {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated Channel Name' })
      },
      { 'x-api-key': 'test-key' }
    );
  });
});
