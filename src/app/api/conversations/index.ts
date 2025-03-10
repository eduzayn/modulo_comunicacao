import type { NextApiRequest, NextApiResponse } from 'next';
import { Conversation } from '../../../../src/modules/communication/types';

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
  res: NextApiResponse<Conversation[] | Conversation | { message: string }>
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      res.status(200).json(conversations);
      break;
    case 'POST':
      const newConversation: Conversation = {
        id: Math.random().toString(36).substring(7),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      conversations.push(newConversation);
      res.status(201).json(newConversation);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}
