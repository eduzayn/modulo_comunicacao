import { renderHook, act } from '@testing-library/react-hooks';
import { useConversations } from '@/hooks/use-conversations';
import { fetchConversations, fetchConversationById } from '@/app/actions/conversation-actions';

// Mock the conversation actions
jest.mock('@/app/actions/conversation-actions', () => ({
  fetchConversations: jest.fn(),
  fetchConversationById: jest.fn(),
  createConversation: jest.fn(),
  updateConversation: jest.fn(),
  deleteConversation: jest.fn(),
}));

describe('useConversations hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch conversations on mount', async () => {
    const mockConversations = [
      { id: '1', title: 'Conversation 1', messages: [] },
      { id: '2', title: 'Conversation 2', messages: [] },
    ];

    (fetchConversations as jest.Mock).mockResolvedValue({
      data: mockConversations,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHook(() => useConversations());

    expect(result.current.isLoading).toBe(true);
    expect(fetchConversations).toHaveBeenCalledTimes(1);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.conversations).toEqual(mockConversations);
    expect(result.current.error).toBeNull();
  });

  it('should fetch a conversation by id', async () => {
    const mockConversation = {
      id: '1',
      title: 'Conversation 1',
      messages: [
        { id: 'm1', content: 'Hello', sender: 'user' },
        { id: 'm2', content: 'Hi there', sender: 'system' },
      ],
    };

    (fetchConversationById as jest.Mock).mockResolvedValue({
      data: mockConversation,
      error: null,
    });

    const { result, waitForNextUpdate } = renderHook(() => useConversations());

    act(() => {
      result.current.getConversationById('1');
    });

    expect(result.current.isLoading).toBe(true);
    expect(fetchConversationById).toHaveBeenCalledWith('1');

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.selectedConversation).toEqual(mockConversation);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch errors', async () => {
    const errorMessage = 'Failed to fetch conversations';
    
    (fetchConversations as jest.Mock).mockResolvedValue({
      data: null,
      error: errorMessage,
    });

    const { result, waitForNextUpdate } = renderHook(() => useConversations());

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.conversations).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });
});
