import { api } from '@/lib/api'
import { type ActionResponse } from '@/types/actions'
import { type Tag } from '../types'
import { type CreateTagFormData } from '../schemas'

export async function createTag(data: CreateTagFormData): Promise<ActionResponse<Tag>> {
  try {
    const response = await api.post('/tags', data)

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('Erro ao criar tag:', error)
    return {
      success: false,
      error: {
        code: 'TAG_CREATE_ERROR',
        message: 'Erro ao criar tag. Tente novamente.',
      },
    }
  }
}

export async function getTags(): Promise<Tag[]> {
  const response = await api.get('/tags')
  return response.data
}

export async function deleteTag(id: string): Promise<ActionResponse<void>> {
  try {
    await api.delete(`/tags/${id}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error('Erro ao deletar tag:', error)
    return {
      success: false,
      error: {
        code: 'TAG_DELETE_ERROR',
        message: 'Erro ao deletar tag. Tente novamente.',
      },
    }
  }
} 