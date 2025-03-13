'use server';

import { revalidatePath } from 'next/cache';
import { 
  fetchConversations as fetchConversationsService,
  fetchConversationById as fetchConversationByIdService,
  createConversation as createConversationService,
  updateConversation as updateConversationService,
  sendMessage as sendMessageService
} from '../../services/supabase/conversations';
import type { 
  CreateConversationInput, 
  UpdateConversationInput,
  SendMessageInput
} from '../../types/conversations';

/**
 * Fetch all conversations
 */
export async function fetchConversations() {
  return fetchConversationsService();
}

/**
 * Fetch a conversation by ID
 */
export async function fetchConversationById(id: string) {
  return fetchConversationByIdService(id);
}

/**
 * Create a new conversation
 */
export async function createConversation(data: CreateConversationInput) {
  const result = await createConversationService(data);
  revalidatePath('/conversations');
  return result;
}

/**
 * Edit an existing conversation
 */
export async function editConversation(id: string, data: UpdateConversationInput) {
  const result = await updateConversationService(id, data);
  revalidatePath(`/conversations/${id}`);
  revalidatePath('/conversations');
  return result;
}

/**
 * Send a message to a conversation
 */
export async function sendMessageToConversation(conversationId: string, data: SendMessageInput) {
  const result = await sendMessageService(conversationId, data);
  revalidatePath(`/conversations/${conversationId}`);
  return result;
}
