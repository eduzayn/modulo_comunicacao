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
  conversationId: string;
  content: string;
  type?: 'text' | 'image' | 'file' | 'audio';
  metadata?: Record<string, unknown>;
}

export interface GetConversationsInput {
  channelId?: string;
  status?: Conversation['status'];
  priority?: Conversation['priority'];
  context?: Conversation['context'];
  page?: number;
  limit?: number;
}
