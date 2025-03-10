import { supabase } from '../../lib/supabase';
import type { Conversation } from '../../types';
import type { 
  CreateConversationInput, 
  UpdateConversationInput,
  SendMessageInput,
  GetConversationsInput
} from '../../types/conversations';

export async function getConversations(params?: GetConversationsInput) {
  let query = supabase
    .from('conversations')
    .select('*')
    .order('last_message_at', { ascending: false });
  
  if (params?.channelId) {
    query = query.eq('channel_id', params.channelId);
  }
  
  if (params?.status) {
    query = query.eq('status', params.status);
  }
  
  if (params?.priority) {
    query = query.eq('priority', params.priority);
  }
  
  if (params?.context) {
    query = query.eq('context', params.context);
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(`Error fetching conversations: ${error.message}`);
  }
  
  return data as Conversation[];
}

export async function getConversationById(id: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(`Error fetching conversation: ${error.message}`);
  }
  
  return data as Conversation;
}

export async function createConversation(conversation: CreateConversationInput) {
  const { data, error } = await supabase
    .from('conversations')
    .insert(conversation)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error creating conversation: ${error.message}`);
  }
  
  return data as Conversation;
}

export async function updateConversation(id: string, conversation: UpdateConversationInput) {
  const { data, error } = await supabase
    .from('conversations')
    .update(conversation)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error updating conversation: ${error.message}`);
  }
  
  return data as Conversation;
}

export async function getConversationMessages(conversationId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at');
  
  if (error) {
    throw new Error(`Error fetching messages: ${error.message}`);
  }
  
  return data;
}

export async function sendMessage(conversationId: string, message: SendMessageInput) {
  // First send the message
  const { data: messageData, error: messageError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: message.sender_id,
      content: message.content,
      media_url: message.media_url,
      read: false
    })
    .select()
    .single();
  
  if (messageError) {
    throw new Error(`Error sending message: ${messageError.message}`);
  }
  
  // Then update the conversation's last_message_at
  const { error: updateError } = await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId);
  
  if (updateError) {
    throw new Error(`Error updating conversation: ${updateError.message}`);
  }
  
  return messageData;
}
