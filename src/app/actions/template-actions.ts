'use server';

import { revalidatePath } from 'next/cache';
import { getTemplates, getTemplateById, createTemplate, updateTemplate, deleteTemplate } from '../../services/supabase/templates';
import type { CreateTemplateInput, UpdateTemplateInput } from '../../types/templates';

/**
 * Fetch all templates
 */
export async function fetchTemplates(params?: Record<string, unknown>) {
  try {
    return { data: await getTemplates(params), error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { data: null, error: errorMessage };
  }
}

/**
 * Fetch a template by ID
 */
export async function fetchTemplateById(id: string) {
  try {
    return { data: await getTemplateById(id), error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { data: null, error: errorMessage };
  }
}

/**
 * Add a new template
 */
export async function addTemplate(data: {
  name: string;
  content: string;
  channelType?: string;
  variables?: string[];
  status?: string;
}) {
  try {
    // Transform the data to match the database schema
    const templateData = {
      name: data.name,
      content: data.content,
      channel_type: data.channelType,
      variables: data.variables,
      status: data.status
    };
    
    const template = await createTemplate(templateData as unknown as CreateTemplateInput);
    revalidatePath('/templates');
    return { data: template, error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { data: null, error: errorMessage };
  }
}

/**
 * Edit an existing template
 */
export async function editTemplate(id: string, data: UpdateTemplateInput) {
  try {
    // Transform the data to match the database schema
    const templateData: Record<string, unknown> = {};
    if (data.name) templateData.name = data.name;
    if (data.content) templateData.content = data.content;
    if (data.channelType) templateData.channel_type = data.channelType;
    if (data.variables) templateData.variables = data.variables;
    if (data.status) templateData.status = data.status;
    
    const template = await updateTemplate(id, templateData as Record<string, unknown>);
    revalidatePath(`/templates/${id}`);
    revalidatePath('/templates');
    return { data: template, error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { data: null, error: errorMessage };
  }
}

/**
 * Remove a template
 */
export async function removeTemplate(id: string) {
  try {
    await deleteTemplate(id);
    revalidatePath('/templates');
    return { success: true, error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
}
