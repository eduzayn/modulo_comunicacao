export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Channel {
  id: string;
  name: string;
  type: 'whatsapp' | 'telegram' | 'facebook' | 'instagram' | 'email';
  isActive: boolean;
  config: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'supervisor';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessHours {
  id: string;
  name: string;
  schedule: BusinessHoursSchedule[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessHoursSchedule {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Domingo, 6 = Sábado
  startTime: string; // Formato: "HH:MM"
  endTime: string; // Formato: "HH:MM"
  isActive: boolean;
}

export interface Automation {
  id: string;
  name: string;
  description?: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  conditions?: AutomationCondition[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AutomationTrigger = {
  type: 'message_received' | 'message_sent' | 'conversation_started' | 'tag_added' | 'schedule';
  config: Record<string, any>;
}

export type AutomationAction = {
  type: 'send_message' | 'add_tag' | 'assign_agent' | 'notify' | 'webhook';
  config: Record<string, any>;
}

export type AutomationCondition = {
  type: 'message_contains' | 'sender_is' | 'time_is' | 'tag_is';
  config: Record<string, any>;
}

export interface Bot {
  id: string;
  name: string;
  description?: string;
  triggers: BotTrigger[];
  responses: BotResponse[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BotTrigger = {
  type: 'keyword' | 'intent' | 'schedule';
  config: Record<string, any>;
}

export type BotResponse = {
  type: 'text' | 'image' | 'video' | 'file' | 'buttons' | 'list';
  content: Record<string, any>;
} 