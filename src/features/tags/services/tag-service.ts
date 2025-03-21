'use server';

import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/config';
import type { 
  Tag, 
  TagWithUsageCount, 
  TagFilter, 
  TagServiceResponse, 
  CreateTagPayload, 
  UpdateTagPayload 
} from '../types';

// Validação de schemas usando zod
const tagFilterSchema = z.object({
  search: z.string().optional(),
  color: z.string().optional(),
  type: z.enum(['conversation', 'contact', 'deal', 'all']).optional(),
});

const createTagSchema = z.object({
  name: z.string().min(1, 'O nome da tag é obrigatório'),
  color: z.string().min(1, 'A cor da tag é obrigatória'),
  type: z.enum(['conversation', 'contact', 'deal']).optional(),
  description: z.string().nullable().optional(),
});

const updateTagSchema = z.object({
  id: z.string().min(1, 'ID da tag é obrigatório'),
  name: z.string().min(1, 'O nome da tag é obrigatório').optional(),
  color: z.string().min(1, 'A cor da tag é obrigatória').optional(),
  description: z.string().nullable().optional(),
});

const deleteTagSchema = z.object({
  id: z.string().min(1, 'ID da tag é obrigatório'),
});

const getTagSchema = z.object({
  id: z.string().min(1, 'ID da tag é obrigatório'),
});

// Cliente para ações seguras do servidor
const action = createSafeActionClient();

// Implementação dos serviços para as tags
export const tagService = {
  // Buscar todas as tags com filtros
  getTags: action
    .schema(tagFilterSchema)
    .action(async (filter): Promise<TagServiceResponse<TagWithUsageCount[]>> => {
      try {
        let query = supabase
          .from('tags')
          .select('*, conversation_tags(count), contact_tags(count), deal_tags(count)')
          .order('name');

        if (filter.search) {
          query = query.ilike('name', `%${filter.search}%`);
        }

        if (filter.color) {
          query = query.eq('color', filter.color);
        }

        if (filter.type && filter.type !== 'all') {
          query = query.eq('type', filter.type);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Erro ao buscar tags:', error);
          return {
            success: false,
            error: {
              code: 'FETCH_ERROR',
              message: 'Erro ao buscar tags',
            },
          };
        }

        // Processar os dados para calcular a contagem de uso
        const tagsWithCount = data.map(tag => {
          const conversationCount = tag.conversation_tags?.[0]?.count || 0;
          const contactCount = tag.contact_tags?.[0]?.count || 0;
          const dealCount = tag.deal_tags?.[0]?.count || 0;
          
          const usageCount = conversationCount + contactCount + dealCount;
          
          // Remover propriedades de contagem da resposta
          const { conversation_tags, contact_tags, deal_tags, ...tagData } = tag;
          
          return {
            ...tagData,
            usage_count: usageCount
          } as TagWithUsageCount;
        });

        return {
          success: true,
          data: tagsWithCount,
        };
      } catch (error) {
        console.error('Erro inesperado ao buscar tags:', error);
        return {
          success: false,
          error: {
            code: 'UNEXPECTED_ERROR',
            message: 'Ocorreu um erro inesperado ao buscar as tags',
          },
        };
      }
    }),

  // Obter uma tag por ID
  getTagById: action
    .schema(getTagSchema)
    .action(async ({ id }): Promise<TagServiceResponse<Tag>> => {
      try {
        const { data, error } = await supabase
          .from('tags')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          return {
            success: false,
            error: {
              code: 'TAG_NOT_FOUND',
              message: 'Tag não encontrada',
            },
          };
        }

        return {
          success: true,
          data,
        };
      } catch (error) {
        console.error('Erro inesperado ao buscar tag:', error);
        return {
          success: false,
          error: {
            code: 'UNEXPECTED_ERROR',
            message: 'Ocorreu um erro inesperado ao buscar a tag',
          },
        };
      }
    }),

  // Criar uma nova tag
  createTag: action
    .schema(createTagSchema)
    .action(async (data): Promise<TagServiceResponse<Tag>> => {
      try {
        const { error, data: tag } = await supabase
          .from('tags')
          .insert([data])
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            return {
              success: false,
              error: {
                code: 'DUPLICATE_TAG',
                message: 'Já existe uma tag com este nome',
              },
            };
          }

          return {
            success: false,
            error: {
              code: 'CREATE_ERROR',
              message: 'Erro ao criar tag',
            },
          };
        }

        return {
          success: true,
          data: tag,
        };
      } catch (error) {
        console.error('Erro inesperado ao criar tag:', error);
        return {
          success: false,
          error: {
            code: 'UNEXPECTED_ERROR',
            message: 'Ocorreu um erro inesperado ao criar a tag',
          },
        };
      }
    }),

  // Atualizar uma tag existente
  updateTag: action
    .schema(updateTagSchema)
    .action(async ({ id, ...data }): Promise<TagServiceResponse<Tag>> => {
      try {
        const { error, data: updatedTag } = await supabase
          .from('tags')
          .update(data)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            return {
              success: false,
              error: {
                code: 'DUPLICATE_TAG',
                message: 'Já existe uma tag com este nome',
              },
            };
          }

          return {
            success: false,
            error: {
              code: 'UPDATE_ERROR',
              message: 'Erro ao atualizar tag',
            },
          };
        }

        return {
          success: true,
          data: updatedTag,
        };
      } catch (error) {
        console.error('Erro inesperado ao atualizar tag:', error);
        return {
          success: false,
          error: {
            code: 'UNEXPECTED_ERROR',
            message: 'Ocorreu um erro inesperado ao atualizar a tag',
          },
        };
      }
    }),

  // Excluir uma tag
  deleteTag: action
    .schema(deleteTagSchema)
    .action(async ({ id }): Promise<TagServiceResponse<null>> => {
      try {
        const { error } = await supabase
          .from('tags')
          .delete()
          .eq('id', id);

        if (error) {
          return {
            success: false,
            error: {
              code: 'DELETE_ERROR',
              message: 'Erro ao excluir tag',
            },
          };
        }

        return {
          success: true,
          data: null,
        };
      } catch (error) {
        console.error('Erro inesperado ao excluir tag:', error);
        return {
          success: false,
          error: {
            code: 'UNEXPECTED_ERROR',
            message: 'Ocorreu um erro inesperado ao excluir a tag',
          },
        };
      }
    }),

  // Adicionar tag a uma conversa
  addTagToConversation: action
    .schema(z.object({
      tagId: z.string(),
      conversationId: z.string(),
    }))
    .action(async ({ tagId, conversationId }): Promise<TagServiceResponse<null>> => {
      try {
        const { error } = await supabase
          .from('conversation_tags')
          .insert([{ tag_id: tagId, conversation_id: conversationId }]);

        if (error) {
          if (error.code === '23505') {
            return {
              success: false,
              error: {
                code: 'TAG_ALREADY_ADDED',
                message: 'Esta tag já está associada à conversa',
              },
            };
          }

          return {
            success: false,
            error: {
              code: 'ADD_TAG_ERROR',
              message: 'Erro ao adicionar tag à conversa',
            },
          };
        }

        return {
          success: true,
          data: null,
        };
      } catch (error) {
        console.error('Erro inesperado ao adicionar tag à conversa:', error);
        return {
          success: false,
          error: {
            code: 'UNEXPECTED_ERROR',
            message: 'Ocorreu um erro inesperado ao adicionar a tag à conversa',
          },
        };
      }
    }),

  // Remover tag de uma conversa
  removeTagFromConversation: action
    .schema(z.object({
      tagId: z.string(),
      conversationId: z.string(),
    }))
    .action(async ({ tagId, conversationId }): Promise<TagServiceResponse<null>> => {
      try {
        const { error } = await supabase
          .from('conversation_tags')
          .delete()
          .eq('tag_id', tagId)
          .eq('conversation_id', conversationId);

        if (error) {
          return {
            success: false,
            error: {
              code: 'REMOVE_TAG_ERROR',
              message: 'Erro ao remover tag da conversa',
            },
          };
        }

        return {
          success: true,
          data: null,
        };
      } catch (error) {
        console.error('Erro inesperado ao remover tag da conversa:', error);
        return {
          success: false,
          error: {
            code: 'UNEXPECTED_ERROR',
            message: 'Ocorreu um erro inesperado ao remover a tag da conversa',
          },
        };
      }
    }),
}; 