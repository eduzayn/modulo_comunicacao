import { supabase, TABELAS } from '@/lib/supabase/config';
import { 
  Conversation, 
  Message, 
  ConversationFilters, 
  ConversationServiceResponse, 
  ConversationWithDetails,
  NoteWithUser
} from '../types';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

// Esquemas de validação
const messageSchema = z.object({
  conversation_id: z.string().min(1, "ID da conversa é obrigatório"),
  sender_id: z.string().nullable().optional(),
  sender_type: z.enum(['contact', 'agent', 'system']),
  content: z.string().min(1, "Conteúdo da mensagem é obrigatório"),
  attachments: z.array(
    z.object({
      url: z.string().url("URL inválida"),
      filename: z.string(),
      type: z.string(),
      size: z.number()
    })
  ).nullable().optional(),
  is_read: z.boolean().default(false),
  metadata: z.record(z.any()).nullable().optional()
});

const statusSchema = z.enum(['aberta', 'fechada', 'em_espera']);

const noteSchema = z.object({
  conversationId: z.string().min(1, "ID da conversa é obrigatório"),
  userId: z.string().min(1, "ID do usuário é obrigatório"),
  content: z.string().min(1, "Conteúdo da nota é obrigatório")
});

const actionClient = createSafeActionClient();

export const conversationService = {
  // Método para listar conversas com filtros
  async getConversations(filters?: ConversationFilters): Promise<ConversationServiceResponse<ConversationWithDetails[]>> {
    try {
      let query = supabase
        .from(TABELAS.CONVERSATIONS)
        .select(`
          *,
          contact:${TABELAS.CONTACTS}(*),
          channel:${TABELAS.CHANNELS}(*),
          assigned_user:${TABELAS.PROFILES}(*)
        `)
        .order('last_message_at', { ascending: false });
      
      // Aplicar filtros
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.assignedTo) {
        if (filters.assignedTo === 'unassigned') {
          query = query.is('assigned_to', null);
        } else {
          query = query.eq('assigned_to', filters.assignedTo);
        }
      }

      if (filters?.channelId) {
        query = query.eq('channel_id', filters.channelId);
      }

      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }

      if (filters?.searchTerm) {
        query = query.textSearch('search_vector', filters.searchTerm);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return { success: true, data: data as unknown as ConversationWithDetails[] };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_CONVERSATIONS_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao obter conversas',
        },
      };
    }
  },
  
  // Método para obter detalhes de uma conversa
  getConversationById: actionClient
    .action(async (id: string): Promise<ConversationServiceResponse<ConversationWithDetails>> => {
      try {
        const { data, error } = await supabase
          .from(TABELAS.CONVERSATIONS)
          .select(`
            *,
            contact:${TABELAS.CONTACTS}(*),
            channel:${TABELAS.CHANNELS}(*),
            assigned_user:${TABELAS.PROFILES}(*)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return { success: true, data: data as unknown as ConversationWithDetails };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'GET_CONVERSATION_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao obter conversa',
          },
        };
      }
    }),
  
  // Método para listar mensagens de uma conversa
  getMessagesByConversationId: actionClient
    .action(async (conversationId: string): Promise<ConversationServiceResponse<Message[]>> => {
      try {
        const { data, error } = await supabase
          .from(TABELAS.MESSAGES)
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        return { success: true, data: data as unknown as Message[] };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'GET_MESSAGES_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao obter mensagens',
          },
        };
      }
    }),
  
  // Método para enviar uma mensagem
  sendMessage: actionClient
    .schema(messageSchema)
    .action(async ({ parsedInput }): Promise<ConversationServiceResponse<Message>> => {
      try {
        const now = new Date().toISOString();
        
        // Inserir a mensagem
        const { data, error } = await supabase
          .from(TABELAS.MESSAGES)
          .insert({
            ...parsedInput,
            created_at: now,
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Atualizar a última mensagem da conversa
        const { error: updateError } = await supabase
          .from(TABELAS.CONVERSATIONS)
          .update({
            last_message_at: now,
            updated_at: now,
            last_message: parsedInput.content.substring(0, 100),
          })
          .eq('id', parsedInput.conversation_id);
        
        if (updateError) throw updateError;
        
        return { success: true, data: data as unknown as Message };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'SEND_MESSAGE_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao enviar mensagem',
          },
        };
      }
    }),
  
  // Método para atualizar status de uma conversa
  updateConversationStatus: actionClient
    .schema(statusSchema)
    .action(async ({ parsedInput, id }: { parsedInput: z.infer<typeof statusSchema>, id: string }): Promise<ConversationServiceResponse<Conversation>> => {
      try {
        const { data, error } = await supabase
          .from(TABELAS.CONVERSATIONS)
          .update({
            status: parsedInput,
            updated_at: new Date().toISOString(),
            ...(parsedInput === 'fechada' ? { closed_at: new Date().toISOString() } : {}),
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return { success: true, data: data as unknown as Conversation };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'UPDATE_CONVERSATION_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao atualizar conversa',
          },
        };
      }
    }),
  
  // Método para atribuir uma conversa a um agente
  assignConversation: actionClient
    .action(async ({ id, userId }: { id: string, userId: string }): Promise<ConversationServiceResponse<Conversation>> => {
      try {
        const { data, error } = await supabase
          .from(TABELAS.CONVERSATIONS)
          .update({
            assigned_to: userId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return { success: true, data: data as unknown as Conversation };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'ASSIGN_CONVERSATION_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao atribuir conversa',
          },
        };
      }
    }),
  
  // Método para adicionar nota a uma conversa
  addNote: actionClient
    .schema(noteSchema)
    .action(async ({ parsedInput }): Promise<ConversationServiceResponse<Note>> => {
      try {
        const now = new Date().toISOString();
        
        const { data, error } = await supabase
          .from(TABELAS.CONVERSATION_NOTES)
          .insert({
            conversation_id: parsedInput.conversationId,
            user_id: parsedInput.userId,
            content: parsedInput.content,
            created_at: now,
            updated_at: now,
          })
          .select()
          .single();
        
        if (error) throw error;
        return { success: true, data: data as unknown as Note };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'ADD_NOTE_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao adicionar nota',
          },
        };
      }
    }),
  
  // Método para listar notas de uma conversa
  getNotesByConversationId: actionClient
    .action(async (conversationId: string): Promise<ConversationServiceResponse<NoteWithUser[]>> => {
      try {
        const { data, error } = await supabase
          .from(TABELAS.CONVERSATION_NOTES)
          .select(`
            *,
            user:${TABELAS.PROFILES}(*)
          `)
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { success: true, data: data as unknown as NoteWithUser[] };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'GET_NOTES_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao obter notas',
          },
        };
      }
    }),
}; 