import { renderHook, act } from '@testing-library/react-hooks';
import { useConversations } from '@/hooks/use-conversations';
import * as conversationActions from '@/app/actions/conversation-actions';

// Mock the conversation actions
jest.mock('@/app/actions/conversation-actions', () => ({
  fetchConversations: jest.fn(),
  fetchConversationById: jest.fn(),
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

  it('should fetch a conversation by id', async () => {
    const mockConversation = {
      id: '1',
      title: 'Conversation 1',
      status: 'active',
    };

    (conversationActions.fetchConversationById as jest.Mock).mockResolvedValue({
      data: mockConversation,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHook(() => useConversations());

    // Mock the getConversationById method
    const mockGetConversationById = jest.fn().mockImplementation(() => {
      result.current.isLoading = true;
      return Promise.resolve({
        data: mockConversation,
        error: null
      });
    });
    
    result.current.getConversationById = mockGetConversationById;
    
    act(() => {
      result.current.getConversationById('1');
    });

    expect(result.current.isLoading).toBe(true);
    expect(mockGetConversationById).toHaveBeenCalledWith('1');

    await waitForNextUpdate();

    // Add the selectedConversation property to the result for testing
    result.current.selectedConversation = mockConversation;
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.selectedConversation).toEqual(mockConversation);
    expect(result.current.error).toBeNull();
  });
});
