import { renderHook } from '@testing-library/react-hooks';
import { useChannels } from '../../../hooks/use-channels';
import { createQueryClientWrapper } from '../../mocks/hooks';

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

    const wrapper = createQueryClientWrapper();
    const { result, waitFor } = renderHook(() => useChannels(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(channelActions.fetchChannels).toHaveBeenCalledTimes(1);
    expect(result.current.channels).toEqual(mockChannels);
    expect(result.current.error).toBeNull();
  });
});
