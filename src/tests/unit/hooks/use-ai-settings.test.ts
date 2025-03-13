import { renderHook, act } from '@testing-library/react-hooks';
import { useAISettings } from '../../../hooks/use-ai-settings';
import { fetchAISettings, updateAISettings } from '../../../app/actions/ai-actions';

// Mock the server actions
jest.mock('../../../app/actions/ai-actions', () => ({
  fetchAISettings: jest.fn(),
  updateAISettings: jest.fn(),
}));

describe('useAISettings hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation
    (fetchAISettings as jest.Mock).mockResolvedValue({
      id: '1',
      openaiApiKey: 'test-key',
      defaultModel: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      userId: 'user-1',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    });
    
    (updateAISettings as jest.Mock).mockResolvedValue({
      id: '1',
      openaiApiKey: 'updated-key',
      defaultModel: 'gpt-3.5-turbo',
      temperature: 0.5,
      maxTokens: 1500,
      userId: 'user-1',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
    });
  });

  it('should fetch AI settings on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAISettings());
    
    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.settings).toBeUndefined();
    
    // Wait for the fetch to complete
    await waitForNextUpdate();
    
    // Should have called fetchAISettings
    expect(fetchAISettings).toHaveBeenCalledTimes(1);
    
    // Should have updated the state with the fetched settings
    expect(result.current.isLoading).toBe(false);
    expect(result.current.settings).toEqual({
      id: '1',
      openaiApiKey: 'test-key',
      defaultModel: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      userId: 'user-1',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    });
  });

  it('should update AI settings', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAISettings());
    
    // Wait for the initial fetch to complete
    await waitForNextUpdate();
    
    // Update the settings
    act(() => {
      result.current.updateSettings({
        openaiApiKey: 'updated-key',
        defaultModel: 'gpt-3.5-turbo',
        temperature: 0.5,
        maxTokens: 1500,
      });
    });
    
    // Should be in loading state
    expect(result.current.isUpdating).toBe(true);
    
    // Wait for the update to complete
    await waitForNextUpdate();
    
    // Should have called updateAISettings with the correct parameters
    expect(updateAISettings).toHaveBeenCalledTimes(1);
    expect(updateAISettings).toHaveBeenCalledWith({
      openaiApiKey: 'updated-key',
      defaultModel: 'gpt-3.5-turbo',
      temperature: 0.5,
      maxTokens: 1500,
    });
    
    // Should have updated the state with the new settings
    expect(result.current.isUpdating).toBe(false);
    expect(result.current.settings).toEqual({
      id: '1',
      openaiApiKey: 'updated-key',
      defaultModel: 'gpt-3.5-turbo',
      temperature: 0.5,
      maxTokens: 1500,
      userId: 'user-1',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
    });
  });

  it('should handle fetch errors', async () => {
    // Mock a fetch error
    (fetchAISettings as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    
    const { result, waitForNextUpdate } = renderHook(() => useAISettings());
    
    // Wait for the fetch to complete
    await waitForNextUpdate();
    
    // Should have set the error state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Failed to fetch');
  });

  it('should handle update errors', async () => {
    // First let the initial fetch succeed
    const { result, waitForNextUpdate } = renderHook(() => useAISettings());
    await waitForNextUpdate();
    
    // Then mock an update error
    (updateAISettings as jest.Mock).mockRejectedValue(new Error('Failed to update'));
    
    // Update the settings
    act(() => {
      result.current.updateSettings({
        openaiApiKey: 'updated-key',
      });
    });
    
    // Wait for the update to complete
    await waitForNextUpdate();
    
    // Should have set the error state
    expect(result.current.isUpdating).toBe(false);
    expect(result.current.error).toBe('Failed to update');
  });
});
