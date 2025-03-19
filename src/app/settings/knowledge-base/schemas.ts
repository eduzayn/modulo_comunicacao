import { z } from 'zod'
import { type CreateKnowledgeBaseFormData } from './types'

const contentTypeEnum = [
  'pdf',
  'text',
  'qa',
  'flow',
  'script',
  'api',
  'rules',
] as const

export const createKnowledgeBaseSchema = z.object({
  name: z
    .string()
    .min(1, 'O nome é obrigatório')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .min(1, 'A descrição é obrigatória')
    .max(500, 'A descrição deve ter no máximo 500 caracteres'),
  type: z.enum(contentTypeEnum, {
    required_error: 'O tipo é obrigatório',
  }),
  content: z.object({
    raw: z.string().optional(),
    file: z
      .instanceof(File)
      .optional()
      .refine((file) => {
        if (!file) return true
        return file.size <= 10 * 1024 * 1024 // 10MB
      }, 'O arquivo deve ter no máximo 10MB'),
  }).refine(
    (data) => {
      // Deve ter pelo menos um: raw ou file
      return Boolean(data.raw) || Boolean(data.file)
    },
    {
      message: 'É necessário fornecer o conteúdo ou um arquivo',
    }
  ),
  metadata: z.object({
    source: z
      .string()
      .min(1, 'A fonte é obrigatória'),
    version: z
      .string()
      .min(1, 'A versão é obrigatória'),
    tags: z
      .array(z.string())
      .min(1, 'É necessário pelo menos uma tag')
      .max(10, 'Máximo de 10 tags permitidas'),
  }),
  settings: z.object({
    priority: z
      .number()
      .min(0, 'A prioridade deve ser maior ou igual a 0')
      .max(100, 'A prioridade deve ser menor ou igual a 100'),
    threshold: z
      .number()
      .min(0, 'O limiar deve ser maior ou igual a 0')
      .max(1, 'O limiar deve ser menor ou igual a 1'),
    contextWindow: z
      .number()
      .min(100, 'A janela de contexto deve ser maior ou igual a 100')
      .max(2000, 'A janela de contexto deve ser menor ou igual a 2000'),
  }),
}) satisfies z.ZodType<CreateKnowledgeBaseFormData>

export const updateKnowledgeBaseSchema = createKnowledgeBaseSchema.partial().extend({
  id: z.string().min(1, 'O ID é obrigatório'),
})

export const knowledgeBaseFilterSchema = z.object({
  type: z.enum(contentTypeEnum).optional(),
  status: z.enum(['pending', 'processing', 'trained', 'failed', 'outdated']).optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  dateRange: z
    .object({
      start: z.string(),
      end: z.string(),
    })
    .optional(),
})

export const knowledgeBaseSortSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']),
})

export const knowledgeBaseSearchSchema = z.object({
  filter: knowledgeBaseFilterSchema.optional(),
  sort: knowledgeBaseSortSchema.optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
}) 