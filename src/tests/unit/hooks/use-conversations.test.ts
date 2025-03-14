import { renderHook, act } from '@testing-library/react-hooks';
import { useConversations } from '@/hooks/use-conversations';
import { renderHookWithClient } from '@/tests/mocks/hooks';

// Mock the server actions
jest.mock('@/app/actions/conversation-actions', () => ({
  fetchConversations: jest.fn(),
  fetchConversationById: jest.fn(),
  createConversation: jest.fn(),
  editConversation: jest.fn(),
  sendMessageToConversation: jest.fn(),
}));

// Import the mocked module
import * as conversationActions from '@/app/actions/conversation-actions';

describe('useConversations hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch conversations on mount', async () => {
    const mockConversations = [
      { id: '1', title: 'Conversation 1', status: 'active' },
      { id: '2', title: 'Conversation 2', status: 'archived' },
    ];

    (conversationActions.fetchConversations as jest.Mock).mockResolvedValue({
      data: mockConversations,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHookWithClient(() => useConversations());

    expect(result.current.isLoading).toBe(true);
    expect(conversationActions.fetchConversations).toHaveBeenCalledTimes(1);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.conversations).toEqual(mockConversations);
    expect(result.current.error).toBeNull();
  });

  it('should create a new conversation', async () => {
    const newConversation = {
      title: 'New Conversation',
      channelId: '123',
      status: 'active',
    };

    const createdConversation = {
      id: '3',
      ...newConversation,
      createdAt: new Date().toISOString(),
    };

    (conversationActions.createConversation as jest.Mock).mockResolvedValue({
      data: createdConversation,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHookWithClient(() => useConversations());

    await waitForNextUpdate(); // Wait for initial fetch

    act(() => {
      result.current.createConversation(newConversation);
    });

    expect(result.current.isCreating).toBe(true);
    expect(conversationActions.createConversation).toHaveBeenCalledWith(newConversation);
  });
});
