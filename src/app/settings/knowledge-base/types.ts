import { z } from 'zod'

export type ContentType = 'pdf' | 'text' | 'qa' | 'flow' | 'script' | 'api' | 'rules'
export type TrainingStatus = 'pending' | 'processing' | 'trained' | 'failed' | 'outdated'
export type KnowledgeBaseStatus = 'active' | 'inactive' | 'draft'

export interface KnowledgeBaseContent {
  id: string
  knowledge_base_id: string
  type: ContentType
  content: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface KnowledgeBaseMetadata {
  id: string
  knowledge_base_id: string
  source: string
  version: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface TrainingMetrics {
  total_tokens: number
  training_time: number
  accuracy: number
  error_rate: number
}

export interface TrainingInfo {
  id: string
  knowledge_base_id: string
  status: TrainingStatus
  started_at: string
  completed_at: string | null
  error: string | null
  metrics: TrainingMetrics
  created_at: string
  updated_at: string
}

export interface KnowledgeBaseSettings {
  language: string
  maxTokens: number
  temperature: number
  status: KnowledgeBaseStatus
}

export interface UsageMetrics {
  id: string
  knowledge_base_id: string
  totalQueries: number
  averageLatency: number
  errorRate: number
  created_at: string
  updated_at: string
}

export interface KnowledgeBase {
  id: string
  name: string
  description: string
  type: ContentType
  content: KnowledgeBaseContent[]
  metadata: KnowledgeBaseMetadata
  settings: KnowledgeBaseSettings
  training: TrainingInfo
  usage: UsageMetrics
  createdAt: string
  updatedAt: string
}

export const knowledgeBaseSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter no mínimo 10 caracteres'),
  type: z.enum(['pdf', 'text', 'qa', 'flow', 'script', 'api', 'rules']),
  settings: z.object({
    language: z.enum(['pt-BR', 'en-US', 'es']),
    maxTokens: z.number().min(1).max(4096),
    temperature: z.number().min(0).max(2),
    status: z.enum(['active', 'inactive', 'draft']),
  }),
})

export interface CreateKnowledgeBaseFormData {
  name: string
  description: string
  type: ContentType
  content: {
    raw: string
    file?: File
  }
  metadata: {
    source: string
    version: string
    tags: string[]
  }
  settings: {
    priority: number
    threshold: number
    contextWindow: number
  }
}

export interface UpdateKnowledgeBaseFormData extends Partial<CreateKnowledgeBaseFormData> {
  id: string
}

export interface KnowledgeBaseFilter {
  type?: ContentType
  status?: TrainingStatus
  tags?: string[]
  author?: string
  dateRange?: {
    start: string
    end: string
  }
}

export interface KnowledgeBaseSortOptions {
  field: keyof KnowledgeBase
  direction: 'asc' | 'desc'
}

export interface KnowledgeBaseSearchOptions {
  filter?: KnowledgeBaseFilter
  sort?: KnowledgeBaseSortOptions
  page?: number
  limit?: number
} 