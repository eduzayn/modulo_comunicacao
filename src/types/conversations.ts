import { Conversation } from './index';

export interface CreateConversationInput {
  channelId: string;
  participants: string[];
  priority?: Conversation['priority'];
  context?: Conversation['context'];
}

export interface UpdateConversationInput {
  status?: Conversation['status'];
  priority?: Conversation['priority'];
  context?: Conversation['context'];
}

export interface SendMessageInput {
  senderId: string;
  content: string;
  mediaUrl?: string;
  type?: 'text' | 'image' | 'file' | 'audio';
  metadata?: Record<string, any>;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type?: 'text' | 'image' | 'file' | 'audio' | 'document';
  status?: 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string | Date; // Accept both string and Date
}

export interface GetConversationsInput {
  channelId?: string;
  status?: Conversation['status'];
  priority?: Conversation['priority'];
  context?: Conversation['context'];
  page?: number;
  limit?: number;
}
