import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useChannels } from '../../../hooks/use-channels';

// Mock the server actions
jest.mock('../../../app/actions/channel-actions', () => ({
  fetchChannels: jest.fn(),
  fetchChannelById: jest.fn(),
  addChannel: jest.fn(),
  editChannel: jest.fn(),
  removeChannel: jest.fn(),
}));

// Import the mocked module
import * as channelActions from '../../../app/actions/channel-actions';

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "QueryClientWrapper";
  return Wrapper;
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useChannels hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch channels on mount', async () => {
    const mockChannels = [
      { id: '1', name: 'Channel 1', type: 'whatsapp', status: 'active' },
      { id: '2', name: 'Channel 2', type: 'email', status: 'inactive' },
    ];

    channelActions.fetchChannels.mockResolvedValue({
      data: mockChannels,
      error: null,
    });

    const wrapper = createWrapper();
    const { result, waitFor } = renderHook(() => useChannels(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(channelActions.fetchChannels).toHaveBeenCalledTimes(1);
    expect(result.current.channels).toEqual(mockChannels);
    expect(result.current.error).toBeNull();
  });
});
