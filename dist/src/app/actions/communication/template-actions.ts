'use server';

import { z } from 'zod';
import { Template } from '../../src/modules/communication/types';

const templateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  variables: z.array(z.string()).optional().default([]),
  channelType: z.enum(['whatsapp', 'email', 'sms', 'chat', 'push']),
  category: z.string().optional(),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
});

type TemplateInput = z.infer<typeof templateSchema>;
type ActionResponse<T> = { success: boolean; data?: T; error?: string };

export async function getTemplates(): Promise<Template[]> {
  // This would be replaced with a database call
  const response = await fetch('http://localhost:3000/api/communication/templates');
  const templates = await response.json();
  return templates;
}

export async function getTemplate(id: string): Promise<Template | null> {
  // This would be replaced with a database call
  const response = await fetch(`http://localhost:3000/api/communication/templates/${id}`);
  if (!response.ok) return null;
  const template = await response.json();
  return template;
}

export async function createTemplate(data: TemplateInput): Promise<ActionResponse<Template>> {
  try {
    const validated = templateSchema.parse(data);
    
    // This would be replaced with a database call
    const response = await fetch('http://localhost:3000/api/communication/templates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validated),
    });
    
    const template = await response.json();
    return { success: true, data: template };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Falha ao criar template' };
  }
}

export async function updateTemplate(id: string, data: TemplateInput): Promise<ActionResponse<Template>> {
  try {
    const validated = templateSchema.parse(data);
    
    // This would be replaced with a database call
    const response = await fetch(`http://localhost:3000/api/communication/templates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validated),
    });
    
    const template = await response.json();
    return { success: true, data: template };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Falha ao atualizar template' };
  }
}
