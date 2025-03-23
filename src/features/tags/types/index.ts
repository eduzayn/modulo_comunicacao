/**
 * Tipos para o módulo de Tags
 */

import { Database } from '@/types/supabase';

// Re-exportação de tipos da base de dados
export type Tag = Database['public']['Tables']['tags']['Row'];

// Tipos específicos para o serviço de tags
export interface TagFilter {
  search?: string;
  color?: string;
  type?: 'conversation' | 'contact' | 'deal' | 'all';
}

export type TagWithUsageCount = Tag & {
  usage_count: number;
};

export interface CreateTagPayload {
  name: string;
  color: string;
  type?: 'conversation' | 'contact' | 'deal';
  description?: string | null;
}

export interface UpdateTagPayload {
  name?: string;
  color?: string;
  description?: string | null;
}

export interface TagServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Tipos específicos para Supabase
export type TagsTable = Database['public']['Tables']['tags'];
export type TagRow = TagsTable['Row'];
export type TagInsert = TagsTable['Insert'];
export type TagUpdate = TagsTable['Update']; 