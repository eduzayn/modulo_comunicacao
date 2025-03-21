export interface Member {
  id: string
  name: string
  avatar?: string
}

export interface Group {
  id: string
  name: string
  description?: string
  color: string
  members: Member[]
  cep?: string
  ddd?: string
}

export interface CreateGroupData {
  name: string
  description?: string
  color: string
  members: string[] // IDs dos membros
  cep?: string
  ddd?: string
} 