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