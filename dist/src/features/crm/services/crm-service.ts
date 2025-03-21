import { createClient } from '@supabase/supabase-js'
import type { 
  Deal, 
  CreateDealData, 
  Contact, 
  ContactFormData 
} from '../types/crm.types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Serviços relacionados a negociações (deals)
 */
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

  return deals || []
}

export async function updateDealStage(dealId: string, stage: string): Promise<void> {
  const { error } = await supabase
    .from('deals')
    .update({ stage, updated_at: new Date().toISOString() })
    .eq('id', dealId)

  if (error) {
    throw new Error('Erro ao atualizar etapa da negociação')
  }
}

export async function deleteDeal(dealId: string): Promise<void> {
  const { error } = await supabase
    .from('deals')
    .delete()
    .eq('id', dealId)

  if (error) {
    throw new Error('Erro ao excluir negociação')
  }
}

/**
 * Serviços relacionados a contatos
 */
export async function getContacts(search?: string, type?: string): Promise<Contact[]> {
  let query = supabase
    .from('contacts')
    .select('*')
    .order('name')
  
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
  }
  
  if (type) {
    query = query.eq('type', type)
  }
  
  const { data, error } = await query

  if (error) {
    throw new Error('Erro ao buscar contatos')
  }

  return data || []
}

export async function getContactById(id: string): Promise<Contact> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error('Erro ao buscar contato')
  }

  return data
}

export async function createContact(data: ContactFormData): Promise<Contact> {
  const { data: contact, error } = await supabase
    .from('contacts')
    .insert([
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        type: data.type
      }
    ])
    .select()
    .single()

  if (error) {
    throw new Error('Erro ao criar contato')
  }

  return contact
}

export async function updateContact(id: string, data: ContactFormData): Promise<Contact> {
  const { data: contact, error } = await supabase
    .from('contacts')
    .update({
      name: data.name,
      email: data.email,
      phone: data.phone,
      type: data.type,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error('Erro ao atualizar contato')
  }

  return contact
}

export async function deleteContact(id: string): Promise<void> {
  // Primeiro excluir negociações relacionadas
  const { error: dealsError } = await supabase
    .from('deals')
    .delete()
    .eq('contact_id', id)

  if (dealsError) {
    throw new Error('Erro ao excluir negociações do contato')
  }

  // Depois excluir o contato
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error('Erro ao excluir contato')
  }
} 