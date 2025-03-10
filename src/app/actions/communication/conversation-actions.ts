'use server';

import { z } from 'zod';
import { Conversation, Message } from '../../src/modules/communication/types';

const messageSchema = z.object({
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  type: z.enum(['text', 'image', 'document', 'audio']).default('text'),
  senderId: z.string(),
  metadata: z.record(z.any()).optional().default({}),
});

const conversationSchema = z.object({
  channelId: z.string(),
  participants: z.array(z.string()).min(1, 'Pelo menos um participante é obrigatório'),
  status: z.enum(['open', 'closed', 'pending']).default('open'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  context: z.enum(['academic', 'administrative', 'support']).default('academic'),
});

type MessageInput = z.infer<typeof messageSchema>;
type ConversationInput = z.infer<typeof conversationSchema>;
type ActionResponse<T> = { success: boolean; data?: T; error?: string };

export async function getConversations(): Promise<Conversation[]> {
  // This would be replaced with a database call
  const response = await fetch('http://localhost:3000/api/communication/conversations');
  const conversations = await response.json();
  return conversations;
}

export async function getConversation(id: string): Promise<Conversation | null> {
  // This would be replaced with a database call
  const response = await fetch(`http://localhost:3000/api/communication/conversations/${id}`);
  if (!response.ok) return null;
  const conversation = await response.json();
  return conversation;
}

export async function createConversation(data: ConversationInput): Promise<ActionResponse<Conversation>> {
  try {
    const validated = conversationSchema.parse(data);
    
    // This would be replaced with a database call
    const response = await fetch('http://localhost:3000/api/communication/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validated),
    });
    
    const conversation = await response.json();
    return { success: true, data: conversation };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Falha ao criar conversa' };
  }
}

export async function addMessage(conversationId: string, data: MessageInput): Promise<ActionResponse<Message>> {
  try {
    const validated = messageSchema.parse(data);
    
    // This would be replaced with a database call
    const response = await fetch(`http://localhost:3000/api/communication/conversations/${conversationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validated),
    });
    
    const message = await response.json();
    return { success: true, data: message };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Falha ao adicionar mensagem' };
  }
}

export async function updateConversationStatus(
  id: string, 
  status: 'open' | 'closed' | 'pending'
): Promise<ActionResponse<Conversation>> {
  try {
    // This would be replaced with a database call
    const response = await fetch(`http://localhost:3000/api/communication/conversations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    const conversation = await response.json();
    return { success: true, data: conversation };
  } catch (error) {
    return { success: false, error: 'Falha ao atualizar status da conversa' };
  }
}
