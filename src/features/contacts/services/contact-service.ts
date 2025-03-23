import { supabase, TABELAS } from '@/lib/supabase/config';
import { 
  Contact, 
  ContactFilters, 
  ContactServiceResponse, 
  ContactWithRelated, 
  DbContact 
} from '../types';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

// Esquemas de validação
const contactSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido").nullable().optional(),
  phone: z.string().nullable().optional(),
  avatar_url: z.string().url("URL inválida").nullable().optional(),
  company: z.string().nullable().optional(),
  job_title: z.string().nullable().optional(),
  is_customer: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  notes: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  postal_code: z.string().nullable().optional(),
  custom_fields: z.record(z.any()).nullable().optional(),
});

const actionClient = createSafeActionClient();

export const contactService = {
  async getContacts(filters?: ContactFilters): Promise<ContactServiceResponse<ContactWithRelated[]>> {
    try {
      let query = supabase
        .from(TABELAS.CONTACTS)
        .select(`
          *,
          conversations:${TABELAS.CONVERSATIONS}(id, last_message_at),
          deals:${TABELAS.DEALS}(id, name, status)
        `)
        .order('created_at', { ascending: false });
      
      // Aplicar filtros se fornecidos
      if (filters?.query) {
        const searchTerm = `%${filters.query}%`;
        query = query.or(`name.ilike.${searchTerm},phone.ilike.${searchTerm},email.ilike.${searchTerm}`);
      }
      
      if (filters?.tagId) {
        query = query.contains('tags', [filters.tagId]);
      }
      
      if (filters?.isCustomer !== undefined) {
        query = query.eq('is_customer', filters.isCustomer);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return { success: true, data: data as unknown as ContactWithRelated[] };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_CONTACTS_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao obter contatos',
        },
      };
    }
  },
  
  // Método para buscar detalhes de um contato pelo ID
  getContactById: actionClient
    .action(async (id: string): Promise<ContactServiceResponse<ContactWithRelated>> => {
      try {
        const { data, error } = await supabase
          .from(TABELAS.CONTACTS)
          .select(`
            *,
            conversations:${TABELAS.CONVERSATIONS}(
              id, 
              last_message_at, 
              last_message,
              status
            ),
            deals:${TABELAS.DEALS}(
              id, 
              name, 
              status, 
              value,
              stage:${TABELAS.PIPELINE_STAGES}(name)
            )
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return { success: true, data: data as unknown as ContactWithRelated };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'GET_CONTACT_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao obter contato',
          },
        };
      }
    }),
  
  // Método para criar novo contato
  createContact: actionClient
    .schema(contactSchema)
    .action(async ({ parsedInput }): Promise<ContactServiceResponse<Contact>> => {
      try {
        const now = new Date().toISOString();
        
        const { data, error } = await supabase
          .from(TABELAS.CONTACTS)
          .insert({
            ...parsedInput,
            created_at: now,
            updated_at: now,
          })
          .select()
          .single();
        
        if (error) throw error;
        return { success: true, data: data as unknown as Contact };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'CREATE_CONTACT_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao criar contato',
          },
        };
      }
    }),
  
  // Método para atualizar um contato existente
  updateContact: actionClient
    .schema(contactSchema.partial())
    .action(async ({ parsedInput, id }: { parsedInput: Partial<Contact>, id: string }): Promise<ContactServiceResponse<Contact>> => {
      try {
        const { data, error } = await supabase
          .from(TABELAS.CONTACTS)
          .update({
            ...parsedInput,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return { success: true, data: data as unknown as Contact };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'UPDATE_CONTACT_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao atualizar contato',
          },
        };
      }
    }),
  
  // Método para excluir um contato pelo ID
  deleteContact: actionClient
    .action(async (id: string): Promise<ContactServiceResponse<void>> => {
      try {
        const { error } = await supabase
          .from(TABELAS.CONTACTS)
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'DELETE_CONTACT_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao excluir contato',
          },
        };
      }
    }),
  
  // Método para adicionar tag a um contato
  addTag: actionClient
    .action(async ({ contactId, tagId }: { contactId: string, tagId: string }): Promise<ContactServiceResponse<void>> => {
      try {
        // Primeiro, buscamos o contato para obter os tags atuais
        const { data: contact, error: getError } = await supabase
          .from(TABELAS.CONTACTS)
          .select('tags')
          .eq('id', contactId)
          .single();
        
        if (getError) throw getError;
        
        // Adiciona o novo tagId se ele ainda não existir
        const currentTags = contact?.tags || [];
        if (!currentTags.includes(tagId)) {
          const updatedTags = [...currentTags, tagId];
          
          const { error: updateError } = await supabase
            .from(TABELAS.CONTACTS)
            .update({
              tags: updatedTags,
              updated_at: new Date().toISOString(),
            })
            .eq('id', contactId);
          
          if (updateError) throw updateError;
        }
        
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'ADD_TAG_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao adicionar tag',
          },
        };
      }
    }),
  
  // Método para remover tag de um contato
  removeTag: actionClient
    .action(async ({ contactId, tagId }: { contactId: string, tagId: string }): Promise<ContactServiceResponse<void>> => {
      try {
        // Primeiro, buscamos o contato para obter os tags atuais
        const { data: contact, error: getError } = await supabase
          .from(TABELAS.CONTACTS)
          .select('tags')
          .eq('id', contactId)
          .single();
        
        if (getError) throw getError;
        
        // Remove o tagId se ele existir
        const currentTags = contact?.tags || [];
        const updatedTags = currentTags.filter(tag => tag !== tagId);
        
        // Atualiza somente se houve alteração
        if (currentTags.length !== updatedTags.length) {
          const { error: updateError } = await supabase
            .from(TABELAS.CONTACTS)
            .update({
              tags: updatedTags,
              updated_at: new Date().toISOString(),
            })
            .eq('id', contactId);
          
          if (updateError) throw updateError;
        }
        
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'REMOVE_TAG_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao remover tag',
          },
        };
      }
    }),
  
  // Método para marcar contato como cliente
  markAsCustomer: actionClient
    .action(async ({ contactId, isCustomer = true }: { contactId: string, isCustomer?: boolean }): Promise<ContactServiceResponse<void>> => {
      try {
        const { error } = await supabase
          .from(TABELAS.CONTACTS)
          .update({
            is_customer: isCustomer,
            updated_at: new Date().toISOString(),
          })
          .eq('id', contactId);
        
        if (error) throw error;
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'MARK_CUSTOMER_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao marcar como cliente',
          },
        };
      }
    })
}; 