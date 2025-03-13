import { renderHook } from '@testing-library/react-hooks';
import { useConversations } from '../../../hooks/use-conversations';
import { fetchConversations } from '../../../app/actions/conversation-actions';

// Mock the server actions
jest.mock('../../../app/actions/conversation-actions', () => ({
  fetchConversations: jest.fn(),
  fetchConversationById: jest.fn(),
  createConversation: jest.fn(),
  editConversation: jest.fn(),
  sendMessageToConversation: jest.fn(),
}));

describe('useConversations hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation
    (fetchConversations as jest.Mock).mockResolvedValue([
      {
        id: '1',
        title: 'Customer Support',
        channelId: 'channel-1',
        status: 'active',
        participants: [{ id: 'user-1', name: 'John' }],
        lastMessageAt: '2023-01-01T12:00:00Z',
        createdAt: '2023-01-01T10:00:00Z',
        updatedAt: '2023-01-01T12:00:00Z',
        messages: []
      }
    ]);
  });

  it('should fetch conversations on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useConversations());
    
    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.conversations).toEqual([]);
    
    // Wait for the fetch to complete
    await waitForNextUpdate();
    
    // Should have called fetchConversations
    expect(fetchConversations).toHaveBeenCalledTimes(1);
  });
});
