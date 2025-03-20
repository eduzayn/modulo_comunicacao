/**
 * Tipos relacionados às configurações do sistema
 */

// Tipos comuns
export interface BaseConfig {
  id: string
  created_at: string
  updated_at: string
}

// Automações
export interface Automation extends BaseConfig {
  name: string
  event: string
  action: string
  enabled: boolean
  conditions?: Record<string, any>
  metadata?: Record<string, any>
}

export interface CreateAutomationInput {
  name: string
  event: string
  action: string
}

// Bots
export interface Bot extends BaseConfig {
  name: string
  channel: string
  model: string
  enabled: boolean
  avatar?: string
  email?: string
  groups?: string[]
  metadata?: Record<string, any>
}

export interface CreateBotInput {
  name: string
  channel: string
  model: string
  email?: string
  groups?: string[]
}

// Canais (relacionados à Caixa de Entrada)
export interface Channel extends BaseConfig {
  name: string
  type: 'whatsapp' | 'email' | 'facebook' | 'instagram' | 'telegram' | 'widget'
  enabled: boolean
  credentials?: Record<string, any>
  settings?: Record<string, any>
  inboxId?: string
}

// Pipelines (relacionados ao CRM)
export interface Pipeline extends BaseConfig {
  name: string
  stages: PipelineStage[]
  enabled: boolean
  metadata?: Record<string, any>
}

export interface PipelineStage {
  id: string
  name: string
  position: number
  color?: string
}

export interface CreatePipelineInput {
  name: string
  stages: Omit<PipelineStage, 'id'>[]
}

// Regras de Atribuição
export interface AssignmentRule extends BaseConfig {
  name: string
  condition: string
  assignTo: 'user' | 'group'
  entityId: string
  priority: number
  enabled: boolean
}

export interface CreateAssignmentRuleInput {
  name: string
  condition: string
  assignTo: 'user' | 'group'
  entityId: string
  priority: number
}

// Cursos (relacionados ao LMS)
export interface Course extends BaseConfig {
  title: string
  description: string
  modules: CourseModule[]
  enabled: boolean
  coverImage?: string
  duration?: number
  price?: number
}

export interface CourseModule {
  id: string
  title: string
  lessons: CourseLesson[]
  position: number
}

export interface CourseLesson {
  id: string
  title: string
  type: 'video' | 'text' | 'quiz'
  content: string
  duration: number
  position: number
}

export interface CreateCourseInput {
  title: string
  description: string
  modules: Omit<CourseModule, 'id'>[]
  coverImage?: string
  price?: number
} 