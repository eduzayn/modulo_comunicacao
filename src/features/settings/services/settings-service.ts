/**
 * Serviços relacionados às configurações do sistema
 */

import { supabase } from '@/lib/supabase'
import { 
  Automation, 
  Bot, 
  Channel, 
  Pipeline, 
  AssignmentRule, 
  Course,
  CreateAutomationInput,
  CreateBotInput,
  CreatePipelineInput,
  CreateAssignmentRuleInput,
  CreateCourseInput
} from '../types/settings.types'

// --------------------------------
// Automações
// --------------------------------

/**
 * Busca todas as automações cadastradas
 */
export async function getAutomations(): Promise<Automation[]> {
  // Simulação - em produção, substituir por chamada real ao Supabase
  return [
    {
      id: '1',
      name: 'Mover para suporte',
      event: 'resolve_conversation',
      action: 'move_group',
      enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Adicionar tag prioritário',
      event: 'pending_time',
      action: 'add_tag',
      enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
}

/**
 * Cria uma nova automação
 */
export async function createAutomation(data: CreateAutomationInput): Promise<Automation> {
  // Simulação - em produção, substituir por chamada real ao Supabase
  console.log('Criando automação:', data)
  
  // Simula o delay de uma requisição
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    id: Math.random().toString(36).substring(7),
    ...data,
    enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

/**
 * Ativa/desativa uma automação
 */
export async function toggleAutomation(id: string, enabled: boolean): Promise<void> {
  // Simulação - em produção, substituir por chamada real ao Supabase
  console.log(`Alternando automação ${id} para ${enabled ? 'ativado' : 'desativado'}`)
  
  // Simula o delay de uma requisição
  await new Promise(resolve => setTimeout(resolve, 500))
}

// --------------------------------
// Bots
// --------------------------------

/**
 * Busca todos os bots cadastrados
 */
export async function getBots(): Promise<Bot[]> {
  // Simulação - em produção, substituir por chamada real ao Supabase
  return [
    {
      id: '1',
      name: 'Assistente de Vendas',
      channel: 'whatsapp',
      model: 'gpt-4',
      enabled: true,
      avatar: '/avatars/bot-1.png',
      groups: ['sales'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Suporte Técnico',
      channel: 'widget',
      model: 'claude-3',
      enabled: true,
      avatar: '/avatars/bot-2.png',
      groups: ['support'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Assistente de E-mail',
      channel: 'email',
      model: 'gpt-3.5',
      enabled: false,
      email: 'assistant@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
}

/**
 * Cria um novo bot
 */
export async function createBot(data: CreateBotInput): Promise<Bot> {
  // Simulação - em produção, substituir por chamada real ao Supabase
  console.log('Criando bot:', data)
  
  // Simula o delay de uma requisição
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    id: Math.random().toString(36).substring(7),
    ...data,
    enabled: true,
    avatar: '/avatars/bot-default.png',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

/**
 * Ativa/desativa um bot
 */
export async function toggleBot(id: string, enabled: boolean): Promise<void> {
  // Simulação - em produção, substituir por chamada real ao Supabase
  console.log(`Alternando bot ${id} para ${enabled ? 'ativado' : 'desativado'}`)
  
  // Simula o delay de uma requisição
  await new Promise(resolve => setTimeout(resolve, 500))
}

// --------------------------------
// Canais (relacionados à Caixa de Entrada)
// --------------------------------

/**
 * Busca todos os canais cadastrados
 */
export async function getChannels(): Promise<Channel[]> {
  // Simulação - em produção, substituir por chamada real ao Supabase
  return [
    {
      id: '1',
      name: 'WhatsApp Principal',
      type: 'whatsapp',
      enabled: true,
      inboxId: 'inbox-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'E-mail Suporte',
      type: 'email',
      enabled: true,
      inboxId: 'inbox-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Instagram',
      type: 'instagram',
      enabled: false,
      inboxId: 'inbox-2',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
}

// --------------------------------
// Pipelines (relacionados ao CRM)
// --------------------------------

/**
 * Busca todos os pipelines cadastrados
 */
export async function getPipelines(): Promise<Pipeline[]> {
  // Simulação - em produção, substituir por chamada real ao Supabase
  return [
    {
      id: '1',
      name: 'Pipeline de Vendas',
      stages: [
        { id: 's1', name: 'Qualificação', position: 0, color: '#3498db' },
        { id: 's2', name: 'Apresentação', position: 1, color: '#2ecc71' },
        { id: 's3', name: 'Proposta', position: 2, color: '#f1c40f' },
        { id: 's4', name: 'Negociação', position: 3, color: '#e67e22' },
        { id: 's5', name: 'Fechamento', position: 4, color: '#e74c3c' }
      ],
      enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Pipeline de Suporte',
      stages: [
        { id: 's1', name: 'Novo', position: 0, color: '#3498db' },
        { id: 's2', name: 'Em análise', position: 1, color: '#f1c40f' },
        { id: 's3', name: 'Resolvido', position: 2, color: '#2ecc71' }
      ],
      enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
}

/**
 * Cria um novo pipeline
 */
export async function createPipeline(data: CreatePipelineInput): Promise<Pipeline> {
  // Simulação - em produção, substituir por chamada real ao Supabase
  console.log('Criando pipeline:', data)
  
  // Simula o delay de uma requisição
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Adiciona IDs para os estágios
  const stages = data.stages.map((stage, index) => ({
    ...stage,
    id: `stage-${index}-${Math.random().toString(36).substring(7)}`,
    position: index
  }))
  
  return {
    id: Math.random().toString(36).substring(7),
    name: data.name,
    stages,
    enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
} 