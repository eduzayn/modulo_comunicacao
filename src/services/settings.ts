import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface AssignmentRule {
  id: string
  name: string
  rule: string
  assign_to: string
  created_at: string
  updated_at: string
}

export interface CreateAssignmentRuleData {
  name: string
  rule: string
  assignTo: string
}

export async function createAssignmentRule(data: CreateAssignmentRuleData): Promise<AssignmentRule> {
  const { data: rule, error } = await supabase
    .from('assignment_rules')
    .insert([
      {
        name: data.name,
        rule: data.rule,
        assign_to: data.assignTo
      }
    ])
    .select()
    .single()

  if (error) {
    throw new Error('Erro ao criar regra de atribuição')
  }

  return rule
}

export async function getAssignmentRules(): Promise<AssignmentRule[]> {
  const { data: rules, error } = await supabase
    .from('assignment_rules')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Erro ao buscar regras de atribuição')
  }

  return rules
}

export async function deleteAssignmentRule(ruleId: string): Promise<void> {
  const { error } = await supabase
    .from('assignment_rules')
    .delete()
    .eq('id', ruleId)

  if (error) {
    throw new Error('Erro ao excluir regra de atribuição')
  }
}

export async function toggleAssignmentRule(ruleId: string, enabled: boolean): Promise<void> {
  const { error } = await supabase
    .from('assignment_rules')
    .update({ enabled })
    .eq('id', ruleId)

  if (error) {
    throw new Error('Erro ao atualizar regra de atribuição')
  }
}

export interface Automation {
  id: string
  name: string
  event: string
  action: string
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface CreateAutomationData {
  name: string
  event: string
  action: string
}

export async function createAutomation(data: CreateAutomationData): Promise<Automation> {
  const { data: automation, error } = await supabase
    .from('automations')
    .insert([
      {
        name: data.name,
        event: data.event,
        action: data.action
      }
    ])
    .select()
    .single()

  if (error) {
    throw new Error('Erro ao criar automação')
  }

  return automation
}

export async function getAutomations(): Promise<Automation[]> {
  const { data: automations, error } = await supabase
    .from('automations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Erro ao buscar automações')
  }

  return automations
}

export async function toggleAutomation(automationId: string, enabled: boolean): Promise<void> {
  const { error } = await supabase
    .from('automations')
    .update({ enabled })
    .eq('id', automationId)

  if (error) {
    throw new Error('Erro ao atualizar automação')
  }
}

export async function deleteAutomation(automationId: string): Promise<void> {
  const { error } = await supabase
    .from('automations')
    .delete()
    .eq('id', automationId)

  if (error) {
    throw new Error('Erro ao excluir automação')
  }
}

export interface WorkflowStep {
  action: string
  target: string
}

export interface Workflow {
  id: string
  name: string
  trigger: string
  steps: WorkflowStep[]
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface CreateWorkflowData {
  name: string
  trigger: string
  steps: WorkflowStep[]
}

export async function createWorkflow(data: CreateWorkflowData): Promise<Workflow> {
  const { data: workflow, error } = await supabase
    .from('workflows')
    .insert([
      {
        name: data.name,
        trigger: data.trigger,
        steps: data.steps
      }
    ])
    .select()
    .single()

  if (error) {
    throw new Error('Erro ao criar cenário')
  }

  return workflow
}

export async function getWorkflows(): Promise<Workflow[]> {
  const { data: workflows, error } = await supabase
    .from('workflows')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Erro ao buscar cenários')
  }

  return workflows
}

export async function toggleWorkflow(workflowId: string, enabled: boolean): Promise<void> {
  const { error } = await supabase
    .from('workflows')
    .update({ enabled })
    .eq('id', workflowId)

  if (error) {
    throw new Error('Erro ao atualizar cenário')
  }
}

export async function deleteWorkflow(workflowId: string): Promise<void> {
  const { error } = await supabase
    .from('workflows')
    .delete()
    .eq('id', workflowId)

  if (error) {
    throw new Error('Erro ao excluir cenário')
  }
}

export interface Bot {
  id: string
  name: string
  type: string
  channel: string
  avatar?: string
  email?: string
  groups: string[]
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface CreateBotData {
  name: string
  type: string
  channel: string
  avatar?: string
  email?: string
  groups?: string[]
}

export async function createBot(data: CreateBotData): Promise<Bot> {
  const { data: bot, error } = await supabase
    .from('bots')
    .insert([
      {
        name: data.name,
        type: data.type,
        channel: data.channel,
        avatar: data.avatar,
        email: data.email,
        groups: data.groups || []
      }
    ])
    .select()
    .single()

  if (error) {
    throw new Error('Erro ao criar bot')
  }

  return bot
}

export async function getBots(): Promise<Bot[]> {
  const { data: bots, error } = await supabase
    .from('bots')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Erro ao buscar bots')
  }

  return bots
}

export async function toggleBot(botId: string, enabled: boolean): Promise<void> {
  const { error } = await supabase
    .from('bots')
    .update({ enabled })
    .eq('id', botId)

  if (error) {
    throw new Error('Erro ao atualizar bot')
  }
}

export async function deleteBot(botId: string): Promise<void> {
  const { error } = await supabase
    .from('bots')
    .delete()
    .eq('id', botId)

  if (error) {
    throw new Error('Erro ao excluir bot')
  }
}

export interface Pipeline {
  id: string
  name: string
  description?: string
  stages: string[]
  groups: string[]
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface CreatePipelineData {
  name: string
  description?: string
  stages: string[]
  groups: string[]
}

export async function createPipeline(data: CreatePipelineData): Promise<Pipeline> {
  const { data: pipeline, error } = await supabase
    .from('pipelines')
    .insert([
      {
        name: data.name,
        description: data.description,
        stages: data.stages,
        groups: data.groups || []
      }
    ])
    .select()
    .single()

  if (error) {
    throw new Error('Erro ao criar funil')
  }

  return pipeline
}

export async function getPipelines(): Promise<Pipeline[]> {
  const { data: pipelines, error } = await supabase
    .from('pipelines')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Erro ao buscar funis')
  }

  return pipelines
}

export async function togglePipeline(pipelineId: string, enabled: boolean): Promise<void> {
  const { error } = await supabase
    .from('pipelines')
    .update({ enabled })
    .eq('id', pipelineId)

  if (error) {
    throw new Error('Erro ao atualizar funil')
  }
}

export async function deletePipeline(pipelineId: string): Promise<void> {
  const { error } = await supabase
    .from('pipelines')
    .delete()
    .eq('id', pipelineId)

  if (error) {
    throw new Error('Erro ao excluir funil')
  }
}

export interface PipelineCadence {
  id: string
  pipeline_id: string
  stage: string
  task_title: string
  task_description?: string
  delay_days: number
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface CreatePipelineCadenceData {
  pipeline_id: string
  stage: string
  task_title: string
  task_description?: string
  delay_days: number
}

export async function createPipelineCadence(data: CreatePipelineCadenceData): Promise<PipelineCadence> {
  const { data: cadence, error } = await supabase
    .from('pipeline_cadences')
    .insert([{
      pipeline_id: data.pipeline_id,
      stage: data.stage,
      task_title: data.task_title,
      task_description: data.task_description,
      delay_days: data.delay_days
    }])
    .select()
    .single()

  if (error) {
    throw new Error('Erro ao criar cadência')
  }

  return cadence
}

export async function getPipelineCadences(pipelineId: string): Promise<PipelineCadence[]> {
  const { data: cadences, error } = await supabase
    .from('pipeline_cadences')
    .select('*')
    .eq('pipeline_id', pipelineId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Erro ao buscar cadências')
  }

  return cadences
}

export async function togglePipelineCadence(cadenceId: string, enabled: boolean): Promise<void> {
  const { error } = await supabase
    .from('pipeline_cadences')
    .update({ enabled })
    .eq('id', cadenceId)

  if (error) {
    throw new Error('Erro ao atualizar cadência')
  }
}

export async function deletePipelineCadence(cadenceId: string): Promise<void> {
  const { error } = await supabase
    .from('pipeline_cadences')
    .delete()
    .eq('id', cadenceId)

  if (error) {
    throw new Error('Erro ao excluir cadência')
  }
}

export type CourseCategory =
  | 'Segunda Licenciatura'
  | 'Formação Pedagógica'
  | 'EJA'
  | 'Bacharelado 2°'
  | 'Primeira Graduação'
  | 'Pós-Graduação'
  | 'MBA'
  | 'Formação Livre'
  | 'Capacitação'

export interface Course {
  id: string
  name: string
  description?: string
  category: CourseCategory
  full_price: number
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  final_price: number
  entry_fee: number
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface CreateCourseData {
  name: string
  description?: string
  category: CourseCategory
  full_price: number
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  final_price: number
  entry_fee: number
}

export async function createCourse(data: CreateCourseData): Promise<Course> {
  const { data: course, error } = await supabase
    .from('courses')
    .insert([{
      name: data.name,
      description: data.description,
      category: data.category,
      full_price: data.full_price,
      discount_type: data.discount_type,
      discount_value: data.discount_value,
      final_price: data.final_price,
      entry_fee: data.entry_fee
    }])
    .select()
    .single()

  if (error) {
    throw new Error('Erro ao criar curso')
  }

  return course
}

export async function getCourses(): Promise<Course[]> {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Erro ao buscar cursos')
  }

  return courses
}

export async function toggleCourse(courseId: string, enabled: boolean): Promise<void> {
  const { error } = await supabase
    .from('courses')
    .update({ enabled })
    .eq('id', courseId)

  if (error) {
    throw new Error('Erro ao atualizar curso')
  }
}

export async function deleteCourse(courseId: string): Promise<void> {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId)

  if (error) {
    throw new Error('Erro ao excluir curso')
  }
} 