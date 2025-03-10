import { Channel } from './index';

export interface WhatsAppConfig {
  apiKey: string;
  phoneNumber: string;
  webhookUrl: string;
  messageTemplate?: string;
}

export interface EmailConfig {
  smtpServer: string;
  port: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

export interface SMSConfig {
  apiKey: string;
  senderId: string;
  webhookUrl: string;
}

export interface ChatConfig {
  websocketUrl: string;
  apiKey: string;
}

export interface PushConfig {
  apiKey: string;
  appId: string;
  projectId: string;
}

// Define as Json compatible type for database storage
export type ChannelConfig = WhatsAppConfig | EmailConfig | SMSConfig | ChatConfig | PushConfig;
export type ChannelConfigJson = Record<string, any>;

export interface CreateChannelInput {
  name: string;
  type: Channel['type'];
  status?: Channel['status'];
  config: ChannelConfig;
}

export interface UpdateChannelInput {
  name?: string;
  status?: Channel['status'];
  config?: Partial<ChannelConfig>;
}
