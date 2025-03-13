import { supabase, supabaseAdmin } from '../../lib/supabase';
import type { Template } from '../../types';
import type { 
  CreateTemplateInput, 
  UpdateTemplateInput,
  GetTemplatesInput
} from '../../types/templates';
import type { Database } from '../../lib/database.types';

// Use admin client for operations that need to bypass RLS
const adminClient = supabaseAdmin || supabase;

// Helper function to convert database model to application model
function mapDbToTemplate(data: Database['public']['Tables']['templates']['Row']): Template {
  return {
    id: data.id,
    name: data.name,
    content: data.content,
    channelType: data.channel_type as Template['channelType'],
    category: data.category || '',
    variables: data.variables,
    version: 1, // Default version since not in DB schema
    status: data.status as Template['status']
  };
}

export async function getTemplates(params?: GetTemplatesInput) {
  let query = adminClient
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
  
  return data.map(mapDbToTemplate);
}

export async function getTemplateById(id: string) {
  const { data, error } = await adminClient
    .from('templates')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(`Error fetching template: ${error.message}`);
  }
  
  return mapDbToTemplate(data);
}

export async function createTemplate(template: CreateTemplateInput) {
  // Convert to database schema
  const dbTemplate = {
    name: template.name,
    content: template.content,
    channel_type: template.channelType,
    category: template.category || null,
    variables: template.variables || [],
    status: template.status
  };
  
  const { data, error } = await adminClient
    .from('templates')
    .insert(dbTemplate)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error creating template: ${error.message}`);
  }
  
  return mapDbToTemplate(data);
}

export async function updateTemplate(id: string, template: UpdateTemplateInput) {
  // Convert to database schema
  const dbTemplate: Partial<Database['public']['Tables']['templates']['Row']> = {};
  if (template.name !== undefined) dbTemplate.name = template.name;
  if (template.content !== undefined) dbTemplate.content = template.content;
  if (template.channelType !== undefined) dbTemplate.channel_type = template.channelType;
  if (template.category !== undefined) dbTemplate.category = template.category;
  if (template.variables !== undefined) dbTemplate.variables = template.variables;
  if (template.status !== undefined) dbTemplate.status = template.status;
  
  const { data, error } = await adminClient
    .from('templates')
    .update(dbTemplate)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error updating template: ${error.message}`);
  }
  
  return mapDbToTemplate(data);
}

export async function deleteTemplate(id: string) {
  const { error } = await adminClient
    .from('templates')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(`Error deleting template: ${error.message}`);
  }
  
  return true;
}
