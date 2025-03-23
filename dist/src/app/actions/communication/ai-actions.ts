'use server';

import { z } from 'zod';
import { AISettings } from '../../src/modules/communication/types';

const aiSettingsSchema = z.object({
  model: z.string().min(1, 'Modelo é obrigatório'),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().min(1),
  autoRespond: z.boolean(),
  sentimentAnalysis: z.boolean(),
  suggestResponses: z.boolean(),
});

import type { UpdateAISettingsInput } from '@/src/modules/communication/types/ai';
type ActionResponse<T> = { success: boolean; data?: T; error?: string };

export async function getAISettings(): Promise<AISettings> {
  // This would be replaced with a database call
  const response = await fetch('http://localhost:3000/api/communication/ai/settings');
  const settings = await response.json();
  return settings;
}

export async function updateAISettings(data: UpdateAISettingsInput): Promise<ActionResponse<AISettings>> {
  try {
    const validated = aiSettingsSchema.parse(data);
    
    // This would be replaced with a database call
    const response = await fetch('http://localhost:3000/api/communication/ai/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validated),
    });
    
    const settings = await response.json();
    return { success: true, data: settings };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Falha ao atualizar configurações de IA' };
  }
}
