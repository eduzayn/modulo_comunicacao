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

// Mock de dados para demonstração
let conversations: Conversation[] = [
  {
    id: '1',
    contactId: '1',
    channelId: '1',
    channelType: 'whatsapp',
    status: 'active',
    assignedTo: '1',
    unreadCount: 3,
    tags: ['1'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    contactId: '2',
    channelId: '1',
    channelType: 'whatsapp',
    status: 'active',
    unreadCount: 0,
    tags: ['2'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    contactId: '3',
    channelId: '2',
    channelType: 'telegram',
    status: 'archived',
    assignedTo: '2',
    unreadCount: 0,
    tags: ['3'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let contacts: Contact[] = [
  {
    id: '1',
    name: 'João Silva',
    phone: '+5511999999999',
    email: 'joao@example.com',
    avatar: 'https://ui-avatars.com/api/?name=João+Silva',
    tags: ['1'],
    createdAt: new Date(),
    updatedAt: new Date(),
    lastContact: new Date(),
  },
  {
    id: '2',
    name: 'Maria Souza',
    phone: '+5511888888888',
    email: 'maria@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Souza',
    tags: ['2'],
    createdAt: new Date(),
    updatedAt: new Date(),
    lastContact: new Date(),
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    phone: '+5511777777777',
    email: 'pedro@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Pedro+Oliveira',
    tags: ['3'],
    createdAt: new Date(),
    updatedAt: new Date(),
    lastContact: new Date(),
  },
];

let messages: Message[] = [
  {
    id: '1',
    conversationId: '1',
    senderId: '1',
    senderType: 'contact',
    content: 'Olá, preciso de ajuda com meu pedido',
    status: 'read',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
  },
  {
    id: '2',
    conversationId: '1',
    senderId: '1',
    senderType: 'user',
    content: 'Claro, em que posso ajudar?',
    status: 'read',
    createdAt: new Date(Date.now() - 1000 * 60 * 25), // 25 minutos atrás
  },
  {
    id: '3',
    conversationId: '1',
    senderId: '1',
    senderType: 'contact',
    content: 'Meu pedido #12345 ainda não chegou',
    status: 'read',
    createdAt: new Date(Date.now() - 1000 * 60 * 20), // 20 minutos atrás
  },
  {
    id: '4',
    conversationId: '1',
    senderId: '1',
    senderType: 'contact',
    content: 'Pode verificar o status?',
    status: 'read',
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutos atrás
  },
  {
    id: '5',
    conversationId: '2',
    senderId: '2',
    senderType: 'contact',
    content: 'Bom dia, gostaria de saber sobre promoções',
    status: 'read',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
  },
  {
    id: '6',
    conversationId: '3',
    senderId: '3',
    senderType: 'contact',
    content: 'Como faço para trocar um produto?',
    status: 'read',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
  },
];

// Atualizar as conversas com as últimas mensagens
conversations = conversations.map(convo => {
  const conversationMessages = messages.filter(m => m.conversationId === convo.id);
  const lastMessage = conversationMessages.length > 0 
    ? conversationMessages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
    : undefined;
    
  return {
    ...convo,
    lastMessage
  };
});

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

// Serviço de inbox
export const inboxService = {
  /**
   * Obter conversas com filtros
   */
  getConversations: async (filters?: InboxFilters): Promise<ConversationWithDetails[]> => {
    let filteredConversations = [...conversations];

    // Aplicar filtros
    if (filters) {
      if (filters.status) {
        filteredConversations = filteredConversations.filter(
          (c) => c.status === filters.status
        );
      }

      if (filters.channelTypes && filters.channelTypes.length > 0) {
        filteredConversations = filteredConversations.filter((c) =>
          filters.channelTypes?.includes(c.channelType)
        );
      }

      if (filters.assignedTo) {
        filteredConversations = filteredConversations.filter(
          (c) => c.assignedTo === filters.assignedTo
        );
      }

      if (filters.tags && filters.tags.length > 0) {
        filteredConversations = filteredConversations.filter((c) =>
          c.tags.some((tag) => filters.tags?.includes(tag))
        );
      }

      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredConversations = filteredConversations.filter((c) => {
          const contact = contacts.find((contact) => contact.id === c.contactId);
          return (
            contact?.name.toLowerCase().includes(search) ||
            contact?.phone?.toLowerCase().includes(search) ||
            contact?.email?.toLowerCase().includes(search)
          );
        });
      }

      // Ordenação
      if (filters.sortBy) {
        filteredConversations.sort((a, b) => {
          if (filters.sortBy === 'lastMessage') {
            const aTime = a.lastMessage?.createdAt.getTime() || 0;
            const bTime = b.lastMessage?.createdAt.getTime() || 0;
            return filters.sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
          } else {
            const aTime = a.createdAt.getTime();
            const bTime = b.createdAt.getTime();
            return filters.sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
          }
        });
      }
    }

    // Adicionar detalhes de contato e tags
    const result: ConversationWithDetails[] = [];
    
    for (const convo of filteredConversations) {
      const contact = contacts.find((c) => c.id === convo.contactId);
      if (!contact) {
        throw new Error(`Contato não encontrado: ${convo.contactId}`);
      }

      // Carregar tags
      const tagObjects: Tag[] = [];
      for (const tagId of convo.tags) {
        const tag = await tagService.getTagById(tagId);
        if (tag) {
          tagObjects.push(tag);
        }
      }

      result.push({
        ...convo,
        contact,
        tagObjects
      });
    }

    return result;
  },

  /**
   * Obter uma conversa pelo ID
   */
  getConversationById: async (id: string): Promise<ConversationWithDetails | null> => {
    const conversation = conversations.find((c) => c.id === id);
    if (!conversation) {
      return null;
    }

    const contact = contacts.find((c) => c.id === conversation.contactId);
    if (!contact) {
      throw new Error(`Contato não encontrado: ${conversation.contactId}`);
    }

    // Carregar tags
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
  },

  /**
   * Obter mensagens de uma conversa
   */
  getMessages: async (conversationId: string): Promise<Message[]> => {
    return messages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
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
        const conversation = conversations.find((c) => c.id === conversationId);
        if (!conversation) {
          return { success: false, error: 'Conversa não encontrada' };
        }

        // Processar anexos, adicionando IDs
        const attachments = rawAttachments ? rawAttachments.map(att => ({
          id: Math.random().toString(36).substring(2, 9),
          name: att.name,
          type: att.type,
          url: att.url,
          size: att.size,
          mimeType: att.mimeType,
          previewUrl: att.previewUrl
        } as Attachment)) : undefined;

        // Criar nova mensagem
        const newMessage: Message = {
          id: Math.random().toString(36).substring(2, 9),
          conversationId,
          senderId: '1', // ID do usuário atual
          senderType: 'user',
          content,
          attachments,
          status: 'sent',
          createdAt: new Date(),
        };

        // Adicionar mensagem
        messages.push(newMessage);

        // Atualizar conversa
        const conversationIndex = conversations.findIndex((c) => c.id === conversationId);
        conversations[conversationIndex] = {
          ...conversations[conversationIndex],
          lastMessage: newMessage,
          updatedAt: new Date(),
        };

        return { success: true, data: newMessage };
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
        const conversationIndex = conversations.findIndex((c) => c.id === conversationId);
        if (conversationIndex === -1) {
          return { success: false, error: 'Conversa não encontrada' };
        }

        // Atualizar conversa
        conversations[conversationIndex] = {
          ...conversations[conversationIndex],
          assignedTo: userId,
          updatedAt: new Date(),
        };

        return { success: true, data: conversations[conversationIndex] };
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
        const conversationIndex = conversations.findIndex((c) => c.id === conversationId);
        if (conversationIndex === -1) {
          return { success: false, error: 'Conversa não encontrada' };
        }

        // Atualizar conversa
        conversations[conversationIndex] = {
          ...conversations[conversationIndex],
          status,
          updatedAt: new Date(),
        };

        return { success: true, data: conversations[conversationIndex] };
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
        const conversationIndex = conversations.findIndex((c) => c.id === conversationId);
        if (conversationIndex === -1) {
          return { success: false, error: 'Conversa não encontrada' };
        }

        // Verificar se a tag já existe na conversa
        if (conversations[conversationIndex].tags.includes(tagId)) {
          return { success: true, data: conversations[conversationIndex] };
        }

        // Verificar se a tag existe
        const tag = await tagService.getTagById(tagId);
        if (!tag) {
          return { success: false, error: 'Tag não encontrada' };
        }

        // Atualizar conversa
        conversations[conversationIndex] = {
          ...conversations[conversationIndex],
          tags: [...conversations[conversationIndex].tags, tagId],
          updatedAt: new Date(),
        };

        return { success: true, data: conversations[conversationIndex] };
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
        const conversationIndex = conversations.findIndex((c) => c.id === conversationId);
        if (conversationIndex === -1) {
          return { success: false, error: 'Conversa não encontrada' };
        }

        // Atualizar conversa
        conversations[conversationIndex] = {
          ...conversations[conversationIndex],
          tags: conversations[conversationIndex].tags.filter((t) => t !== tagId),
          updatedAt: new Date(),
        };

        return { success: true, data: conversations[conversationIndex] };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Erro ao remover tag da conversa',
        };
      }
    }),
}; 