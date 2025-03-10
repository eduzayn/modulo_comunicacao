'use server';

import { revalidatePath } from 'next/cache';
import { 
  getConversations, 
  getConversationById, 
  createConversation, 
  updateConversation,
  getConversationMessages,
  sendMessage
} from '../../services/supabase/conversations';
import type { 
  CreateConversationInput, 
  UpdateConversationInput,
  GetConversationsInput,
  SendMessageInput
} from '../../types/conversations';

export async function fetchConversations(params?: GetConversationsInput) {
  try {
    return { data: await getConversations(params), error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function fetchConversationById(id: string) {
  try {
    return { data: await getConversationById(id), error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function fetchConversationMessages(conversationId: string) {
  try {
    return { data: await getConversationMessages(conversationId), error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function addConversation(data: CreateConversationInput) {
  try {
    // Transform the data to match the database schema
    const conversationData = {
      channel_id: data.channelId,
      participants: data.participants,
      status: 'open',
      priority: data.priority || 'medium',
      context: data.context || 'support'
    };
    
    const conversation = await createConversation(conversationData as any);
    revalidatePath('/conversations');
    return { data: conversation, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function editConversation(id: string, data: UpdateConversationInput) {
  try {
    const conversation = await updateConversation(id, data);
    revalidatePath(`/conversations/${id}`);
    revalidatePath('/conversations');
    return { data: conversation, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function sendMessageToConversation(conversationId: string, message: SendMessageInput) {
  try {
    // Transform the message to match the database schema
    const messageData = {
      sender_id: message.conversationId,
      content: message.content,
      media_url: message.type === 'image' ? message.metadata?.url : undefined
    };
    
    const sentMessage = await sendMessage(conversationId, messageData as any);
    revalidatePath(`/conversations/${conversationId}`);
    return { data: sentMessage, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
