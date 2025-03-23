import { CreateGroupFormData } from '../schemas'
import { Group } from '../types'

export async function getGroups(): Promise<Group[]> {
  // TODO: Implementar chamada para a API
  return []
}

export async function createGroup(data: CreateGroupFormData): Promise<Group> {
  // TODO: Implementar chamada para a API
  return {
    id: Math.random().toString(),
    ...data,
    members: [] // TODO: Buscar informações dos membros
  }
}

export async function updateGroup(id: string, data: Partial<CreateGroupFormData>): Promise<Group> {
  // TODO: Implementar chamada para a API
  return {
    id,
    ...data,
    members: [] // TODO: Buscar informações dos membros
  } as Group
}

export async function deleteGroup(id: string): Promise<void> {
  // TODO: Implementar chamada para a API
} 