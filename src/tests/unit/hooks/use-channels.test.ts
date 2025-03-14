import { renderHook, act } from '@testing-library/react-hooks';
import { useChannels } from '@/hooks/use-channels';
import { renderHookWithClient } from '@/tests/mocks/hooks';

// Mock the server actions
jest.mock('@/app/actions/channel-actions', () => ({
  fetchChannels: jest.fn(),
  fetchChannelById: jest.fn(),
  addChannel: jest.fn(),
  editChannel: jest.fn(),
  removeChannel: jest.fn(),
}));

// Import the mocked module
import * as channelActions from '@/app/actions/channel-actions';

describe('useChannels hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch channels on mount', async () => {
    const mockChannels = [
      { id: '1', name: 'Channel 1', type: 'whatsapp', status: 'active' },
      { id: '2', name: 'Channel 2', type: 'email', status: 'inactive' },
    ];

    (channelActions.fetchChannels as jest.Mock).mockResolvedValue({
      data: mockChannels,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHookWithClient(() => useChannels());

    expect(result.current.isLoading).toBe(true);
    expect(channelActions.fetchChannels).toHaveBeenCalledTimes(1);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.channels).toEqual(mockChannels);
    expect(result.current.error).toBeNull();
  });

  it('should create a new channel', async () => {
    const newChannel = {
      name: 'New Channel',
      type: 'whatsapp',
      config: { apiKey: 'test-key' },
    };

    const createdChannel = {
      id: '3',
      ...newChannel,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    (channelActions.addChannel as jest.Mock).mockResolvedValue({
      data: createdChannel,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHookWithClient(() => useChannels());

    await waitForNextUpdate(); // Wait for initial fetch

    act(() => {
      result.current.createChannel(newChannel);
    });

    expect(result.current.isCreating).toBe(true);
    expect(channelActions.addChannel).toHaveBeenCalledWith(newChannel);
  });
});
