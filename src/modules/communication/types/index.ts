export interface Channel {
  id: string;
  name: string;
  type: 'whatsapp' | 'email' | 'chat' | 'sms' | 'push';
  status: 'active' | 'inactive';
  config: Record<string, any>;
}

export interface Conversation {
  id: string;
  channelId: string;
  participants: string[];
  status: 'open' | 'closed' | 'archived';
  priority: 'high' | 'medium' | 'low';
  context: 'academic' | 'administrative' | 'support';
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  content: string;
  channelType: Channel['type'];
  category?: string;
  variables: string[];
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface AISettings {
  model: string;
  temperature: number;
  maxTokens: number;
  autoRespond: boolean;
  sentimentAnalysis: boolean;
  suggestResponses: boolean;
}
