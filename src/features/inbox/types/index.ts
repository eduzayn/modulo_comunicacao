import { Tag, User } from '../../settings/types';

export interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  lastContact?: Date;
  notes?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'user' | 'contact' | 'system';
  content: string;
  attachments?: Attachment[];
  status: 'sent' | 'delivered' | 'read' | 'failed';
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'other';
  url: string;
  size: number; // em bytes
  mimeType: string;
  previewUrl?: string;
}

export interface Conversation {
  id: string;
  contactId: string;
  contact?: Contact;
  channelId: string;
  channelType: 'whatsapp' | 'telegram' | 'facebook' | 'instagram' | 'email' | 'other';
  status: 'active' | 'archived' | 'snoozed';
  assignedTo?: string; // ID do agente
  agent?: User;
  unreadCount: number;
  lastMessage?: Message;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationWithDetails extends Conversation {
  contact: Contact;
  lastMessage?: Message;
  agent?: User;
  tagObjects?: Tag[]; // Armazena os objetos de tags completos
}

export interface InboxFilters {
  status?: 'active' | 'archived' | 'snoozed';
  channelTypes?: string[];
  assignedTo?: string;
  tags?: string[];
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'lastMessage' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
} 