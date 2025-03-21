export type FieldType = 'text' | 'multiselect' | 'json'
export type EntityType = 'contact'

export interface CustomField {
  id: string
  name: string
  description?: string
  type: FieldType
  entity: EntityType
  reservedKey?: string
  alwaysShow: boolean
  encrypted: boolean
  required: boolean
  validate: boolean
  linkObligatoriness: boolean
}

export interface CreateCustomFieldData {
  name: string
  description?: string
  type: FieldType
  entity: EntityType
  reservedKey?: string
  alwaysShow: boolean
  encrypted: boolean
  required: boolean
  validate: boolean
  linkObligatoriness: boolean
} 