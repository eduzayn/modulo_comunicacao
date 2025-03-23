import { Conversation, Message, Note } from '@/types/database';
import { Database } from '@/types/supabase';

// Reexportando tipos do banco de dados
export type { Conversation, Message, Note };

// Tipos específicos para a feature de conversas
export interface ConversationFilters {
  status?: string;
  assignedTo?: string;
  channelId?: string;
  priority?: string;
  searchTerm?: string;
}

export interface ConversationWithDetails extends Conversation {
  contact?: {
    id: string;
    name: string;
    avatar_url?: string;
    email?: string;
    phone?: string;
  };
  channel?: {
    id: string;
    name: string;
    type: string;
    icon?: string;
  };
  assigned_user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  tags?: string[];
  unread_count?: number;
}

export interface NoteWithUser extends Note {
  user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface ConversationServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Tipos específicos do Supabase
export type DbConversation = Database['public']['Tables']['conversations']['Row'];
export type DbMessage = Database['public']['Tables']['messages']['Row'];
export type DbNote = Database['public']['Tables']['notes']['Row']; 