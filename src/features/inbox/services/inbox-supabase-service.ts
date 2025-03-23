import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { 
  Conversation, 
  Message, 
  Contact, 
  InboxFilters, 
  ConversationWithDetails,
  Attachment
} from '../types';
import { tagService } from '../../settings/services/tag-service';
import { Tag } from '../../settings/types';
import { supabase, TABELAS } from '@/lib/supabase/config';
import { Database } from '@/types/supabase';

// Esquemas de validação
const attachmentSchema = z.object({
  name: z.string(),
  type: z.enum(['image', 'video', 'audio', 'document', 'other']),
  url: z.string().url(),
  size: z.number(),
  mimeType: z.string(),
  previewUrl: z.string().url().optional(),
});

const sendMessageSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1),
  attachments: z.array(attachmentSchema).optional(),
});

const assignConversationSchema = z.object({
  conversationId: z.string(),
  userId: z.string().optional(),
});

const changeConversationStatusSchema = z.object({
  conversationId: z.string(),
  status: z.enum(['active', 'archived', 'snoozed']),
});

const addTagToConversationSchema = z.object({
  conversationId: z.string(),
  tagId: z.string(),
});

const actionClient = createSafeActionClient();

// Tipos para as tabelas do Supabase
type DbConversation = Database['public']['Tables']['conversations']['Row'];
type DbMessage = Database['public']['Tables']['messages']['Row'];
type DbContact = Database['public']['Tables']['contacts']['Row'];
type DbTag = Database['public']['Tables']['tags']['Row'];
type DbConversationTag = Database['public']['Tables']['conversation_tags']['Row'];

// Funções de mapeamento entre tipos do DB e da aplicação
function mapDbConversationToConversation(dbConvo: DbConversation): Conversation {
  return {
    id: dbConvo.id,
    contactId: dbConvo.contact_id,
    channelId: dbConvo.channel_id,
    channelType: dbConvo.channel_type as any,
    status: dbConvo.status as any,
    assignedTo: dbConvo.assigned_to || undefined,
    unreadCount: dbConvo.unread_count || 0,
    tags: [], // será preenchido separadamente
    createdAt: new Date(dbConvo.created_at),
    updatedAt: new Date(dbConvo.updated_at),
  };
}

function mapDbMessageToMessage(dbMessage: DbMessage): Message {
  return {
    id: dbMessage.id,
    conversationId: dbMessage.conversation_id,
    senderId: dbMessage.sender_id,
    senderType: dbMessage.sender_type as any,
    content: dbMessage.content,
    status: dbMessage.status as any,
    attachments: dbMessage.attachments as any,
    createdAt: new Date(dbMessage.created_at),
  };
}

function mapDbContactToContact(dbContact: DbContact): Contact {
  return {
    id: dbContact.id,
    name: dbContact.name,
    phone: dbContact.phone || undefined,
    email: dbContact.email || undefined,
    avatar: dbContact.avatar_url || undefined,
    tags: [], // será preenchido separadamente
    createdAt: new Date(dbContact.created_at),
    updatedAt: new Date(dbContact.updated_at),
    lastContact: dbContact.last_contact ? new Date(dbContact.last_contact) : undefined,
  };
}

// Serviço de inbox utilizando Supabase
export const inboxSupabaseService = {
  /**
   * Obter conversas com filtros
   */
  getConversations: async (filters?: InboxFilters): Promise<ConversationWithDetails[]> => {
    try {
      // Iniciar consulta base
      let query = supabase
        .from(TABELAS.CONVERSATIONS)
        .select(`
          *,
          messages:${TABELAS.MESSAGES}(id, content, created_at, sender_type)
        `)
        .limit(1, { foreignTable: 'messages' })
        .order('created_at', { foreignTable: 'messages', ascending: false });

      // Aplicar filtros
      if (filters) {
        if (filters.status) {
          query = query.eq('status', filters.status);
        }

        if (filters.channelTypes && filters.channelTypes.length > 0) {
          query = query.in('channel_type', filters.channelTypes);
        }

        if (filters.assignedTo) {
          query = filters.assignedTo === 'unassigned' 
            ? query.is('assigned_to', null) 
            : query.eq('assigned_to', filters.assignedTo);
        }

        if (filters.search) {
          // Para pesquisa por texto, precisamos fazer join com contacts
          query = query.textSearch('search_vector', filters.search);
        }
      }

      // Ordenação
      const sortField = 
        filters?.sortBy === 'lastMessage' ? 'last_message_at' : 'updated_at';
      const sortDirection = 
        filters?.sortDirection === 'asc' ? true : false;
      
      query = query.order(sortField, { ascending: sortDirection });

      // Executar consulta
      const { data: dbConversations, error } = await query;

      if (error) {
        throw new Error(`Erro ao buscar conversas: ${error.message}`);
      }

      if (!dbConversations || dbConversations.length === 0) {
        return [];
      }

      // Conversões do formato DB para o formato da aplicação
      const conversations: Conversation[] = dbConversations.map(dbConvo => 
        mapDbConversationToConversation(dbConvo as unknown as DbConversation)
      );

      // Buscar contatos relacionados
      const contactIds = [...new Set(conversations.map(c => c.contactId))];
      const { data: dbContacts, error: contactsError } = await supabase
        .from(TABELAS.CONTACTS)
        .select('*')
        .in('id', contactIds);

      if (contactsError) {
        throw new Error(`Erro ao buscar contatos: ${contactsError.message}`);
      }

      // Buscar tags de conversas
      const conversationIds = conversations.map(c => c.id);
      const { data: conversationTags, error: tagsError } = await supabase
        .from('conversation_tags')
        .select('conversation_id, tag_id')
        .in('conversation_id', conversationIds);

      if (tagsError) {
        throw new Error(`Erro ao buscar tags das conversas: ${tagsError.message}`);
      }

      // Agrupar tags por conversação
      const tagsByConversation: Record<string, string[]> = {};
      conversationTags?.forEach(ct => {
        const convId = (ct as DbConversationTag).conversation_id;
        if (!tagsByConversation[convId]) {
          tagsByConversation[convId] = [];
        }
        tagsByConversation[convId].push((ct as DbConversationTag).tag_id);
      });

      // Adicionar tags às conversas
      conversations.forEach(conv => {
        conv.tags = tagsByConversation[conv.id] || [];
      });

      // Filtrar por tags se necessário
      let filteredConversations = conversations;
      if (filters?.tags && filters.tags.length > 0) {
        filteredConversations = filteredConversations.filter(conv => 
          conv.tags.some(tagId => filters.tags?.includes(tagId))
        );
      }

      // Obter últimas mensagens para cada conversa
      const { data: lastMessages, error: messagesError } = await supabase
        .from(TABELAS.MESSAGES)
        .select('*')
        .in('conversation_id', filteredConversations.map(c => c.id))
        .order('created_at', { ascending: false })
        .limit(filteredConversations.length);

      if (messagesError) {
        throw new Error(`Erro ao buscar últimas mensagens: ${messagesError.message}`);
      }

      // Agrupar mensagens por conversa e pegar apenas a última
      const lastMessageByConversation: Record<string, Message> = {};
      lastMessages?.forEach(msg => {
        const message = mapDbMessageToMessage(msg as unknown as DbMessage);
        const convId = message.conversationId;
        
        if (!lastMessageByConversation[convId]) {
          lastMessageByConversation[convId] = message;
        } else if (message.createdAt > lastMessageByConversation[convId].createdAt) {
          lastMessageByConversation[convId] = message;
        }
      });

      // Adicionar última mensagem às conversas
      filteredConversations.forEach(conv => {
        conv.lastMessage = lastMessageByConversation[conv.id];
      });

      // Buscar os objetos de tag
      const tagIds = [...new Set(
        filteredConversations.flatMap(c => c.tags || [])
      )];
      
      const tagObjects: Record<string, Tag> = {};
      for (const tagId of tagIds) {
        const tag = await tagService.getTagById(tagId);
        if (tag) {
          tagObjects[tagId] = tag;
        }
      }

      // Montar resultado final com detalhes
      const result: ConversationWithDetails[] = filteredConversations.map(conv => {
        const contact = dbContacts?.find(c => c.id === conv.contactId);
        const contactObj = contact 
          ? mapDbContactToContact(contact as unknown as DbContact)
          : {
              id: conv.contactId,
              name: 'Contato não encontrado',
              createdAt: new Date(),
              updatedAt: new Date(),
              tags: []
            };
            
        const tagObjs = (conv.tags || []).map(tagId => tagObjects[tagId]).filter(Boolean);
        
        return {
          ...conv,
          contact: contactObj,
          tagObjects: tagObjs
        };
      });

      return result;
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      throw error;
    }
  },

  /**
   * Obter uma conversa pelo ID
   */
  getConversationById: async (id: string): Promise<ConversationWithDetails | null> => {
    try {
      // Buscar conversa
      const { data: dbConversation, error } = await supabase
        .from(TABELAS.CONVERSATIONS)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Conversa não encontrada
          return null;
        }
        throw new Error(`Erro ao buscar conversa: ${error.message}`);
      }

      if (!dbConversation) {
        return null;
      }

      // Converter para tipo da aplicação
      const conversation = mapDbConversationToConversation(
        dbConversation as unknown as DbConversation
      );

      // Buscar contato
      const { data: dbContact, error: contactError } = await supabase
        .from(TABELAS.CONTACTS)
        .select('*')
        .eq('id', conversation.contactId)
        .single();

      if (contactError) {
        throw new Error(`Erro ao buscar contato: ${contactError.message}`);
      }

      const contact = mapDbContactToContact(dbContact as unknown as DbContact);

      // Buscar tags da conversa
      const { data: conversationTags, error: tagsError } = await supabase
        .from('conversation_tags')
        .select('tag_id')
        .eq('conversation_id', id);

      if (tagsError) {
        throw new Error(`Erro ao buscar tags da conversa: ${tagsError.message}`);
      }

      // Adicionar tags à conversa
      conversation.tags = conversationTags?.map(ct => (ct as DbConversationTag).tag_id) || [];

      // Buscar última mensagem
      const { data: lastMessageData, error: messageError } = await supabase
        .from(TABELAS.MESSAGES)
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!messageError && lastMessageData) {
        conversation.lastMessage = mapDbMessageToMessage(
          lastMessageData as unknown as DbMessage
        );
      }

      // Buscar objetos de tag
      const tagObjects: Tag[] = [];
      for (const tagId of conversation.tags) {
        const tag = await tagService.getTagById(tagId);
        if (tag) {
          tagObjects.push(tag);
        }
      }

      return {
        ...conversation,
        contact,
        tagObjects
      };
    } catch (error) {
      console.error('Erro ao buscar conversa por ID:', error);
      throw error;
    }
  },

  /**
   * Obter mensagens de uma conversa
   */
  getMessages: async (conversationId: string): Promise<Message[]> => {
    try {
      const { data: dbMessages, error } = await supabase
        .from(TABELAS.MESSAGES)
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(`Erro ao buscar mensagens: ${error.message}`);
      }

      return (dbMessages || []).map(msg => 
        mapDbMessageToMessage(msg as unknown as DbMessage)
      );
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      throw error;
    }
  },

  /**
   * Enviar mensagem
   */
  sendMessage: actionClient
    .schema(sendMessageSchema)
    .action(async ({ parsedInput }) => {
      try {
        const { conversationId, content, attachments: rawAttachments } = parsedInput;
        
        // Verificar se a conversa existe
        const { data: conversation, error: conversationError } = await supabase
          .from(TABELAS.CONVERSATIONS)
          .select('id')
          .eq('id', conversationId)
          .single();
        
        if (conversationError || !conversation) {
          return { success: false, error: 'Conversa não encontrada' };
        }

        // Processar anexos
        const attachments = rawAttachments ? rawAttachments.map(att => ({
          id: Math.random().toString(36).substring(2, 9),
          ...att
        })) : undefined;

        // Inserir nova mensagem
        const { data: newMessage, error: messageError } = await supabase
          .from(TABELAS.MESSAGES)
          .insert({
            conversation_id: conversationId,
            sender_id: (await supabase.auth.getUser()).data.user?.id || 'system',
            sender_type: 'user',
            content,
            attachments,
            status: 'sent'
          })
          .select()
          .single();

        if (messageError) {
          return { 
            success: false, 
            error: `Erro ao inserir mensagem: ${messageError.message}` 
          };
        }

        // Atualizar conversa
        await supabase
          .from(TABELAS.CONVERSATIONS)
          .update({ 
            updated_at: new Date().toISOString(),
            last_message_at: new Date().toISOString() 
          })
          .eq('id', conversationId);

        // Retornar mensagem formatada
        return { 
          success: true, 
          data: mapDbMessageToMessage(newMessage as unknown as DbMessage) 
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Erro ao enviar mensagem',
        };
      }
    }),

  /**
   * Atribuir conversa a um agente
   */
  assignConversation: actionClient
    .schema(assignConversationSchema)
    .action(async ({ parsedInput }) => {
      try {
        const { conversationId, userId } = parsedInput;
        
        // Verificar se a conversa existe
        const { data: conversation, error: conversationError } = await supabase
          .from(TABELAS.CONVERSATIONS)
          .select('id')
          .eq('id', conversationId)
          .single();
        
        if (conversationError || !conversation) {
          return { success: false, error: 'Conversa não encontrada' };
        }

        // Atualizar conversa
        const { data: updatedConversation, error: updateError } = await supabase
          .from(TABELAS.CONVERSATIONS)
          .update({ 
            assigned_to: userId || null,
            updated_at: new Date().toISOString() 
          })
          .eq('id', conversationId)
          .select()
          .single();

        if (updateError) {
          return { 
            success: false, 
            error: `Erro ao atribuir conversa: ${updateError.message}` 
          };
        }

        // Buscar detalhes da conversa atualizada
        const updatedConversationDetails = await inboxSupabaseService.getConversationById(conversationId);
        
        return { success: true, data: updatedConversationDetails };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Erro ao atribuir conversa',
        };
      }
    }),

  /**
   * Alterar status da conversa
   */
  changeConversationStatus: actionClient
    .schema(changeConversationStatusSchema)
    .action(async ({ parsedInput }) => {
      try {
        const { conversationId, status } = parsedInput;
        
        // Verificar se a conversa existe
        const { data: conversation, error: conversationError } = await supabase
          .from(TABELAS.CONVERSATIONS)
          .select('id')
          .eq('id', conversationId)
          .single();
        
        if (conversationError || !conversation) {
          return { success: false, error: 'Conversa não encontrada' };
        }

        // Atualizar conversa
        const { data: updatedConversation, error: updateError } = await supabase
          .from(TABELAS.CONVERSATIONS)
          .update({ 
            status,
            updated_at: new Date().toISOString() 
          })
          .eq('id', conversationId)
          .select()
          .single();

        if (updateError) {
          return { 
            success: false, 
            error: `Erro ao alterar status da conversa: ${updateError.message}` 
          };
        }

        // Buscar detalhes da conversa atualizada
        const updatedConversationDetails = await inboxSupabaseService.getConversationById(conversationId);
        
        return { success: true, data: updatedConversationDetails };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Erro ao alterar status da conversa',
        };
      }
    }),

  /**
   * Adicionar tag à conversa
   */
  addTagToConversation: actionClient
    .schema(addTagToConversationSchema)
    .action(async ({ parsedInput }) => {
      try {
        const { conversationId, tagId } = parsedInput;
        
        // Verificar se a conversa existe
        const { data: conversation, error: conversationError } = await supabase
          .from(TABELAS.CONVERSATIONS)
          .select('id')
          .eq('id', conversationId)
          .single();
        
        if (conversationError || !conversation) {
          return { success: false, error: 'Conversa não encontrada' };
        }

        // Verificar se a tag existe
        const tag = await tagService.getTagById(tagId);
        if (!tag) {
          return { success: false, error: 'Tag não encontrada' };
        }

        // Verificar se a relação já existe
        const { data: existingTag, error: existingError } = await supabase
          .from('conversation_tags')
          .select('*')
          .eq('conversation_id', conversationId)
          .eq('tag_id', tagId)
          .single();

        // Se não tiver erro, significa que a tag já existe na conversa
        if (!existingError && existingTag) {
          // Buscar detalhes da conversa atual
          const currentConversation = await inboxSupabaseService.getConversationById(conversationId);
          return { success: true, data: currentConversation };
        }

        // Adicionar tag à conversa
        const { error: insertError } = await supabase
          .from('conversation_tags')
          .insert({
            conversation_id: conversationId,
            tag_id: tagId
          });

        if (insertError) {
          return { 
            success: false, 
            error: `Erro ao adicionar tag à conversa: ${insertError.message}` 
          };
        }

        // Atualizar timestamp da conversa
        await supabase
          .from(TABELAS.CONVERSATIONS)
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId);

        // Buscar detalhes da conversa atualizada
        const updatedConversation = await inboxSupabaseService.getConversationById(conversationId);
        
        return { success: true, data: updatedConversation };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Erro ao adicionar tag à conversa',
        };
      }
    }),

  /**
   * Remover tag da conversa
   */
  removeTagFromConversation: actionClient
    .schema(addTagToConversationSchema)
    .action(async ({ parsedInput }) => {
      try {
        const { conversationId, tagId } = parsedInput;
        
        // Verificar se a conversa existe
        const { data: conversation, error: conversationError } = await supabase
          .from(TABELAS.CONVERSATIONS)
          .select('id')
          .eq('id', conversationId)
          .single();
        
        if (conversationError || !conversation) {
          return { success: false, error: 'Conversa não encontrada' };
        }

        // Remover tag da conversa
        const { error: deleteError } = await supabase
          .from('conversation_tags')
          .delete()
          .eq('conversation_id', conversationId)
          .eq('tag_id', tagId);

        if (deleteError) {
          return { 
            success: false, 
            error: `Erro ao remover tag da conversa: ${deleteError.message}` 
          };
        }

        // Atualizar timestamp da conversa
        await supabase
          .from(TABELAS.CONVERSATIONS)
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId);

        // Buscar detalhes da conversa atualizada
        const updatedConversation = await inboxSupabaseService.getConversationById(conversationId);
        
        return { success: true, data: updatedConversation };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Erro ao remover tag da conversa',
        };
      }
    }),
}; 