import { renderHook } from '@testing-library/react-hooks';
import { useChannels } from '../../../hooks/use-channels';
import { fetchChannels } from '../../../app/actions/channel-actions';

// Mock the server actions
jest.mock('../../../app/actions/channel-actions', () => ({
  fetchChannels: jest.fn(),
  createChannel: jest.fn(),
  updateChannel: jest.fn(),
  deleteChannel: jest.fn(),
}));

describe('useChannels hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation
    (fetchChannels as jest.Mock).mockResolvedValue([
      {
        id: '1',
        name: 'WhatsApp Channel',
        type: 'whatsapp',
        status: 'active',
        config: { apiKey: 'test-key' },
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      }
    ]);
  });

  it('should fetch channels on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useChannels());
    
    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.channels).toEqual([]);
    
    // Wait for the fetch to complete
    await waitForNextUpdate();
    
    // Should have called fetchChannels
    expect(fetchChannels).toHaveBeenCalledTimes(1);
  });
});
