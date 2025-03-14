import { renderHook, act } from '@testing-library/react-hooks';
import { useConversations } from '@/hooks/use-conversations';
import * as conversationActions from '@/app/actions/conversation-actions';

// Mock the conversation actions
jest.mock('@/app/actions/conversation-actions', () => ({
  fetchConversations: jest.fn(),
  fetchConversationById: jest.fn(),
  createConversation: jest.fn(),
  editConversation: jest.fn(),
  sendMessageToConversation: jest.fn(),
}));

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

    const { result, waitForNextUpdate } = renderHook(() => useConversations());

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

    const { result, waitForNextUpdate } = renderHook(() => useConversations());

    act(() => {
      result.current.createConversation(newConversation);
    });

    expect(result.current.isCreating).toBe(true);
    expect(conversationActions.createConversation).toHaveBeenCalledWith(newConversation);

    await waitForNextUpdate();

    expect(result.current.isCreating).toBe(false);
  });

  it('should update a conversation', async () => {
    const conversationId = '1';
    const updateData = {
      title: 'Updated Conversation',
      status: 'archived',
    };

    const updatedConversation = {
      id: conversationId,
      title: 'Updated Conversation',
      status: 'archived',
      updatedAt: new Date().toISOString(),
    };

    (conversationActions.editConversation as jest.Mock).mockResolvedValue({
      data: updatedConversation,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHook(() => useConversations());

    act(() => {
      result.current.updateConversation({ id: conversationId, data: updateData });
    });

    expect(result.current.isUpdating).toBe(true);
    expect(conversationActions.editConversation).toHaveBeenCalledWith(conversationId, updateData);

    await waitForNextUpdate();

    expect(result.current.isUpdating).toBe(false);
  });

  it('should send a message to a conversation', async () => {
    const conversationId = '1';
    const messageData = {
      content: 'Hello, world!',
      type: 'text',
    };

    const sentMessage = {
      id: '123',
      conversationId,
      ...messageData,
      createdAt: new Date().toISOString(),
    };

    (conversationActions.sendMessageToConversation as jest.Mock).mockResolvedValue({
      data: sentMessage,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHook(() => useConversations());

    act(() => {
      result.current.sendMessage({ conversationId, data: messageData });
    });

    expect(result.current.isSending).toBe(true);
    expect(conversationActions.sendMessageToConversation).toHaveBeenCalledWith(conversationId, messageData);

    await waitForNextUpdate();

    expect(result.current.isSending).toBe(false);
  });
});
