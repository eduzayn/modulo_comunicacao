import { CreateCustomFieldFormData } from '../schemas'
import { CustomField } from '../types'

export async function getCustomFields(): Promise<CustomField[]> {
  // TODO: Implementar chamada para a API
  return []
}

export async function createCustomField(data: CreateCustomFieldFormData): Promise<CustomField> {
  // TODO: Implementar chamada para a API
  return {
    id: Math.random().toString(),
    ...data
  }
}

export async function updateCustomField(
  id: string,
  data: Partial<CreateCustomFieldFormData>
): Promise<CustomField> {
  // TODO: Implementar chamada para a API
  return {
    id,
    ...data
  } as CustomField
}

export async function deleteCustomField(id: string): Promise<void> {
  // TODO: Implementar chamada para a API
} 