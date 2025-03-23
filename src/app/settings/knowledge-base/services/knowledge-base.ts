import { api } from '@/lib/api'
import type { ActionResponse } from '@/types/actions'
import type {
  CreateKnowledgeBaseFormData,
  KnowledgeBase,
  KnowledgeBaseSearchOptions,
  UpdateKnowledgeBaseFormData,
} from '../types'

export async function createKnowledgeBase(
  data: CreateKnowledgeBaseFormData
): Promise<ActionResponse<KnowledgeBase>> {
  try {
    const formData = new FormData()

    // Adiciona os campos básicos
    formData.append('name', data.name)
    formData.append('description', data.description)
    formData.append('type', data.type)
    
    // Adiciona o conteúdo
    if (data.content.raw) {
      formData.append('content', data.content.raw)
    }
    if (data.content.file) {
      formData.append('file', data.content.file)
    }

    // Adiciona os metadados
    formData.append('metadata', JSON.stringify(data.metadata))
    
    // Adiciona as configurações
    formData.append('settings', JSON.stringify(data.settings))

    const response = await api.post('/knowledge-base', formData)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'CREATE_KNOWLEDGE_BASE_ERROR',
        message: 'Erro ao criar base de conhecimento',
      },
    }
  }
}

export async function updateKnowledgeBase(
  data: UpdateKnowledgeBaseFormData
): Promise<ActionResponse<KnowledgeBase>> {
  try {
    const formData = new FormData()

    // Adiciona os campos básicos se existirem
    if (data.name) formData.append('name', data.name)
    if (data.description) formData.append('description', data.description)
    if (data.type) formData.append('type', data.type)
    
    // Adiciona o conteúdo se existir
    if (data.content?.raw) {
      formData.append('content', data.content.raw)
    }
    if (data.content?.file) {
      formData.append('file', data.content.file)
    }

    // Adiciona os metadados se existirem
    if (data.metadata) {
      formData.append('metadata', JSON.stringify(data.metadata))
    }
    
    // Adiciona as configurações se existirem
    if (data.settings) {
      formData.append('settings', JSON.stringify(data.settings))
    }

    const response = await api.put(`/knowledge-base/${data.id}`, formData)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'UPDATE_KNOWLEDGE_BASE_ERROR',
        message: 'Erro ao atualizar base de conhecimento',
      },
    }
  }
}

export async function deleteKnowledgeBase(
  id: string
): Promise<ActionResponse<void>> {
  try {
    await api.delete(`/knowledge-base/${id}`)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DELETE_KNOWLEDGE_BASE_ERROR',
        message: 'Erro ao excluir base de conhecimento',
      },
    }
  }
}

export async function getKnowledgeBase(
  id: string
): Promise<ActionResponse<KnowledgeBase>> {
  try {
    const response = await api.get(`/knowledge-base/${id}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_KNOWLEDGE_BASE_ERROR',
        message: 'Erro ao buscar base de conhecimento',
      },
    }
  }
}

export async function searchKnowledgeBase(
  params: KnowledgeBaseSearchOptions
): Promise<ActionResponse<{ data: KnowledgeBase[]; total: number }>> {
  try {
    const response = await api.get('/knowledge-base', { params })
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'SEARCH_KNOWLEDGE_BASE_ERROR',
        message: 'Erro ao buscar bases de conhecimento',
      },
    }
  }
}

export async function trainKnowledgeBase(
  id: string
): Promise<ActionResponse<void>> {
  try {
    await api.post(`/knowledge-base/${id}/train`)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'TRAIN_KNOWLEDGE_BASE_ERROR',
        message: 'Erro ao treinar base de conhecimento',
      },
    }
  }
}

export async function getTrainingStatus(
  id: string
): Promise<ActionResponse<{ status: string; progress: number }>> {
  try {
    const response = await api.get(`/knowledge-base/${id}/training-status`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_TRAINING_STATUS_ERROR',
        message: 'Erro ao buscar status do treinamento',
      },
    }
  }
} 