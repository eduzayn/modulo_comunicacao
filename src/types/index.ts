export interface Channel {
  id: string;
  name: string;
  type: "whatsapp" | "facebook" | "instagram" | "email" | "chat" | "sms" | "push";
  status: "active" | "inactive";
  config: Record<string, string | number | boolean | object | null>;
}

// Exportando a interface Conversation do arquivo conversations.ts
export type { 
  Conversation,
  ConversationStatus,
  ConversationPriority,
  ConversationType,
  Contact,
  ConversationMetrics,
  CreateConversationInput,
  ConversationListFilters
} from './conversations';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "document" | "audio";
  status: "sent" | "delivered" | "read";
  metadata: Record<string, string | number | boolean | object | null>;
  createdAt: Date;
}

export interface AISettings {
  model: string;
  temperature: number;
  maxTokens: number;
  autoRespond: boolean;
  sentimentAnalysis: boolean;
  suggestResponses: boolean;
}

export interface Template {
  id: string;
  name: string;
  content: string;
  variables: string[];
  channelType: "whatsapp" | "facebook" | "instagram" | "email" | "sms";
  category: string;
  version: number;
  status: "draft" | "active" | "archived";
}

export interface Automation {
  id: string;
  name: string;
  trigger: {
    type: string;
    conditions: Record<string, string | number | boolean | object | null>[];
  };
  actions: {
    type: string;
    params: Record<string, string | number | boolean | object | null>;
  }[];
  status: "active" | "inactive";
}
