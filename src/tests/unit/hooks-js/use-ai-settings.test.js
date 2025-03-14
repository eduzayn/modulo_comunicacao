import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useAISettings } from '../../../hooks/use-ai-settings';

// Mock the server actions
jest.mock('../../../app/actions/ai-actions', () => ({
  fetchAISettings: jest.fn(),
  updateAISettingsAction: jest.fn(),
}));

// Import the mocked module
import * as aiActions from '../../../app/actions/ai-actions';

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

    aiActions.fetchAISettings.mockResolvedValue({
      data: mockSettings,
      error: null,
    });

    const wrapper = createWrapper();
    const { result, waitFor } = renderHook(() => useAISettings(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(aiActions.fetchAISettings).toHaveBeenCalledTimes(1);
    expect(result.current.settings).toEqual(mockSettings);
    expect(result.current.error).toBeNull();
  });
});
