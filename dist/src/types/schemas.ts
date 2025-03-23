import { z } from 'zod';

export const channelSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.enum(['whatsapp', 'facebook', 'instagram', 'email', 'chat', 'sms', 'push']),
  status: z.enum(['active', 'inactive']),
  config: z.record(z.union([z.string(), z.number(), z.boolean(), z.object({}), z.null()])),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const conversationSchema = z.object({
  id: z.string(),
  channelId: z.string(),
  participants: z.array(z.string()),
  status: z.enum(['open', 'closed', 'archived']),
  priority: z.enum(['high', 'medium', 'low']),
  context: z.enum(['academic', 'administrative', 'support']),
  lastMessageAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const messageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  content: z.string(),
  type: z.enum(['text', 'image', 'file', 'audio']),
  status: z.enum(['sent', 'delivered', 'read']),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
  createdAt: z.string(),
});

export const templateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  channelType: z.enum(['whatsapp', 'facebook', 'instagram', 'email', 'chat', 'sms', 'push']),
  category: z.string(),
  variables: z.array(z.string()),
  version: z.number(),
  status: z.enum(['draft', 'active', 'archived']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const aiSettingsSchema = z.object({
  model: z.string().min(1, 'Modelo é obrigatório'),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().min(1),
  autoRespond: z.boolean(),
  sentimentAnalysis: z.boolean(),
  suggestResponses: z.boolean(),
});
