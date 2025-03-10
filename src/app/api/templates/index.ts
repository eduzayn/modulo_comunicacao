import type { NextApiRequest, NextApiResponse } from 'next';
import { Template } from '../../../../src/modules/communication/types';

// Mock data
const templates: Template[] = [
  {
    id: '1',
    name: 'Boas-vindas ao Curso',
    content: 'Olá {{nome}}, seja bem-vindo ao curso de {{curso}}! Estamos felizes em tê-lo conosco.',
    variables: ['nome', 'curso'],
    channelType: 'whatsapp',
    category: 'Onboarding',
    version: 1,
    status: 'active',
  },
  {
    id: '2',
    name: 'Lembrete de Aula',
    content: 'Olá {{nome}}, não se esqueça da sua aula de {{disciplina}} hoje às {{horario}}.',
    variables: ['nome', 'disciplina', 'horario'],
    channelType: 'sms',
    category: 'Lembretes',
    version: 2,
    status: 'active',
  },
  {
    id: '3',
    name: 'Confirmação de Matrícula',
    content: 'Prezado(a) {{nome}}, sua matrícula no curso {{curso}} foi confirmada com sucesso!',
    variables: ['nome', 'curso'],
    channelType: 'email',
    category: 'Administrativo',
    version: 1,
    status: 'draft',
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Template[] | Template | { message: string }>
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      res.status(200).json(templates);
      break;
    case 'POST':
      const newTemplate: Template = {
        id: Math.random().toString(36).substring(7),
        ...req.body,
        version: 1,
      };
      templates.push(newTemplate);
      res.status(201).json(newTemplate);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}
