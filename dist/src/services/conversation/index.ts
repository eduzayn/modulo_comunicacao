import { User } from '@/components/chat/message-input';

export interface Conversation {
  id: string;
  participants: User[];
  title: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  status: 'open' | 'closed' | 'pending';
  channel: 'whatsapp' | 'email' | 'chat' | 'sms' | 'facebook' | 'instagram';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  text: string;
  sender: User;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}

/**
 * Busca uma conversa pelo ID
 */
export async function getConversation(id: string): Promise<Conversation | null> {
  try {
    // Simulação - Em produção, isso buscaria do banco de dados
    return {
      id,
      participants: [
        { id: 'user-1', name: 'Cliente' },
        { id: 'agent-1', name: 'Atendente' }
      ],
      title: 'Atendimento ao cliente',
      lastMessage: 'Como posso ajudar?',
      lastMessageTime: new Date(),
      unreadCount: 0,
      status: 'open',
      channel: 'whatsapp',
      priority: 'medium',
      tags: ['suporte', 'dúvida']
    };
  } catch (error) {
    console.error('Erro ao buscar conversa:', error);
    return null;
  }
}

/**
 * Busca as mensagens de uma conversa
 */
export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  try {
    // Simulação - Em produção, isso buscaria do banco de dados
    return [
      {
        id: 'msg-1',
        conversationId,
        text: 'Olá, estou com uma dúvida sobre o produto.',
        sender: { id: 'user-1', name: 'Cliente' },
        timestamp: new Date(Date.now() - 3600000), // 1 hora atrás
        status: 'read'
      },
      {
        id: 'msg-2',
        conversationId,
        text: 'Olá! Como posso ajudar?',
        sender: { id: 'agent-1', name: 'Atendente' },
        timestamp: new Date(Date.now() - 3500000), // 58 minutos atrás
        status: 'read'
      }
    ];
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    return [];
  }
}

/**
 * Envia uma nova mensagem
 */
export async function sendMessage(conversationId: string, message: Omit<Message, 'id' | 'timestamp' | 'status'>): Promise<Message> {
  try {
    // Simulação - Em produção, isso salvaria no banco de dados
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      text: message.text,
      sender: message.sender,
      timestamp: new Date(),
      status: 'sent',
      attachments: message.attachments
    };
    
    return newMessage;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw new Error('Falha ao enviar mensagem');
  }
} 