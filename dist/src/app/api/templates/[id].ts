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
  res: NextApiResponse<Template | { message: string }>
) {
  const { id } = req.query;
  const { method } = req;
  
  const template = templates.find(t => t.id === id);
  
  if (!template) {
    return res.status(404).json({ message: 'Template not found' });
  }
  
  switch (method) {
    case 'GET':
      res.status(200).json(template);
      break;
    case 'PUT':
      // Update template logic would go here
      const updatedTemplate = { ...template, ...req.body };
      
      // Increment version if content changes
      if (req.body.content && req.body.content !== template.content) {
        updatedTemplate.version = template.version + 1;
      }
      
      res.status(200).json(updatedTemplate);
      break;
    case 'DELETE':
      // Delete template logic would go here
      res.status(200).json({ message: 'Template deleted successfully' });
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}
