import { api } from '@/lib/api'
import { type ActionResponse } from '@/types/actions'
import { type BusinessHours, type CreateBusinessHoursFormData } from '../types'

export async function createBusinessHours(
  data: CreateBusinessHoursFormData
): Promise<ActionResponse<BusinessHours>> {
  try {
    const response = await api.post('/business-hours', data)

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('Erro ao criar horário:', error)
    return {
      success: false,
      error: {
        code: 'BUSINESS_HOURS_CREATE_ERROR',
        message: 'Erro ao criar horário. Tente novamente.',
      },
    }
  }
}

export async function getBusinessHours(): Promise<BusinessHours[]> {
  const response = await api.get('/business-hours')
  return response.data
}

export async function deleteBusinessHours(id: string): Promise<ActionResponse<void>> {
  try {
    await api.delete(`/business-hours/${id}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error('Erro ao deletar horário:', error)
    return {
      success: false,
      error: {
        code: 'BUSINESS_HOURS_DELETE_ERROR',
        message: 'Erro ao deletar horário. Tente novamente.',
      },
    }
  }
} 