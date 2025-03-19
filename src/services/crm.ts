import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface Deal {
  id: string
  name: string
  value: string
  funnel: string
  stage: string
  contact_id: string
  created_at: string
  updated_at: string
}

export interface CreateDealData {
  name: string
  value: string
  funnel: string
  stage: string
  contactId: string
}

export async function createDeal(data: CreateDealData): Promise<Deal> {
  const { data: deal, error } = await supabase
    .from('deals')
    .insert([
      {
        name: data.name,
        value: data.value,
        funnel: data.funnel,
        stage: data.stage,
        contact_id: data.contactId
      }
    ])
    .select()
    .single()

  if (error) {
    throw new Error('Erro ao criar negociação')
  }

  return deal
}

export async function getDealsByContact(contactId: string): Promise<Deal[]> {
  const { data: deals, error } = await supabase
    .from('deals')
    .select('*')
    .eq('contact_id', contactId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Erro ao buscar negociações')
  }

  return deals
}

export async function updateDealStage(dealId: string, stage: string): Promise<void> {
  const { error } = await supabase
    .from('deals')
    .update({ stage })
    .eq('id', dealId)

  if (error) {
    throw new Error('Erro ao atualizar etapa da negociação')
  }
} 