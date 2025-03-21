import { createClient } from '@supabase/supabase-js'
import { Conversation } from '../types'
import { logger } from '../lib/logger'
import { assignmentRulesMiddleware } from './assignment-rules-middleware'
import { businessHoursMiddleware } from './business-hours-middleware'

// Cliente Supabase para operações no banco de dados
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Interface para eventos de nova conversa
 */
export interface ConversationEvent {
  conversationId: string
  channelId: string
  eventType: 'new_conversation' | 'new_message' | 'status_change'
  metadata?: Record<string, any>
}

/**
 * Integração para processamento de novas conversas
 * Este serviço integra os middlewares de regras de atribuição e horários comerciais
 */
export class ConversationIntegrationService {
  /**
   * Processa um evento de nova conversa
   * @param event Evento de conversa
   */
  async processConversationEvent(event: ConversationEvent): Promise<void> {
    try {
      logger.info(`Processando evento de conversa: ${event.eventType}`, { 
        conversationId: event.conversationId,
        channelId: event.channelId
      })

      // Buscar os dados completos da conversa
      const { data: conversation, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', event.conversationId)
        .single()

      if (error || !conversation) {
        throw new Error(`Erro ao buscar conversa: ${error?.message || 'Conversa não encontrada'}`)
      }

      // Para eventos de nova conversa, aplicar os middlewares
      if (event.eventType === 'new_conversation') {
        await this.processNewConversation(conversation)
      } 
      // Para eventos de nova mensagem, verificar horários comerciais
      else if (event.eventType === 'new_message') {
        await this.processNewMessage(conversation, event.metadata)
      }
      // Para eventos de mudança de status, atualizar métricas
      else if (event.eventType === 'status_change') {
        await this.processStatusChange(conversation, event.metadata)
      }

    } catch (error) {
      const err = error as Error
      logger.error(`Erro ao processar evento de conversa: ${err.message}`, {
        eventDetails: event,
        stack: err.stack
      })
    }
  }

  /**
   * Processa uma nova conversa aplicando os middlewares
   * @param conversation Dados da conversa
   */
  private async processNewConversation(conversation: Conversation): Promise<void> {
    try {
      logger.info(`Processando nova conversa: ${conversation.id}`)

      // Passo 1: Verificar horários comerciais
      const conversationWithSchedule = await businessHoursMiddleware(conversation)
      
      // Passo 2: Aplicar regras de atribuição apenas se dentro do horário comercial
      // ou se a configuração permitir atribuição fora do horário
      if (!conversationWithSchedule.receivedOutsideBusinessHours || 
          process.env.ALLOW_ASSIGNMENT_OUTSIDE_HOURS === 'true') {
        await assignmentRulesMiddleware(conversationWithSchedule)
      } else {
        logger.info(`Conversa ${conversation.id} não será atribuída por estar fora do horário comercial`)
      }

      // Enviar notificações após o processamento completo
      await this.sendNotificationsForNewConversation(conversationWithSchedule)

    } catch (error) {
      const err = error as Error
      logger.error(`Erro ao processar nova conversa: ${err.message}`, {
        conversationId: conversation.id,
        stack: err.stack
      })
    }
  }

  /**
   * Processa uma nova mensagem em uma conversa existente
   * @param conversation Dados da conversa
   * @param metadata Metadados do evento
   */
  private async processNewMessage(conversation: Conversation, metadata?: Record<string, any>): Promise<void> {
    try {
      // Para mensagens em conversas existentes, verificamos apenas horários comerciais
      // para possíveis respostas automáticas
      await businessHoursMiddleware(conversation)

      // Se a conversa está aberta mas sem atribuição, tentamos aplicar regras
      if (conversation.status === 'open' && !conversation.assigned_to) {
        await assignmentRulesMiddleware(conversation)
      }

      // Outras lógicas específicas para novas mensagens podem ser adicionadas aqui
      // Por exemplo, atualizar status de espera, notificar agentes, etc.

    } catch (error) {
      const err = error as Error
      logger.error(`Erro ao processar nova mensagem: ${err.message}`, {
        conversationId: conversation.id,
        stack: err.stack
      })
    }
  }

  /**
   * Processa mudança de status em uma conversa
   * @param conversation Dados da conversa
   * @param metadata Metadados da mudança de status
   */
  private async processStatusChange(conversation: Conversation, metadata?: Record<string, any>): Promise<void> {
    try {
      const previousStatus = metadata?.previousStatus
      const newStatus = conversation.status

      logger.info(`Mudança de status na conversa ${conversation.id}: ${previousStatus} -> ${newStatus}`)

      // Realizar atualizações de métricas ou outras ações com base na mudança de status
      if (newStatus === 'closed' && previousStatus === 'open') {
        // Calcular e registrar tempo de resolução
        await this.calculateResolutionTime(conversation)
      }
      
      // Outras lógicas específicas para mudanças de status
      // Por exemplo, notificar sobre reabertura, escalar casos com muito tempo de espera, etc.

    } catch (error) {
      const err = error as Error
      logger.error(`Erro ao processar mudança de status: ${err.message}`, {
        conversationId: conversation.id,
        stack: err.stack
      })
    }
  }

  /**
   * Envia notificações para os interessados em uma nova conversa
   * @param conversation Dados da conversa
   */
  private async sendNotificationsForNewConversation(conversation: Conversation): Promise<void> {
    try {
      // Buscar configurações de notificação
      const { data: notificationConfig, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('enabled', true)
        .limit(1)
        .single()

      if (error || !notificationConfig) {
        logger.warn('Configurações de notificação não encontradas ou desabilitadas')
        return
      }

      // Determinar quem deve receber a notificação
      let recipientIds: string[] = []

      // Se a conversa foi atribuída a alguém
      if (conversation.assigned_to) {
        recipientIds.push(conversation.assigned_to)
      } 
      // Notificar supervisores ou administradores conforme configuração
      else if (notificationConfig.notify_admins_for_unassigned) {
        const { data: admins } = await supabase
          .from('users')
          .select('id')
          .eq('role', 'admin')
          .eq('active', true)

        if (admins && admins.length > 0) {
          recipientIds = admins.map(admin => admin.id)
        }
      }

      // Enviar notificações para cada destinatário
      for (const userId of recipientIds) {
        await supabase
          .from('notifications')
          .insert({
            userId,
            type: 'new_conversation',
            content: `Nova conversa recebida de ${conversation.contact?.name || 'contato'}`,
            linkUrl: `/inbox/conversation/${conversation.id}`,
            read: false,
            createdAt: new Date().toISOString()
          })

        logger.info(`Notificação enviada para usuário ${userId} sobre conversa ${conversation.id}`)
      }

    } catch (error) {
      const err = error as Error
      logger.error(`Erro ao enviar notificações: ${err.message}`, {
        conversationId: conversation.id,
        stack: err.stack
      })
    }
  }

  /**
   * Calcula e registra o tempo de resolução de uma conversa
   * @param conversation Dados da conversa
   */
  private async calculateResolutionTime(conversation: Conversation): Promise<void> {
    try {
      const createdAt = new Date(conversation.createdAt)
      const closedAt = new Date()
      
      // Calcular tempo de resolução em minutos
      const resolutionTimeMinutes = Math.round((closedAt.getTime() - createdAt.getTime()) / (1000 * 60))
      
      // Atualizar conversa com métricas
      await supabase
        .from('conversations')
        .update({
          resolutionTimeMinutes,
          metrics: {
            ...conversation.metrics,
            closedAt: closedAt.toISOString(),
            resolutionTimeMinutes
          }
        })
        .eq('id', conversation.id)
      
      logger.info(`Tempo de resolução calculado para conversa ${conversation.id}: ${resolutionTimeMinutes} minutos`)
      
      // Atualizar métricas agregadas se necessário
      await this.updateAggregateMetrics(conversation, resolutionTimeMinutes)
      
    } catch (error) {
      const err = error as Error
      logger.error(`Erro ao calcular tempo de resolução: ${err.message}`, {
        conversationId: conversation.id,
        stack: err.stack
      })
    }
  }
  
  /**
   * Atualiza métricas agregadas no sistema
   * @param conversation Dados da conversa
   * @param resolutionTime Tempo de resolução em minutos
   */
  private async updateAggregateMetrics(conversation: Conversation, resolutionTime: number): Promise<void> {
    try {
      const date = new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
      
      // Buscar registro de métricas do dia ou criar novo
      const { data: existingMetrics } = await supabase
        .from('daily_metrics')
        .select('*')
        .eq('date', date)
        .limit(1)
        .single()
      
      if (existingMetrics) {
        // Atualizar registro existente
        await supabase
          .from('daily_metrics')
          .update({
            totalConversations: existingMetrics.totalConversations + 1,
            resolvedConversations: existingMetrics.resolvedConversations + 1,
            totalResolutionTime: existingMetrics.totalResolutionTime + resolutionTime,
            avgResolutionTime: Math.round((existingMetrics.totalResolutionTime + resolutionTime) / (existingMetrics.resolvedConversations + 1)),
            updatedAt: new Date().toISOString()
          })
          .eq('id', existingMetrics.id)
      } else {
        // Criar novo registro
        await supabase
          .from('daily_metrics')
          .insert({
            date,
            totalConversations: 1,
            resolvedConversations: 1,
            totalResolutionTime: resolutionTime,
            avgResolutionTime: resolutionTime,
            channelMetrics: {
              [conversation.channelId]: {
                conversations: 1,
                resolved: 1
              }
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
      }
      
      logger.info(`Métricas agregadas atualizadas para data ${date}`)
      
    } catch (error) {
      const err = error as Error
      logger.error(`Erro ao atualizar métricas agregadas: ${err.message}`, {
        stack: err.stack
      })
    }
  }
}

// Singleton para facilitar o uso
export const conversationIntegration = new ConversationIntegrationService()

// Função auxiliar para processar eventos
export async function processConversationEvent(event: ConversationEvent): Promise<void> {
  await conversationIntegration.processConversationEvent(event)
} 