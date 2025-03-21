import { createClient } from '@supabase/supabase-js'
import { logger } from '../lib/logger'
import type { Conversation } from '../types'

// Estendendo o tipo Conversation para incluir propriedades relacionadas a horários
interface ConversationWithSchedule extends Conversation {
  receivedOutsideBusinessHours?: boolean;
  scheduledResponse?: boolean;
}

// Estrutura de horário de funcionamento
interface BusinessHours {
  id: string;
  name: string;
  schedule: {
    [day: string]: {
      enabled: boolean;
      openTime?: string;
      closeTime?: string;
    };
  };
  createdAt: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Verifica se a data/hora atual está dentro do horário comercial configurado
 * @returns true se estiver dentro do horário comercial, false caso contrário
 */
export async function isWithinBusinessHours(): Promise<boolean> {
  try {
    // Obter configurações de horário comercial ativas
    const { data: businessHours, error } = await supabase
      .from('business_hours')
      .select('*')
      .eq('enabled', true)
      .limit(1)
      .single()

    if (error || !businessHours) {
      logger.warn('Nenhuma configuração de horário comercial encontrada ou erro ao buscar:', { error: error ? error.message : 'Nenhum dado retornado' })
      return true // Valor padrão: se não houver configuração, assume-se que está sempre em horário comercial
    }

    const now = new Date()
    const dayOfWeek = getDayOfWeek(now)
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    // Verificar se o dia atual está configurado como dia útil
    const daySchedule = businessHours.schedule[dayOfWeek]
    if (!daySchedule || !daySchedule.enabled) {
      logger.info(`Hoje (${dayOfWeek}) não é um dia útil conforme configuração`)
      return false
    }

    // Verificar se está dentro do horário configurado
    const isWithinHours = isTimeWithinRange(currentTime, daySchedule.openTime || '00:00', daySchedule.closeTime || '23:59')
    
    logger.info(`Horário atual (${currentTime}) está ${isWithinHours ? 'dentro' : 'fora'} do horário comercial`)
    return isWithinHours
  } catch (error) {
    logger.error(`Erro ao verificar horário comercial: ${(error as Error).message}`)
    return true // Em caso de erro, assume que está em horário comercial
  }
}

/**
 * Retorna o dia da semana no formato esperado pela configuração
 */
function getDayOfWeek(date: Date): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[date.getDay()]
}

/**
 * Verifica se um horário está dentro de um intervalo
 */
function isTimeWithinRange(time: string, startTime: string, endTime: string): boolean {
  return time >= startTime && time <= endTime
}

/**
 * Aplica respostas automáticas para mensagens recebidas fora do horário comercial
 */
async function sendOutOfHoursResponse(conversation: ConversationWithSchedule): Promise<void> {
  try {
    // Verificar se já existe uma resposta automática recente para esta conversa
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)
    
    const { data: recentResponses, error: checkError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversationId', conversation.id)
      .eq('type', 'system')
      .eq('metadata->autoResponse', true)
      .gt('createdAt', oneDayAgo.toISOString())
      .limit(1)
    
    if (checkError) {
      throw new Error(`Erro ao verificar respostas recentes: ${checkError.message}`)
    }
    
    // Se já enviou uma resposta automática nas últimas 24h, não enviar outra
    if (recentResponses && recentResponses.length > 0) {
      logger.info(`Já existe uma resposta automática recente para a conversa ${conversation.id}`)
      return
    }
    
    // Buscar template de resposta automática
    const { data: template, error: templateError } = await supabase
      .from('auto_response_templates')
      .select('*')
      .eq('type', 'outside_business_hours')
      .eq('enabled', true)
      .limit(1)
      .single()
    
    if (templateError || !template) {
      throw new Error(`Erro ao buscar template de resposta: ${templateError?.message}`)
    }
    
    // Preparar e enviar mensagem automática
    const { error: sendError } = await supabase
      .from('messages')
      .insert({
        conversationId: conversation.id,
        content: template.content,
        senderId: 'system',
        type: 'system',
        createdAt: new Date().toISOString(),
        metadata: {
          autoResponse: true,
          responseType: 'outside_business_hours'
        }
      })
    
    if (sendError) {
      throw new Error(`Erro ao enviar resposta automática: ${sendError.message}`)
    }
    
    logger.info(`Resposta automática de fora do horário enviada para conversa ${conversation.id}`)
    
    // Atualizar a conversa para indicar que uma resposta foi enviada
    await supabase
      .from('conversations')
      .update({
        scheduledResponse: true,
        updatedAt: new Date().toISOString()
      })
      .eq('id', conversation.id)
    
  } catch (error) {
    logger.error(`Erro ao enviar resposta de fora do horário: ${(error as Error).message}`)
  }
}

/**
 * Adiciona conversa à fila para processamento em horário comercial
 */
async function addToQueue(conversation: ConversationWithSchedule): Promise<void> {
  try {
    // Adicionar à tabela de filas para processamento posterior
    await supabase
      .from('conversation_queue')
      .insert({
        conversationId: conversation.id,
        reason: 'outside_business_hours',
        priority: conversation.priority,
        createdAt: new Date().toISOString(),
        processAfter: getNextBusinessHoursStart()
      })
    
    logger.info(`Conversa ${conversation.id} adicionada à fila para processamento no próximo horário comercial`)
  } catch (error) {
    logger.error(`Erro ao adicionar conversa à fila: ${(error as Error).message}`)
  }
}

/**
 * Calcula o próximo horário de início do expediente
 */
async function getNextBusinessHoursStart(): Promise<string> {
  try {
    // Buscar configurações de horário comercial
    const { data: businessHours, error } = await supabase
      .from('business_hours')
      .select('*')
      .eq('enabled', true)
      .limit(1)
      .single()
    
    if (error || !businessHours) {
      // Se não houver configuração, definir para amanhã 9h
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(9, 0, 0, 0)
      return tomorrow.toISOString()
    }
    
    const now = new Date()
    const currentDay = getDayOfWeek(now)
    const currentDaySchedule = businessHours.schedule[currentDay]
    
    // Se hoje for dia útil e ainda não passou o horário de fechamento
    if (currentDaySchedule?.enabled && currentDaySchedule.closeTime) {
      const [closeHour, closeMinute] = currentDaySchedule.closeTime.split(':').map(Number)
      const closeTime = new Date(now)
      closeTime.setHours(closeHour, closeMinute, 0, 0)
      
      if (now < closeTime) {
        // Se o horário de abertura já passou hoje, retornar horário atual
        if (currentDaySchedule.openTime) {
          const [openHour, openMinute] = currentDaySchedule.openTime.split(':').map(Number)
          const openTime = new Date(now)
          openTime.setHours(openHour, openMinute, 0, 0)
          
          if (now >= openTime) {
            return now.toISOString()
          } else {
            return openTime.toISOString()
          }
        }
      }
    }
    
    // Caso contrário, encontrar o próximo dia útil
    let nextDay = new Date(now)
    let daysChecked = 0
    let foundNextDay = false
    
    while (!foundNextDay && daysChecked < 7) {
      nextDay.setDate(nextDay.getDate() + 1)
      daysChecked++
      
      const nextDayOfWeek = getDayOfWeek(nextDay)
      const nextDaySchedule = businessHours.schedule[nextDayOfWeek]
      
      if (nextDaySchedule?.enabled && nextDaySchedule.openTime) {
        foundNextDay = true
        const [openHour, openMinute] = nextDaySchedule.openTime.split(':').map(Number)
        nextDay.setHours(openHour, openMinute, 0, 0)
      }
    }
    
    // Se não encontrou nenhum dia útil, retorna amanhã às 9h como padrão
    if (!foundNextDay) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(9, 0, 0, 0)
      return tomorrow.toISOString()
    }
    
    return nextDay.toISOString()
  } catch (error) {
    logger.error(`Erro ao calcular próximo horário comercial: ${(error as Error).message}`)
    // Em caso de erro, definir para amanhã 9h
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0)
    return tomorrow.toISOString()
  }
}

/**
 * Middleware para verificar horários comerciais
 * Este middleware deve ser chamado sempre que uma nova mensagem for recebida
 */
export async function businessHoursMiddleware(conversation: ConversationWithSchedule): Promise<ConversationWithSchedule> {
  try {
    // Verificar se a conversa já foi processada para horário comercial
    if (conversation.receivedOutsideBusinessHours !== undefined) {
      return conversation
    }
    
    // Verificar se está dentro do horário comercial
    const withinBusinessHours = await isWithinBusinessHours()
    
    // Atualizar a conversa com a flag de horário
    const { data: updatedConversation, error } = await supabase
      .from('conversations')
      .update({ 
        receivedOutsideBusinessHours: !withinBusinessHours,
        updatedAt: new Date().toISOString()
      })
      .eq('id', conversation.id)
      .select()
      .single()
    
    if (error) {
      throw new Error(`Erro ao atualizar conversa com status de horário: ${error.message}`)
    }
    
    // Se estiver fora do horário comercial, enviar resposta automática
    if (!withinBusinessHours) {
      logger.info(`Conversa ${conversation.id} recebida fora do horário comercial`)
      await sendOutOfHoursResponse(conversation)
      await addToQueue(conversation)
    }
    
    return updatedConversation
  } catch (error) {
    logger.error(`Erro no middleware de horários comerciais: ${(error as Error).message}`)
    return conversation
  }
} 