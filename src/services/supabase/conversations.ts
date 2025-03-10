import { supabase, supabaseAdmin } from '../../lib/supabase';
import type { Conversation, Message } from '../../types';
import type { 
  CreateConversationInput, 
  UpdateConversationInput,
  SendMessageInput,
  GetConversationsInput
} from '../../types/conversations';
import type { Database } from '../../lib/database.types';

// Use admin client for operations that need to bypass RLS
const adminClient = supabaseAdmin || supabase;

// Helper function to convert database model to application model
function mapDbToConversation(data: Database['public']['Tables']['conversations']['Row']): Conversation {
  return {
    id: data.id,
    channelId: data.channel_id,
    participants: data.participants,
    messages: [], // Messages are loaded separately
    status: data.status as Conversation['status'],
    priority: data.priority as Conversation['priority'],
    context: data.context as Conversation['context'],
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
}

// Helper function to convert database model to application model
function mapDbToMessage(data: Database['public']['Tables']['messages']['Row']): Message {
  return {
    id: data.id,
    conversationId: data.conversation_id,
    senderId: data.sender_id,
    content: data.content,
    type: data.media_url ? 'document' : 'text', // Infer type based on media_url
    status: data.read ? 'read' : 'delivered', // Infer status based on read flag
    metadata: {}, // Default metadata
    createdAt: new Date(data.created_at)
  };
}

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
  
  return data.map(mapDbToConversation);
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
  
  return mapDbToConversation(data);
}

export async function createConversation(conversation: CreateConversationInput) {
  // Convert to database schema
  const dbConversation = {
    channel_id: conversation.channelId,
    participants: conversation.participants,
    status: 'open', // Default status
    priority: 'medium', // Default priority
    context: 'support', // Default context
    last_message_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('conversations')
    .insert(dbConversation)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error creating conversation: ${error.message}`);
  }
  
  return mapDbToConversation(data);
}

export async function updateConversation(id: string, conversation: UpdateConversationInput) {
  // Convert to database schema
  const dbConversation: any = {};
  if (conversation.status !== undefined) dbConversation.status = conversation.status;
  if (conversation.priority !== undefined) dbConversation.priority = conversation.priority;
  if (conversation.context !== undefined) dbConversation.context = conversation.context;
  
  const { data, error } = await supabase
    .from('conversations')
    .update(dbConversation)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error updating conversation: ${error.message}`);
  }
  
  return mapDbToConversation(data);
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
  
  return data.map(mapDbToMessage);
}

export async function sendMessage(conversationId: string, message: SendMessageInput) {
  // First send the message
  const { data: messageData, error: messageError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: message.senderId,
      content: message.content,
      media_url: message.mediaUrl || null,
      read: false
    })
    .select()
    .single();
  
  if (messageError) {
    throw new Error(`Error sending message: ${messageError.message}`);
  }
  
  // Then update the conversation's last_message_at
  const { error: updateError } = await adminClient
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId);
  
  if (updateError) {
    throw new Error(`Error updating conversation: ${updateError.message}`);
  }
  
  return mapDbToMessage(messageData);
}
