import { supabase } from '@/lib/supabase'

export interface Stats {
  totalMessages: number
  activeConversations: number
  averageResponseTime: number
  satisfactionRate: number
  messagesByDay: Array<{
    date: string
    count: number
  }>
  conversationsByDay: Array<{
    date: string
    count: number
  }>
}

export async function getStats(period: 'day' | 'week' | 'month' = 'week'): Promise<Stats> {
  try {
    // Calcula a data inicial baseada no período
    const now = new Date()
    let startDate = new Date()
    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
    }

    // Busca total de mensagens
    const { count: totalMessages } = await supabase
      .from('messages')
      .select('*', { count: 'exact' })

    // Busca conversas ativas
    const { count: activeConversations } = await supabase
      .from('conversations')
      .select('*', { count: 'exact' })
      .eq('status', 'active')

    // Busca tempo médio de resposta (em minutos)
    const { data: responseTimeData } = await supabase
      .from('messages')
      .select('created_at, conversation_id')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    // Calcula tempo médio de resposta
    let totalResponseTime = 0
    let responseCount = 0
    if (responseTimeData) {
      for (let i = 1; i < responseTimeData.length; i++) {
        if (responseTimeData[i].conversation_id === responseTimeData[i-1].conversation_id) {
          const timeDiff = new Date(responseTimeData[i].created_at).getTime() - 
                          new Date(responseTimeData[i-1].created_at).getTime()
          totalResponseTime += timeDiff / 1000 / 60 // Converte para minutos
          responseCount++
        }
      }
    }
    const averageResponseTime = responseCount > 0 ? 
      Math.round((totalResponseTime / responseCount) * 10) / 10 : 0

    // Busca taxa de satisfação (mock por enquanto)
    const satisfactionRate = 98

    // Busca mensagens por dia
    const { data: messagesByDay } = await supabase
      .from('messages')
      .select('created_at')
      .gte('created_at', startDate.toISOString())

    // Agrupa mensagens por dia
    const messagesByDayMap = new Map<string, number>()
    messagesByDay?.forEach(message => {
      const date = new Date(message.created_at).toISOString().split('T')[0]
      messagesByDayMap.set(date, (messagesByDayMap.get(date) || 0) + 1)
    })

    // Busca conversas por dia
    const { data: conversationsByDay } = await supabase
      .from('conversations')
      .select('created_at')
      .gte('created_at', startDate.toISOString())

    // Agrupa conversas por dia
    const conversationsByDayMap = new Map<string, number>()
    conversationsByDay?.forEach(conversation => {
      const date = new Date(conversation.created_at).toISOString().split('T')[0]
      conversationsByDayMap.set(date, (conversationsByDayMap.get(date) || 0) + 1)
    })

    return {
      totalMessages: totalMessages || 0,
      activeConversations: activeConversations || 0,
      averageResponseTime,
      satisfactionRate,
      messagesByDay: Array.from(messagesByDayMap.entries()).map(([date, count]) => ({
        date,
        count
      })),
      conversationsByDay: Array.from(conversationsByDayMap.entries()).map(([date, count]) => ({
        date,
        count
      }))
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    throw new Error('Erro ao buscar estatísticas')
  }
}

export async function getStatsRealtime() {
  return supabase
    .channel('stats')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'messages',
    }, (payload) => {
      console.log('Mudança nas mensagens:', payload)
    })
    .subscribe()
} 