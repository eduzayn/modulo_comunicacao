'use server';

import { revalidatePath } from 'next/cache';
import { 
  getTemplates, 
  getTemplateById, 
  createTemplate, 
  updateTemplate, 
  deleteTemplate 
} from '../../services/supabase/templates';
import type { 
  CreateTemplateInput, 
  UpdateTemplateInput,
  GetTemplatesInput
} from '../../types/templates';

export async function fetchTemplates(params?: GetTemplatesInput) {
  try {
    return { data: await getTemplates(params), error: null };
  } catch (error: unknown) {
    return { data: null, error: error.message };
  }
}

export async function fetchTemplateById(id: string) {
  try {
    return { data: await getTemplateById(id), error: null };
  } catch (error: unknown) {
    return { data: null, error: error.message };
  }
}

export async function addTemplate(data: CreateTemplateInput) {
  try {
    // Transform the data to match the database schema
    const templateData = {
      name: data.name,
      content: data.content,
      channel_type: data.channelType,
      category: data.category,
      variables: data.variables || [],
      status: data.status
    };
    
    const template = await createTemplate(templateData as any);
    revalidatePath('/templates');
    return { data: template, error: null };
  } catch (error: unknown) {
    return { data: null, error: error.message };
  }
}

export async function editTemplate(id: string, data: UpdateTemplateInput) {
  try {
    // Transform the data to match the database schema
    const templateData: unknown = {};
    if (data.name) templateData.name = data.name;
    if (data.content) templateData.content = data.content;
    if (data.channelType) templateData.channel_type = data.channelType;
    if (data.category) templateData.category = data.category;
    if (data.variables) templateData.variables = data.variables;
    if (data.status) templateData.status = data.status;
    
    const template = await updateTemplate(id, templateData);
    revalidatePath(`/templates/${id}`);
    revalidatePath('/templates');
    return { data: template, error: null };
  } catch (error: unknown) {
    return { data: null, error: error.message };
  }
}

export async function removeTemplate(id: string) {
  try {
    await deleteTemplate(id);
    revalidatePath('/templates');
    return { success: true, error: null };
  } catch (error: unknown) {
    return { success: false, error: error.message };
  }
}
