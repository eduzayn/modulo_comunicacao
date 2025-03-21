export interface Channel {
  id: string;
  name: string;
  type: "whatsapp" | "email" | "chat" | "sms" | "push";
  status: "active" | "inactive";
  config: Record<string, any>;
}

export interface Conversation {
  id: string;
  channelId: string;
  participants: string[];
  messages: Message[];
  status: "open" | "closed" | "pending";
  priority: "low" | "medium" | "high";
  context: "academic" | "administrative" | "support";
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "document" | "audio";
  status: "sent" | "delivered" | "read";
  metadata: Record<string, any>;
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
  channelType: "whatsapp" | "email" | "sms";
  category: string;
  version: number;
  status: "draft" | "active" | "archived";
}

export interface Automation {
  id: string;
  name: string;
  trigger: {
    type: string;
    conditions: Record<string, any>[];
  };
  actions: {
    type: string;
    params: Record<string, any>;
  }[];
  status: "active" | "inactive";
}
