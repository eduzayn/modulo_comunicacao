import { renderHook, act } from '@testing-library/react-hooks';
import { useChannels } from '@/hooks/use-channels';
import * as channelActions from '@/app/actions/channel-actions';

// Mock the channel actions
jest.mock('@/app/actions/channel-actions', () => ({
  fetchChannels: jest.fn(),
  fetchChannelById: jest.fn(),
  createChannel: jest.fn(),
  updateChannel: jest.fn(),
  deleteChannel: jest.fn(),
}));

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

    const { result, waitForNextUpdate } = renderHook(() => useChannels());

    expect(result.current.isLoading).toBe(true);
    expect(channelActions.fetchChannels).toHaveBeenCalledTimes(1);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.channels).toEqual(mockChannels);
    expect(result.current.error).toBeNull();
  });

  it('should fetch a channel by id', async () => {
    const mockChannel = {
      id: '1',
      name: 'Channel 1',
      type: 'whatsapp',
      status: 'active',
    };

    (channelActions.fetchChannelById as jest.Mock).mockResolvedValue({
      data: mockChannel,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHook(() => useChannels());

    act(() => {
      result.current.getChannelById('1');
    });

    expect(result.current.isLoading).toBe(true);
    expect(channelActions.fetchChannelById).toHaveBeenCalledWith('1');

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.selectedChannel).toEqual(mockChannel);
    expect(result.current.error).toBeNull();
  });

  // Add more tests for create, update, and delete operations
});
