import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { supabase, TABELAS } from '@/lib/supabase/config';
import { 
  Pipeline, 
  PipelineStage,
  Deal,
  DealActivity,
  DealWithRelations,
  DealActivityWithUser,
  CRMServiceResponse,
  CreateDealPayload,
  UpdateDealPayload,
  CreateActivityPayload,
  DealFilter
} from '../types';

// Esquemas de validação
const createDealSchema = z.object({
  name: z.string().min(1, "Nome da oportunidade é obrigatório"),
  description: z.string().nullable().optional(),
  contact_id: z.string().uuid("ID do contato inválido"),
  value: z.number().nonnegative().nullable().optional(),
  currency: z.string().min(1, "Moeda é obrigatória"),
  pipeline_id: z.string().uuid("ID do pipeline inválido"),
  stage_id: z.string().uuid("ID do estágio inválido"),
  owner_id: z.string().uuid("ID do responsável inválido"),
  expected_close_date: z.string().nullable().optional(),
  custom_fields: z.record(z.any()).nullable().optional(),
});

const updateDealSchema = createDealSchema.partial();

const idSchema = z.object({
  id: z.string().uuid("ID inválido"),
});

const createActivitySchema = z.object({
  deal_id: z.string().uuid("ID da oportunidade inválido"),
  type: z.enum(['nota', 'email', 'ligacao', 'reuniao', 'tarefa', 'outro']),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().nullable().optional(),
  scheduled_at: z.string().nullable().optional(),
  created_by: z.string().uuid("ID do criador inválido"),
  assigned_to: z.string().uuid("ID do responsável inválido").nullable().optional(),
  status: z.enum(['pendente', 'concluida', 'cancelada']),
  metadata: z.record(z.any()).nullable().optional(),
});

const closeDealSchema = z.object({
  id: z.string().uuid("ID inválido"),
  status: z.enum(['ganha', 'perdida']),
  reason: z.string().optional(),
});

const dealFilterSchema = z.object({
  stageId: z.string().optional(),
  ownerId: z.string().optional(),
  status: z.enum(['aberta', 'ganha', 'perdida']).optional(),
  contactId: z.string().optional(),
  search: z.string().optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
}).optional();

const actionClient = createSafeActionClient();

export const crmService = {
  // Métodos para pipelines
  getPipelines: actionClient
    .action(async (): Promise<CRMServiceResponse<Pipeline[]>> => {
      try {
        const { data, error } = await supabase
          .from(TABELAS.PIPELINES)
          .select('*')
          .order('is_default', { ascending: false });
        
        if (error) throw error;
        return { success: true, data: data as Pipeline[] };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'GET_PIPELINES_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao obter pipelines',
          },
        };
      }
    }),
  
  getPipelineStages: actionClient
    .schema(idSchema)
    .action(async ({ parsedInput }): Promise<CRMServiceResponse<PipelineStage[]>> => {
      try {
        const { data, error } = await supabase
          .from(TABELAS.PIPELINE_STAGES)
          .select('*')
          .eq('pipeline_id', parsedInput.id)
          .order('order', { ascending: true });
        
        if (error) throw error;
        return { success: true, data: data as PipelineStage[] };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'GET_PIPELINE_STAGES_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao obter estágios do pipeline',
          },
        };
      }
    }),
  
  // Métodos para deals
  getDeals: actionClient
    .schema(dealFilterSchema)
    .action(async ({ parsedInput }): Promise<CRMServiceResponse<DealWithRelations[]>> => {
      try {
        let query = supabase
          .from(TABELAS.DEALS)
          .select(`
            *,
            contact:${TABELAS.CONTACTS}(*),
            stage:${TABELAS.PIPELINE_STAGES}(*),
            owner:${TABELAS.PROFILES}(*)
          `)
          .order('updated_at', { ascending: false });
        
        // Aplicar filtros
        if (parsedInput) {
          if (parsedInput.stageId) {
            query = query.eq('stage_id', parsedInput.stageId);
          }
          
          if (parsedInput.ownerId) {
            query = query.eq('owner_id', parsedInput.ownerId);
          }
          
          if (parsedInput.status) {
            query = query.eq('status', parsedInput.status);
          } else {
            // Por padrão, mostrar apenas oportunidades abertas
            query = query.eq('status', 'aberta');
          }
          
          if (parsedInput.contactId) {
            query = query.eq('contact_id', parsedInput.contactId);
          }
          
          if (parsedInput.search) {
            query = query.ilike('name', `%${parsedInput.search}%`);
          }
          
          if (parsedInput.dateRange) {
            query = query.gte('created_at', parsedInput.dateRange.start.toISOString())
                         .lte('created_at', parsedInput.dateRange.end.toISOString());
          }
        } else {
          // Por padrão, mostrar apenas oportunidades abertas
          query = query.eq('status', 'aberta');
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return { success: true, data: data as unknown as DealWithRelations[] };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'GET_DEALS_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao obter oportunidades',
          },
        };
      }
    }),
  
  getDealById: actionClient
    .schema(idSchema)
    .action(async ({ parsedInput }): Promise<CRMServiceResponse<DealWithRelations>> => {
      try {
        const { data, error } = await supabase
          .from(TABELAS.DEALS)
          .select(`
            *,
            contact:${TABELAS.CONTACTS}(*),
            stage:${TABELAS.PIPELINE_STAGES}(*),
            owner:${TABELAS.PROFILES}(*)
          `)
          .eq('id', parsedInput.id)
          .single();
        
        if (error) throw error;
        return { success: true, data: data as unknown as DealWithRelations };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'GET_DEAL_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao obter oportunidade',
          },
        };
      }
    }),
  
  createDeal: actionClient
    .schema(createDealSchema)
    .action(async ({ parsedInput }): Promise<CRMServiceResponse<Deal>> => {
      try {
        const now = new Date().toISOString();
        
        const { data, error } = await supabase
          .from(TABELAS.DEALS)
          .insert({
            ...parsedInput,
            status: 'aberta', // Status padrão
            created_at: now,
            updated_at: now,
          })
          .select()
          .single();
        
        if (error) throw error;
        return { success: true, data: data as Deal };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'CREATE_DEAL_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao criar oportunidade',
          },
        };
      }
    }),
  
  updateDeal: actionClient
    .schema(z.object({
      id: idSchema.shape.id,
      ...updateDealSchema.shape
    }))
    .action(async ({ parsedInput }): Promise<CRMServiceResponse<Deal>> => {
      try {
        const { id, ...dealData } = parsedInput;
        
        const { data, error } = await supabase
          .from(TABELAS.DEALS)
          .update({
            ...dealData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return { success: true, data: data as Deal };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'UPDATE_DEAL_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao atualizar oportunidade',
          },
        };
      }
    }),
  
  moveToStage: actionClient
    .schema(z.object({
      id: idSchema.shape.id,
      stageId: z.string().uuid("ID do estágio inválido"),
    }))
    .action(async ({ parsedInput }): Promise<CRMServiceResponse<Deal>> => {
      try {
        const { data, error } = await supabase
          .from(TABELAS.DEALS)
          .update({
            stage_id: parsedInput.stageId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', parsedInput.id)
          .select()
          .single();
        
        if (error) throw error;
        return { success: true, data: data as Deal };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'MOVE_DEAL_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao mover oportunidade',
          },
        };
      }
    }),
  
  closeDeal: actionClient
    .schema(closeDealSchema)
    .action(async ({ parsedInput }): Promise<CRMServiceResponse<Deal>> => {
      try {
        const now = new Date().toISOString();
        
        const { data, error } = await supabase
          .from(TABELAS.DEALS)
          .update({
            status: parsedInput.status,
            closed_at: now,
            updated_at: now,
            ...(parsedInput.reason ? { description: parsedInput.reason } : {}),
          })
          .eq('id', parsedInput.id)
          .select()
          .single();
        
        if (error) throw error;
        return { success: true, data: data as Deal };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'CLOSE_DEAL_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao fechar oportunidade',
          },
        };
      }
    }),
  
  // Métodos para atividades
  getDealActivities: actionClient
    .schema(idSchema)
    .action(async ({ parsedInput }): Promise<CRMServiceResponse<DealActivityWithUser[]>> => {
      try {
        const { data, error } = await supabase
          .from(TABELAS.DEAL_ACTIVITIES)
          .select(`
            *,
            user:${TABELAS.PROFILES}(*)
          `)
          .eq('deal_id', parsedInput.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { success: true, data: data as unknown as DealActivityWithUser[] };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'GET_ACTIVITIES_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao obter atividades',
          },
        };
      }
    }),
  
  createActivity: actionClient
    .schema(createActivitySchema)
    .action(async ({ parsedInput }): Promise<CRMServiceResponse<DealActivity>> => {
      try {
        const now = new Date().toISOString();
        
        const { data, error } = await supabase
          .from(TABELAS.DEAL_ACTIVITIES)
          .insert({
            ...parsedInput,
            created_at: now,
            updated_at: now,
          })
          .select()
          .single();
        
        if (error) throw error;
        return { success: true, data: data as DealActivity };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'CREATE_ACTIVITY_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao criar atividade',
          },
        };
      }
    }),
  
  completeActivity: actionClient
    .schema(idSchema)
    .action(async ({ parsedInput }): Promise<CRMServiceResponse<DealActivity>> => {
      try {
        const now = new Date().toISOString();
        
        const { data, error } = await supabase
          .from(TABELAS.DEAL_ACTIVITIES)
          .update({
            status: 'concluida',
            completed_at: now,
            updated_at: now,
          })
          .eq('id', parsedInput.id)
          .select()
          .single();
        
        if (error) throw error;
        return { success: true, data: data as DealActivity };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'COMPLETE_ACTIVITY_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao concluir atividade',
          },
        };
      }
    })
}; 