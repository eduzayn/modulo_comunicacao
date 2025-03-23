import { createClient } from '@supabase/supabase-js'
import { logger } from '../lib/logger'
import type { Conversation } from '../types'
import type { AssignmentRule } from '../services/settings'

// Estendendo o tipo Conversation para incluir assigned_to que pode não estar na definição original
interface ConversationWithAssignment extends Conversation {
  assigned_to?: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Aplica as regras de atribuição existentes a uma conversa
 * @param conversation A conversa que precisa ser atribuída
 * @returns A conversa atualizada com o assigned_to definido
 */
export async function applyAssignmentRules(conversation: ConversationWithAssignment): Promise<ConversationWithAssignment> {
  try {
    logger.info(`Aplicando regras de atribuição para conversa ${conversation.id}`)

    // Buscar todas as regras de atribuição ativas, ordenadas por prioridade
    const { data: rules, error } = await supabase
      .from('assignment_rules')
      .select('*')
      .eq('enabled', true)
      .order('priority', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar regras de atribuição: ${error.message}`)
    }

    if (!rules || rules.length === 0) {
      logger.info('Nenhuma regra de atribuição encontrada. Conversa não será atribuída automaticamente.')
      return conversation
    }

    // Verificar cada regra para encontrar a primeira que se aplica
    const matchingRule = findMatchingRule(conversation, rules)

    if (!matchingRule) {
      logger.info('Nenhuma regra correspondente encontrada para esta conversa')
      return conversation
    }

    // Obter o destinatário com base na regra
    const assignedTo = await determineAssignee(matchingRule)

    if (!assignedTo) {
      logger.warn(`Não foi possível determinar um destinatário para a regra ${matchingRule.id}`)
      return conversation
    }

    // Atualizar a conversa com o destinatário
    const { data: updatedConversation, error: updateError } = await supabase
      .from('conversations')
      .update({ assigned_to: assignedTo })
      .eq('id', conversation.id)
      .select()
      .single()

    if (updateError) {
      throw new Error(`Erro ao atualizar conversa com o destinatário: ${updateError.message}`)
    }

    logger.info(`Conversa ${conversation.id} atribuída para ${assignedTo} pela regra "${matchingRule.name}"`)
    
    // Enviar notificação para o destinatário
    await sendAssignmentNotification(assignedTo, conversation.id)

    return updatedConversation
  } catch (error) {
    logger.error(`Erro ao aplicar regras de atribuição: ${(error as Error).message}`)
    return conversation
  }
}

/**
 * Encontra a primeira regra que corresponde à conversa
 */
function findMatchingRule(conversation: ConversationWithAssignment, rules: AssignmentRule[]): AssignmentRule | null {
  for (const rule of rules) {
    if (ruleMatchesConversation(conversation, rule)) {
      return rule
    }
  }
  return null
}

/**
 * Verifica se uma regra específica se aplica à conversa
 */
function ruleMatchesConversation(conversation: ConversationWithAssignment, rule: AssignmentRule): boolean {
  // Regras de correspondência baseadas no valor rule.rule
  const ruleType = rule.rule.split('_')[0]
  const ruleValue = rule.rule.split('_')[1]

  switch (ruleType) {
    case 'channel':
      return conversation.channelId.includes(ruleValue)
    
    case 'contains':
      // Verificar se a última mensagem contém o texto especificado
      if (conversation.messages && conversation.messages.length > 0) {
        const lastMessage = conversation.messages[conversation.messages.length - 1]
        return lastMessage.content.toLowerCase().includes(ruleValue.toLowerCase())
      }
      return false
    
    case 'customer':
      // Verificar propriedades do cliente
      const priorityMatch = ruleValue === 'priority_high' && conversation.priority === 'high'
      return priorityMatch
    
    default:
      return false
  }
}

/**
 * Determina o destinatário com base na regra
 */
async function determineAssignee(rule: AssignmentRule): Promise<string | null> {
  // Se a regra aponta diretamente para um usuário
  if (rule.assign_to.startsWith('user-')) {
    return rule.assign_to
  }
  
  // Se a regra aponta para um grupo, precisamos distribuir entre os membros
  if (rule.assign_to.startsWith('group-')) {
    const groupId = rule.assign_to.replace('group-', '')
    return await assignToGroupMember(groupId)
  }
  
  return null
}

/**
 * Atribui a conversa a um membro do grupo usando um algoritmo de distribuição
 */
async function assignToGroupMember(groupId: string): Promise<string | null> {
  try {
    // 1. Buscar todos os membros do grupo
    const { data: members, error } = await supabase
      .from('team_members')
      .select('user_id')
      .eq('team_id', groupId)
    
    if (error || !members || members.length === 0) {
      logger.error(`Erro ao buscar membros do grupo ${groupId}: ${error?.message}`)
      return null
    }
    
    // 2. Buscar a contagem de conversas atribuídas para cada membro
    interface UserLoad {
      assigned_to: string;
      count: number;
    }
    
    const memberIds = members.map(m => m.user_id)
    
    // Buscar todas as conversas abertas atribuídas aos membros
    const { data: openConversations, error: statsError } = await supabase
      .from('conversations')
      .select('assigned_to')
      .in('assigned_to', memberIds)
      .eq('status', 'open')
    
    if (statsError) {
      logger.error(`Erro ao buscar estatísticas de carga: ${statsError.message}`)
      // Em caso de erro, fazer round-robin simples
      const randomIndex = Math.floor(Math.random() * members.length)
      return members[randomIndex].user_id
    }
    
    // 3. Construir um mapa de carga de trabalho contando manualmente
    const workloads = new Map<string, number>()
    memberIds.forEach(id => workloads.set(id, 0)) // Inicializar todos com 0
    
    if (openConversations) {
      openConversations.forEach((conversation: { assigned_to: string }) => {
        const userId = conversation.assigned_to
        workloads.set(userId, (workloads.get(userId) || 0) + 1)
      })
    }
    
    // 4. Encontrar o membro com a menor carga
    let leastBusyMember = memberIds[0]
    let lowestCount = workloads.get(leastBusyMember) || 0
    
    workloads.forEach((count, userId) => {
      if (count < lowestCount) {
        lowestCount = count
        leastBusyMember = userId
      }
    })
    
    return leastBusyMember
  } catch (error) {
    logger.error(`Erro ao atribuir a membro do grupo: ${(error as Error).message}`)
    return null
  }
}

/**
 * Envia uma notificação ao destinatário sobre a nova atribuição
 */
async function sendAssignmentNotification(userId: string, conversationId: string): Promise<void> {
  try {
    // Criando uma notificação no banco de dados
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'conversation_assigned',
        content: `Uma nova conversa foi atribuída a você`,
        metadata: {
          conversationId
        },
        read: false
      })
    
    logger.info(`Notificação enviada para ${userId} sobre a conversa ${conversationId}`)
  } catch (error) {
    logger.error(`Erro ao enviar notificação: ${(error as Error).message}`)
  }
}

/**
 * Middleware para aplicar regras de atribuição em novas conversas
 * Este middleware deve ser chamado sempre que uma nova conversa for criada
 */
export async function assignmentRulesMiddleware(conversation: ConversationWithAssignment): Promise<ConversationWithAssignment> {
  // Verificar se a conversa já tem um destinatário
  if (conversation.assigned_to) {
    return conversation
  }
  
  // Aplicar regras de atribuição
  return applyAssignmentRules(conversation)
} 