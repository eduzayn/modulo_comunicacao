'use server';

import { revalidatePath } from 'next/cache';
import { getConversations, getConversationById, createConversation as createConversationService, updateConversation, sendMessage } from '../../services/supabase/conversations';
import type { CreateConversationInput, UpdateConversationInput, SendMessageInput } from '../../types/conversations';

/**
 * Fetch all conversations
 */
export async function fetchConversations() {
  try {
    return { data: await getConversations(), error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { data: null, error: errorMessage };
  }
}

/**
 * Fetch a conversation by ID
 */
export async function fetchConversationById(id: string) {
  try {
    return { data: await getConversationById(id), error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { data: null, error: errorMessage };
  }
}

/**
 * Create a new conversation
 */
export async function createConversation(data: CreateConversationInput) {
  try {
    const conversation = await createConversationService(data);
    revalidatePath('/conversations');
    return { data: conversation, error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { data: null, error: errorMessage };
  }
}

/**
 * Edit an existing conversation
 */
export async function editConversation(id: string, data: UpdateConversationInput) {
  try {
    const conversation = await updateConversation(id, data);
    revalidatePath(`/conversations/${id}`);
    revalidatePath('/conversations');
    return { data: conversation, error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { data: null, error: errorMessage };
  }
}

/**
 * Send a message to a conversation
 */
export async function sendMessageToConversation(id: string, data: SendMessageInput) {
  try {
    const message = await sendMessage(id, data);
    revalidatePath(`/conversations/${id}`);
    return { data: message, error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { data: null, error: errorMessage };
  }
}
