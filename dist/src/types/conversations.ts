import { z } from 'zod'

export type ConversationStatus = 'open' | 'closed' | 'pending' | 'archived'

export type ConversationPriority = 'low' | 'medium' | 'high' | 'urgent'

export type ConversationType = 'chat' | 'email' | 'social' | 'whatsapp' | 'sms' | 'voice'

export interface Contact {
  id: string
  name?: string
  email?: string
  phone?: string
  avatar?: string
  createdAt: string
  updatedAt: string
  metadata?: Record<string, any>
}

export interface ConversationMetrics {
  firstResponseTime?: number
  avgResponseTime?: number
  totalMessages?: number
  customerMessages?: number
  agentMessages?: number
  closedAt?: string
  resolutionTimeMinutes?: number
}

export interface Conversation {
  id: string
  channelId: string
  contactId: string
  contact?: Contact
  title?: string
  preview?: string
  status: ConversationStatus
  priority: ConversationPriority
  type: ConversationType
  unreadCount: number
  lastMessageAt: string
  createdAt: string
  updatedAt: string
  assigned_to?: string
  assignedAt?: string
  tags?: string[]
  metadata?: Record<string, any>
  metrics?: ConversationMetrics
  receivedOutsideBusinessHours?: boolean
  scheduledResponse?: boolean
  resolutionTimeMinutes?: number
}

export interface CreateConversationInput {
  channelId: string;
  contactId: string;
  title?: string;
  content: string;
  type: ConversationType;
  priority?: ConversationPriority;
  metadata?: Record<string, any>;
}

export interface ConversationListFilters {
  status?: ConversationStatus | ConversationStatus[];
  channelId?: string | string[];
  type?: ConversationType | ConversationType[];
  priority?: ConversationPriority | ConversationPriority[];
  assigned_to?: string;
  tags?: string[];
  search?: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const conversationSchema = z.object({
  id: z.string(),
  channelId: z.string(),
  contactId: z.string(),
  contact: z.object({
    id: z.string(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    avatar: z.string().optional()
  }).optional(),
  title: z.string().optional(),
  preview: z.string().optional(),
  status: z.enum(['open', 'closed', 'pending', 'archived']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  type: z.enum(['chat', 'email', 'social', 'whatsapp', 'sms', 'voice']),
  unreadCount: z.number(),
  lastMessageAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  assigned_to: z.string().optional(),
  assignedAt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
  metrics: z.object({
    firstResponseTime: z.number().optional(),
    avgResponseTime: z.number().optional(),
    totalMessages: z.number().optional(),
    customerMessages: z.number().optional(),
    agentMessages: z.number().optional(),
    closedAt: z.string().optional(),
    resolutionTimeMinutes: z.number().optional()
  }).optional(),
  receivedOutsideBusinessHours: z.boolean().optional(),
  scheduledResponse: z.boolean().optional(),
  resolutionTimeMinutes: z.number().optional()
})
