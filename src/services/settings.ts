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