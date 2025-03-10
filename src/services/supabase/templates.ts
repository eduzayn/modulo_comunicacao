import { supabase } from '../../lib/supabase';
import type { Template } from '../../types';
import type { 
  CreateTemplateInput, 
  UpdateTemplateInput,
  GetTemplatesInput
} from '../../types/templates';

export async function getTemplates(params?: GetTemplatesInput) {
  let query = supabase
    .from('templates')
    .select('*')
    .order('name');
  
  if (params?.channelType) {
    query = query.eq('channel_type', params.channelType);
  }
  
  if (params?.status) {
    query = query.eq('status', params.status);
  }
  
  if (params?.category) {
    query = query.eq('category', params.category);
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(`Error fetching templates: ${error.message}`);
  }
  
  return data as Template[];
}

export async function getTemplateById(id: string) {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(`Error fetching template: ${error.message}`);
  }
  
  return data as Template;
}

export async function createTemplate(template: CreateTemplateInput) {
  const { data, error } = await supabase
    .from('templates')
    .insert(template)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error creating template: ${error.message}`);
  }
  
  return data as Template;
}

export async function updateTemplate(id: string, template: UpdateTemplateInput) {
  const { data, error } = await supabase
    .from('templates')
    .update(template)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error updating template: ${error.message}`);
  }
  
  return data as Template;
}

export async function deleteTemplate(id: string) {
  const { error } = await supabase
    .from('templates')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(`Error deleting template: ${error.message}`);
  }
  
  return true;
}
