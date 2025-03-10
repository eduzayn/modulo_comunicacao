'use server';

import { z } from 'zod';
import { Channel } from '../../src/modules/communication/types';

const channelSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum(['whatsapp', 'email', 'chat', 'sms', 'push']),
  status: z.enum(['active', 'inactive']),
  config: z.record(z.any()),
});

import type { CreateChannelInput, UpdateChannelInput } from '@/src/modules/communication/types/channels';
type ActionResponse<T> = { success: boolean; data?: T; error?: string };

export async function getChannels(): Promise<Channel[]> {
  // This would be replaced with a database call
  const response = await fetch('http://localhost:3000/api/communication/channels');
  const channels = await response.json();
  return channels;
}

export async function getChannel(id: string): Promise<Channel | null> {
  // This would be replaced with a database call
  const response = await fetch(`http://localhost:3000/api/communication/channels/${id}`);
  if (!response.ok) return null;
  const channel = await response.json();
  return channel;
}

export async function createChannel(data: CreateChannelInput): Promise<ActionResponse<Channel>> {
  try {
    const validated = channelSchema.parse(data);
    
    // This would be replaced with a database call
    const response = await fetch('http://localhost:3000/api/communication/channels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validated),
    });
    
    const channel = await response.json();
    return { success: true, data: channel };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Falha ao criar canal' };
  }
}

export async function updateChannel(id: string, data: UpdateChannelInput): Promise<ActionResponse<Channel>> {
  try {
    const validated = channelSchema.parse(data);
    
    // This would be replaced with a database call
    const response = await fetch(`http://localhost:3000/api/communication/channels/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validated),
    });
    
    const channel = await response.json();
    return { success: true, data: channel };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Falha ao atualizar canal' };
  }
}
