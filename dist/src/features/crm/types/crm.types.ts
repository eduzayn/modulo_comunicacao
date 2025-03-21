/**
 * Tipos para a feature de CRM
 */

// Tipos de Contatos
export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  type: 'Aluno' | 'Professor' | 'Parceiro' | 'Outro'
  created_at?: string
  updated_at?: string
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  type: Contact['type']
}

export interface ContactFilters {
  search?: string
  type?: Contact['type']
}

export interface ContactsState {
  contacts: Contact[]
  selectedContact: string | null
  filters: ContactFilters
  isLoading: boolean
  error: string | null
}

// Tipos de Negociações (Deals)
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

export interface DealState {
  deals: Deal[]
  selectedDeal: string | null
  isLoading: boolean
  error: string | null
}

// Estágios do funil de vendas
export type FunnelStage = 'lead' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost'

// Funções utilitárias
export function formatCurrency(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numValue)
}

export function getStageLabel(stage: string): string {
  const stageMap: Record<string, string> = {
    'lead': 'Lead',
    'qualification': 'Qualificação',
    'proposal': 'Proposta',
    'negotiation': 'Negociação',
    'closed-won': 'Ganho',
    'closed-lost': 'Perdido'
  }
  
  return stageMap[stage] || stage
}

// Dados mock para desenvolvimento
export function generateMockDeals(contactId: string): Deal[] {
  return [
    {
      id: '1',
      name: 'Curso de Programação',
      value: '1200.00',
      funnel: 'vendas',
      stage: 'proposal',
      contact_id: contactId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Mentoria Especializada',
      value: '3500.00',
      funnel: 'vendas',
      stage: 'negotiation',
      contact_id: contactId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
} 