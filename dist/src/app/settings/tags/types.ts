export type TagVisibility = 'all' | 'group' | 'personal'

export interface Tag {
  id: string
  name: string
  color: string
  visibility: TagVisibility
  assignedTo?: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface CreateTagFormData {
  name: string
  color: string
  visibility: TagVisibility
  assignedTo?: string[]
} 