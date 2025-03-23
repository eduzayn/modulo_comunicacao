import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { Tag } from '../types';

// Simula uma base de dados local para fins de demonstração
let tags: Tag[] = [
  {
    id: '1',
    name: 'Urgente',
    color: '#FF0000',
    description: 'Para mensagens que precisam de atenção imediata',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Suporte',
    color: '#0000FF',
    description: 'Mensagens relacionadas a suporte técnico',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Vendas',
    color: '#00FF00',
    description: 'Mensagens sobre vendas e produtos',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Esquemas de validação
const createTagSchema = z.object({
  name: z.string().min(1, 'Nome da tag é obrigatório'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve estar no formato hexadecimal (#RRGGBB)'),
  description: z.string().optional(),
});

const updateTagSchema = createTagSchema.partial().extend({
  id: z.string(),
});

// Tipo para ID
const idSchema = z.object({
  id: z.string()
});

// Respostas das ações
type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Cria o cliente de ações seguras
const actionClient = createSafeActionClient();

// Serviço de tags
export const tagService = {
  /**
   * Obter todas as tags
   */
  getTags: async (): Promise<Tag[]> => {
    // Simula chamada de API
    return [...tags];
  },

  /**
   * Obter uma tag pelo ID
   */
  getTagById: async (id: string): Promise<Tag | undefined> => {
    return tags.find((tag) => tag.id === id);
  },

  /**
   * Criar uma nova tag
   */
  createTag: actionClient
    .schema(createTagSchema)
    .action(async ({ parsedInput }) => {
      try {
        const { name, color, description } = parsedInput;
        
        const newTag: Tag = {
          id: Math.random().toString(36).substring(2, 9),
          name,
          color,
          description,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        tags.push(newTag);
        return { success: true, data: newTag };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Erro ao criar tag' 
        };
      }
    }),

  /**
   * Atualizar uma tag existente
   */
  updateTag: actionClient
    .schema(updateTagSchema)
    .action(async ({ parsedInput }) => {
      try {
        const { id, ...rest } = parsedInput;
        
        const tagIndex = tags.findIndex((tag) => tag.id === id);
        if (tagIndex === -1) {
          return { success: false, error: 'Tag não encontrada' };
        }

        const updatedTag = {
          ...tags[tagIndex],
          ...rest,
          updatedAt: new Date(),
        };

        tags[tagIndex] = updatedTag;
        return { success: true, data: updatedTag };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Erro ao atualizar tag' 
        };
      }
    }),

  /**
   * Excluir uma tag
   */
  deleteTag: actionClient
    .schema(idSchema)
    .action(async ({ parsedInput }) => {
      try {
        const { id } = parsedInput;
        
        const tagIndex = tags.findIndex((tag) => tag.id === id);
        if (tagIndex === -1) {
          return { success: false, error: 'Tag não encontrada' };
        }

        tags = tags.filter((tag) => tag.id !== id);
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Erro ao excluir tag' 
        };
      }
    }),
}; 