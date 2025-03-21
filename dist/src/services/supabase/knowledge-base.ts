import { supabase } from '@/lib/supabase'
import { KnowledgeBase, KnowledgeBaseContent, KnowledgeBaseMetadata, TrainingInfo, UsageMetrics } from '@/app/settings/knowledge-base/types'

const KNOWLEDGE_BASE_TABLE = 'knowledge_base'
const KNOWLEDGE_BASE_CONTENT_TABLE = 'knowledge_base_content'
const KNOWLEDGE_BASE_METADATA_TABLE = 'knowledge_base_metadata'
const TRAINING_INFO_TABLE = 'training_info'
const USAGE_METRICS_TABLE = 'usage_metrics'

export async function createKnowledgeBase(data: Omit<KnowledgeBase, 'id'>): Promise<KnowledgeBase> {
  const { data: knowledgeBase, error } = await supabase
    .from(KNOWLEDGE_BASE_TABLE)
    .insert(data)
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao criar base de conhecimento: ${error.message}`)
  }

  return knowledgeBase
}

export async function updateKnowledgeBase(id: string, data: Partial<KnowledgeBase>): Promise<KnowledgeBase> {
  const { data: knowledgeBase, error } = await supabase
    .from(KNOWLEDGE_BASE_TABLE)
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao atualizar base de conhecimento: ${error.message}`)
  }

  return knowledgeBase
}

export async function deleteKnowledgeBase(id: string): Promise<void> {
  const { error } = await supabase
    .from(KNOWLEDGE_BASE_TABLE)
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Erro ao excluir base de conhecimento: ${error.message}`)
  }
}

export async function getKnowledgeBase(id: string): Promise<KnowledgeBase> {
  const { data: knowledgeBase, error } = await supabase
    .from(KNOWLEDGE_BASE_TABLE)
    .select(`
      *,
      content:${KNOWLEDGE_BASE_CONTENT_TABLE}(*),
      metadata:${KNOWLEDGE_BASE_METADATA_TABLE}(*),
      training:${TRAINING_INFO_TABLE}(*),
      usage:${USAGE_METRICS_TABLE}(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Erro ao buscar base de conhecimento: ${error.message}`)
  }

  return knowledgeBase
}

export async function listKnowledgeBases(): Promise<KnowledgeBase[]> {
  const { data: knowledgeBases, error } = await supabase
    .from(KNOWLEDGE_BASE_TABLE)
    .select(`
      *,
      content:${KNOWLEDGE_BASE_CONTENT_TABLE}(*),
      metadata:${KNOWLEDGE_BASE_METADATA_TABLE}(*),
      training:${TRAINING_INFO_TABLE}(*),
      usage:${USAGE_METRICS_TABLE}(*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Erro ao listar bases de conhecimento: ${error.message}`)
  }

  return knowledgeBases
}

export async function addContent(knowledgeBaseId: string, content: Omit<KnowledgeBaseContent, 'id'>): Promise<KnowledgeBaseContent> {
  const { data: newContent, error } = await supabase
    .from(KNOWLEDGE_BASE_CONTENT_TABLE)
    .insert({ ...content, knowledge_base_id: knowledgeBaseId })
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao adicionar conteúdo: ${error.message}`)
  }

  return newContent
}

export async function updateContent(id: string, content: Partial<KnowledgeBaseContent>): Promise<KnowledgeBaseContent> {
  const { data: updatedContent, error } = await supabase
    .from(KNOWLEDGE_BASE_CONTENT_TABLE)
    .update(content)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao atualizar conteúdo: ${error.message}`)
  }

  return updatedContent
}

export async function deleteContent(id: string): Promise<void> {
  const { error } = await supabase
    .from(KNOWLEDGE_BASE_CONTENT_TABLE)
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Erro ao excluir conteúdo: ${error.message}`)
  }
}

export async function updateMetadata(knowledgeBaseId: string, metadata: Partial<KnowledgeBaseMetadata>): Promise<KnowledgeBaseMetadata> {
  const { data: updatedMetadata, error } = await supabase
    .from(KNOWLEDGE_BASE_METADATA_TABLE)
    .upsert({ ...metadata, knowledge_base_id: knowledgeBaseId })
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao atualizar metadados: ${error.message}`)
  }

  return updatedMetadata
}

export async function updateTrainingInfo(knowledgeBaseId: string, trainingInfo: Partial<TrainingInfo>): Promise<TrainingInfo> {
  const { data: updatedTrainingInfo, error } = await supabase
    .from(TRAINING_INFO_TABLE)
    .upsert({ ...trainingInfo, knowledge_base_id: knowledgeBaseId })
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao atualizar informações de treinamento: ${error.message}`)
  }

  return updatedTrainingInfo
}

export async function updateUsageMetrics(knowledgeBaseId: string, metrics: Partial<UsageMetrics>): Promise<UsageMetrics> {
  const { data: updatedMetrics, error } = await supabase
    .from(USAGE_METRICS_TABLE)
    .upsert({ ...metrics, knowledge_base_id: knowledgeBaseId })
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao atualizar métricas de uso: ${error.message}`)
  }

  return updatedMetrics
} 