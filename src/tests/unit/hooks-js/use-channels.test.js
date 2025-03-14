import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useChannels } from '../../../hooks/use-channels';

// Mock the server actions
jest.mock('../../../app/actions/channels-actions', () => ({
  fetchChannels: jest.fn(),
  fetchChannelsById: jest.fn(),
  addChannels: jest.fn(),
  editChannels: jest.fn(),
  removeChannels: jest.fn(),
}));

// Import the mocked module
import * as channelsActions from '../../../app/actions/channels-actions';

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

describe('useChannels hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch channels on mount', async () => {
    const mockChannels = [
      { id: '1', name: 'Channels 1', status: 'active' },
      { id: '2', name: 'Channels 2', status: 'inactive' },
    ];

    channelsActions.fetchChannels.mockResolvedValue({
      data: mockChannels,
      error: null,
    });

    const wrapper = createWrapper();
    const { result, waitFor } = renderHook(() => useChannels(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(channelsActions.fetchChannels).toHaveBeenCalledTimes(1);
    expect(result.current.channels).toEqual(mockChannels);
    expect(result.current.error).toBeNull();
  });
});
