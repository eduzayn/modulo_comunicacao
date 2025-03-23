import { getConversationMessages, Message } from '@/services/conversation';

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  return getConversationMessages(conversationId);
}

export async function fetchMessagesPaginated(
  conversationId: string, 
  page: number = 1, 
  pageSize: number = 20
): Promise<{ messages: Message[], hasMore: boolean }> {
  const messages = await getConversationMessages(conversationId);
  
  // Simulação de paginação
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedMessages = messages.slice(start, end);
  
  return {
    messages: paginatedMessages,
    hasMore: end < messages.length
  };
}

export default {
  fetchMessages,
  fetchMessagesPaginated
}; 