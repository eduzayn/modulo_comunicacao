import type { NextApiRequest, NextApiResponse } from 'next';
import { Conversation, Message } from '../../../../src/modules/communication/types';

// Mock data
const conversations: Conversation[] = [
  {
    id: '1',
    channelId: '1',
    participants: ['João Silva', 'Atendente'],
    messages: [
      {
        id: '101',
        conversationId: '1',
        senderId: 'user-123',
        content: 'Olá, gostaria de informações sobre o curso de Engenharia.',
        type: 'text',
        status: 'read',
        metadata: {},
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        id: '102',
        conversationId: '1',
        senderId: 'agent-456',
        content: 'Olá João! Claro, como posso ajudar com informações sobre o curso de Engenharia?',
        type: 'text',
        status: 'read',
        metadata: {},
        createdAt: new Date(Date.now() - 3500000),
      },
    ],
    status: 'open',
    priority: 'medium',
    context: 'academic',
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3500000),
  },
  {
    id: '2',
    channelId: '2',
    participants: ['Maria Oliveira', 'Suporte'],
    messages: [
      {
        id: '201',
        conversationId: '2',
        senderId: 'user-789',
        content: 'Estou com problemas para acessar minha conta.',
        type: 'text',
        status: 'read',
        metadata: {},
        createdAt: new Date(Date.now() - 7200000),
      },
    ],
    status: 'pending',
    priority: 'high',
    context: 'support',
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 7200000),
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Conversation | Message | { message: string }>
) {
  const { id } = req.query;
  const { method } = req;
  
  const conversation = conversations.find(c => c.id === id);
  
  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }
  
  switch (method) {
    case 'GET':
      res.status(200).json(conversation);
      break;
    case 'PUT':
      // Update conversation logic would go here
      res.status(200).json({ ...conversation, ...req.body });
      break;
    case 'POST':
      // Add message to conversation
      if (!req.body.content) {
        return res.status(400).json({ message: 'Message content is required' });
      }
      
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversationId: conversation.id,
        senderId: req.body.senderId || 'agent-456',
        content: req.body.content,
        type: req.body.type || 'text',
        status: 'sent',
        metadata: req.body.metadata || {},
        createdAt: new Date(),
      };
      
      conversation.messages.push(newMessage);
      conversation.updatedAt = new Date();
      
      res.status(201).json(newMessage);
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'POST']);
      res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}
