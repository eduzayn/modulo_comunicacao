import { renderHook, act } from '@testing-library/react-hooks';
import { useConversations } from '@/hooks/use-conversations';
import * as conversationActions from '@/app/actions/conversation-actions';

// Mock the conversation actions
jest.mock('@/app/actions/conversation-actions', () => ({
  fetchConversations: jest.fn(),
  fetchConversationById: jest.fn(),
  createConversation: jest.fn(),
  editConversation: jest.fn(),
  deleteConversation: jest.fn(),
  sendMessageToConversation: jest.fn(),
}));

describe('useConversations hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch conversations on mount', async () => {
    const mockConversations = [
      { id: '1', title: 'Conversation 1', channelId: '1', status: 'active' },
      { id: '2', title: 'Conversation 2', channelId: '2', status: 'closed' },
    ];

    (conversationActions.fetchConversations as jest.Mock).mockResolvedValue({
      data: mockConversations,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHook(() => useConversations());

    expect(result.current.isLoading).toBe(true);
    expect(conversationActions.fetchConversations).toHaveBeenCalledTimes(1);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.conversations).toEqual(mockConversations);
    expect(result.current.error).toBeNull();
  });

  it('should fetch a conversation by id', async () => {
    const mockConversation = {
      id: '1',
      title: 'Conversation 1',
      channelId: '1',
      status: 'active',
      messages: [],
    };

    (conversationActions.fetchConversationById as jest.Mock).mockResolvedValue({
      data: mockConversation,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHook(() => useConversations());

    act(() => {
      result.current.getConversationById('1');
    });

    expect(result.current.isLoading).toBe(true);
    expect(conversationActions.fetchConversationById).toHaveBeenCalledWith('1');

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.selectedConversation).toEqual(mockConversation);
    expect(result.current.error).toBeNull();
  });

  // Add more tests for create, update, delete, and send message operations
});
