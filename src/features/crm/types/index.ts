import { Deal, Pipeline, PipelineStage, DealActivity } from '@/types/database';
import { Database } from '@/types/supabase';

// Reexportando tipos de CRM
export type { Deal, Pipeline, PipelineStage, DealActivity };

// Tipos específicos para a feature de CRM
export interface DealFilter {
  stageId?: string;
  ownerId?: string;
  status?: 'aberta' | 'ganha' | 'perdida';
  contactId?: string;
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface DealWithRelations extends Deal {
  contact?: {
    id: string;
    name: string;
    email?: string;
    company?: string;
    avatar_url?: string;
  };
  stage?: {
    id: string;
    name: string;
    pipeline_id: string;
    order: number;
    color?: string;
  };
  owner?: {
    id: string;
    name: string;
    avatar_url?: string;
    email?: string;
  };
  activities?: DealActivityWithUser[];
}

export interface DealActivityWithUser extends DealActivity {
  user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface CRMServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface DealStats {
  total: number;
  openCount: number;
  wonCount: number;
  lostCount: number;
  totalValue: number;
  wonValue: number;
  averageDealSize: number;
  conversionRate: number;
}

// Tipos de payload para criar/atualizar
export interface CreateDealPayload {
  name: string;
  description?: string;
  contact_id: string;
  value?: number;
  currency: string;
  pipeline_id: string;
  stage_id: string;
  owner_id: string;
  expected_close_date?: string;
  custom_fields?: Record<string, any>;
}

export interface UpdateDealPayload {
  name?: string;
  description?: string;
  contact_id?: string;
  value?: number;
  currency?: string;
  pipeline_id?: string;
  stage_id?: string;
  owner_id?: string;
  expected_close_date?: string;
  custom_fields?: Record<string, any>;
}

export interface CreateActivityPayload {
  deal_id: string;
  type: 'nota' | 'email' | 'ligacao' | 'reuniao' | 'tarefa' | 'outro';
  title: string;
  description?: string;
  scheduled_at?: string;
  created_by: string;
  assigned_to?: string;
  status: 'pendente' | 'concluida' | 'cancelada';
  metadata?: Record<string, any>;
}

// Tipos específicos do Supabase
export type DbDeal = Database['public']['Tables']['deals']['Row'];
export type DbPipeline = Database['public']['Tables']['pipelines']['Row'];
export type DbPipelineStage = Database['public']['Tables']['pipeline_stages']['Row'];
export type DbDealActivity = Database['public']['Tables']['deal_activities']['Row']; 