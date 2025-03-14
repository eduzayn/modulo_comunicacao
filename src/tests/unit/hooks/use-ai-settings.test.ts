import { renderHook, act } from '@testing-library/react-hooks';
import { useAISettings } from '@/hooks/use-ai-settings';
import { renderHookWithClient } from '@/tests/mocks/hooks';

// Mock the server actions
jest.mock('@/app/actions/ai-actions', () => ({
  fetchAISettings: jest.fn(),
  updateAISettings: jest.fn(),
  updateAISettingsAction: jest.fn(),
}));

// Import the mocked module
import * as aiActions from '@/app/actions/ai-actions';

describe('useAISettings hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch AI settings on mount', async () => {
    const mockSettings = {
      id: '1',
      openaiApiKey: 'test-key',
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000,
    };

    (aiActions.fetchAISettings as jest.Mock).mockResolvedValue({
      data: mockSettings,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHookWithClient(() => useAISettings());

    expect(result.current.isLoading).toBe(true);
    expect(aiActions.fetchAISettings).toHaveBeenCalledTimes(1);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.settings).toEqual(mockSettings);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch errors', async () => {
    const errorMessage = 'Failed to fetch AI settings';
    (aiActions.fetchAISettings as jest.Mock).mockResolvedValue({
      data: null,
      error: errorMessage,
    });

    const { result, waitForNextUpdate } = renderHookWithClient(() => useAISettings());

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.settings).toBeNull();
    expect(result.current.error).toBe(errorMessage);
  });

  it('should update AI settings', async () => {
    const mockSettings = {
      id: '1',
      openaiApiKey: 'test-key',
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000,
    };

    const updatedSettings = {
      ...mockSettings,
      model: 'gpt-4',
      temperature: 0.8,
    };

    (aiActions.fetchAISettings as jest.Mock).mockResolvedValue({
      data: mockSettings,
      error: null,
    });

    (aiActions.updateAISettingsAction as jest.Mock).mockResolvedValue({
      data: updatedSettings,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHookWithClient(() => useAISettings());

    await waitForNextUpdate();

    act(() => {
      result.current.updateSettings({
        model: 'gpt-4',
        temperature: 0.8,
      });
    });

    expect(result.current.isUpdating).toBe(true);
    expect(aiActions.updateAISettingsAction).toHaveBeenCalledWith({
      model: 'gpt-4',
      temperature: 0.8,
    });
  });
});
