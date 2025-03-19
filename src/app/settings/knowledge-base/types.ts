export type ContentType = 
  | 'pdf'           // Documentos PDF
  | 'text'          // Texto livre
  | 'qa'            // Perguntas e respostas
  | 'flow'          // Fluxos de conversação
  | 'script'        // Scripts de atendimento
  | 'api'           // Documentação de API
  | 'rules'         // Regras de negócio

export type TrainingStatus =
  | 'pending'       // Aguardando treinamento
  | 'processing'    // Em processamento
  | 'trained'       // Treinado
  | 'failed'        // Falhou
  | 'outdated'      // Precisa atualizar

export interface KnowledgeBaseContent {
  raw: string          // Conteúdo original
  processed: string    // Conteúdo processado para a IA
  embeddings?: number[] // Vetores para busca semântica
}

export interface KnowledgeBaseMetadata {
  source: string
  lastUpdated: string
  version: string
  author: string
  tags: string[]
}

export interface TrainingMetrics {
  accuracy: number
  coverage: number
  confidence: number
}

export interface TrainingInfo {
  status: TrainingStatus
  lastTrainedAt?: string
  error?: string
  metrics?: TrainingMetrics
}

export interface KnowledgeBaseSettings {
  priority: number     // Prioridade no matching
  threshold: number    // Limiar de confiança
  contextWindow: number // Tamanho do contexto
}

export interface UsageMetrics {
  timesUsed: number
  lastUsedAt: string
  averageConfidence: number
  feedbackScore: number
}

export interface KnowledgeBase {
  id: string
  name: string
  description: string
  type: ContentType
  content: KnowledgeBaseContent
  metadata: KnowledgeBaseMetadata
  training: TrainingInfo
  settings: KnowledgeBaseSettings
  usage: UsageMetrics
  createdAt: string
  updatedAt: string
  createdBy: string
}

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