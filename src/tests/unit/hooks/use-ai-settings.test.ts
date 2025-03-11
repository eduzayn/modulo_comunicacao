import { renderHook, act } from '@testing-library/react-hooks';
import { useAISettings } from '@/hooks/use-ai-settings';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@/lib/query-client';

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

const mockAISettings = {
  id: '1',
  provider: 'openai',
  model: 'gpt-4',
  api_key: 'sk-masked-key',
  settings: {
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 1,
  },
  created_at: '2025-03-10T12:00:00Z',
  updated_at: '2025-03-10T12:00:00Z',
};

describe('useAISettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch AI settings successfully', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: mockAISettings,
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    const wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useAISettings(), { wrapper });
    
    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.settings).toBeUndefined();
    
    // Wait for the query to resolve
    await waitForNextUpdate();
    
    // After loading, we should have settings
    expect(result.current.isLoading).toBe(false);
    expect(result.current.settings).toEqual(mockAISettings);
    expect(result.current.isError).toBe(false);
    
    // Verify API was called correctly
    expect(authenticatedJsonFetch).toHaveBeenCalledWith(
      '/api/communication/ai/settings',
      {},
      { 'x-api-key': 'test-key' }
    );
  });
  
  it('should handle error when fetching AI settings', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    authenticatedJsonFetch.mockRejectedValueOnce(new Error('Failed to fetch AI settings'));
    
    const wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useAISettings(), { wrapper });
    
    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);
    
    // Wait for the query to resolve (with error)
    await waitForNextUpdate();
    
    // After error, we should have error state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeDefined();
    expect(result.current.settings).toBeUndefined();
  });
  
  it('should update AI settings successfully', async () => {
    const { authenticatedJsonFetch } = require('@/lib/api-client');
    
    // Mock the initial fetch
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: mockAISettings,
      timestamp: '2025-03-10T12:00:00Z'
    });
    
    // Mock the update mutation
    const updatedSettings = {
      ...mockAISettings,
      model: 'gpt-4-turbo',
      settings: {
        ...mockAISettings.settings,
        temperature: 0.8,
      },
      updated_at: '2025-03-10T14:00:00Z'
    };
    
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: updatedSettings,
      timestamp: '2025-03-10T14:00:00Z'
    });
    
    // Mock the refetch after mutation
    authenticatedJsonFetch.mockResolvedValueOnce({
      success: true,
      data: updatedSettings,
      timestamp: '2025-03-10T14:00:00Z'
    });
    
    const wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>
        {children}
      </QueryClientProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useAISettings(), { wrapper });
    
    // Wait for initial fetch
    await waitForNextUpdate();
    
    // Update the settings
    act(() => {
      result.current.updateSettings({
        model: 'gpt-4-turbo',
        settings: {
          ...mockAISettings.settings,
          temperature: 0.8,
        },
      });
    });
    
    // Wait for mutation to complete
    await waitForNextUpdate();
    
    // Verify API was called correctly for mutation
    expect(authenticatedJsonFetch).toHaveBeenCalledWith(
      '/api/communication/ai/settings',
      {
        method: 'PUT',
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          settings: {
            ...mockAISettings.settings,
            temperature: 0.8,
          },
        })
      },
      { 'x-api-key': 'test-key' }
    );
    
    // Wait for refetch
    await waitForNextUpdate();
    
    // Verify settings were updated
    expect(result.current.settings).toEqual(updatedSettings);
  });
});
