import { renderHook, act } from '@testing-library/react-hooks';
import { useChannels } from '@/hooks/use-channels';
import * as channelActions from '@/app/actions/channel-actions';

// Mock only the channel actions we're using in these tests
jest.mock('@/app/actions/channel-actions', () => ({
  fetchChannels: jest.fn(),
  fetchChannelById: jest.fn(),
  addChannel: jest.fn(),
  editChannel: jest.fn(),
  removeChannel: jest.fn(),
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

    const { result, waitForNextUpdate } = renderHook(() => useChannels());

    act(() => {
      result.current.createChannel(newChannel);
    });

    expect(result.current.isCreating).toBe(true);
    expect(channelActions.addChannel).toHaveBeenCalledWith(newChannel);

    await waitForNextUpdate();

    expect(result.current.isCreating).toBe(false);
  });

  it('should update a channel', async () => {
    const channelId = '1';
    const updateData = {
      name: 'Updated Channel',
      status: 'inactive',
    };

    const updatedChannel = {
      id: channelId,
      name: 'Updated Channel',
      type: 'whatsapp',
      status: 'inactive',
      config: { apiKey: 'test-key' },
      updatedAt: new Date().toISOString(),
    };

    (channelActions.editChannel as jest.Mock).mockResolvedValue({
      data: updatedChannel,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHook(() => useChannels());

    act(() => {
      result.current.updateChannel({ id: channelId, data: updateData });
    });

    expect(result.current.isUpdating).toBe(true);
    expect(channelActions.editChannel).toHaveBeenCalledWith(channelId, updateData);

    await waitForNextUpdate();

    expect(result.current.isUpdating).toBe(false);
  });

  it('should delete a channel', async () => {
    const channelId = '1';

    (channelActions.removeChannel as jest.Mock).mockResolvedValue({
      success: true,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHook(() => useChannels());

    act(() => {
      result.current.deleteChannel(channelId);
    });

    expect(result.current.isDeleting).toBe(true);
    expect(channelActions.removeChannel).toHaveBeenCalledWith(channelId);

    await waitForNextUpdate();

    expect(result.current.isDeleting).toBe(false);
  });
});
