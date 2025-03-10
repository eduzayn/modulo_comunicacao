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

export interface GetConversationsInput {
  channelId?: string;
  status?: Conversation['status'];
  priority?: Conversation['priority'];
  context?: Conversation['context'];
  page?: number;
  limit?: number;
}
