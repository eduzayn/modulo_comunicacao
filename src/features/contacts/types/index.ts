import { Contact, Database } from '@/types/database';

// Reexportando tipos de contatos
export type { Contact };

// Tipos específicos para a feature de contatos
export interface ContactFilters {
  query?: string;
  tagId?: string;
  isCustomer?: boolean;
}

export interface ContactWithRelated extends Contact {
  conversations?: Array<{
    id: string;
    last_message_at: string | null;
    status?: string;
    last_message?: string;
  }>;
  deals?: Array<{
    id: string;
    name: string;
    status: string;
    value?: number;
    stage?: {
      name: string;
    };
  }>;
}

export interface ContactServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Tipos específicos do Supabase
export type DbContact = Database['public']['Tables']['contacts']['Row']; 