import { supabase } from '@/lib/supabase/config';
import { TABELAS } from '@/lib/supabase/config';

export interface ConversationStats {
  total: number;
  newCount: number;
  openCount: number;
  resolvedCount: number;
  pendingCount: number;
  averageResponseTime: number | null;
}

export interface ContactStats {
  total: number;
  customersCount: number;
  leadsCount: number;
  newThisMonth: number;
  newLastMonth: number;
  growthRate: number;
}

export interface DealStats {
  total: number;
  openCount: number;
  wonCount: number;
  lostCount: number;
  totalValue: number;
  wonValue: number;
  averageDealSize: number;
  conversionRate: number;
}

export interface UserPerformanceStats {
  userId: string;
  userName: string;
  resolvedConversations: number;
  averageResponseTime: number | null;
  dealsWon: number;
  dealsLost: number;
  dealValue: number;
}

export const statsService = {
  async getConversationStats(period?: 'day' | 'week' | 'month' | 'year'): Promise<{ success: boolean; data?: ConversationStats; error?: { code: string; message: string } }> {
    try {
      // Determinar o início do período conforme o filtro
      let startDate: Date | null = null;
      const now = new Date();
      
      if (period) {
        startDate = new Date();
        switch (period) {
          case 'day':
            startDate.setDate(startDate.getDate() - 1);
            break;
          case 'week':
            startDate.setDate(startDate.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(startDate.getMonth() - 1);
            break;
          case 'year':
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
        }
      }
      
      // Montar a consulta base
      let query = supabase.from(TABELAS.CONVERSATIONS).select('id, status, created_at, last_message_at, first_response_at');
      
      // Aplicar filtro de período se fornecido
      if (startDate) {
        const startDateString = startDate.toISOString();
        query = query.gte('created_at', startDateString);
      }
      
      // Executar a consulta
      const { data: conversations, error } = await query;
      
      if (error) throw error;
      
      // Calcular as estatísticas
      const stats: ConversationStats = {
        total: conversations.length,
        newCount: conversations.filter(c => c.status === 'novo').length,
        openCount: conversations.filter(c => c.status === 'aberto').length,
        resolvedCount: conversations.filter(c => c.status === 'resolvido').length,
        pendingCount: conversations.filter(c => c.status === 'pendente').length,
        averageResponseTime: null,
      };
      
      // Calcular tempo médio de resposta
      const responseTimes: number[] = [];
      
      conversations.forEach(conv => {
        if (conv.first_response_at && conv.last_message_at) {
          const messageDate = new Date(conv.last_message_at);
          const responseDate = new Date(conv.first_response_at);
          const diffInMs = responseDate.getTime() - messageDate.getTime();
          
          if (diffInMs > 0) {
            responseTimes.push(diffInMs);
          }
        }
      });
      
      if (responseTimes.length > 0) {
        const totalMs = responseTimes.reduce((sum, time) => sum + time, 0);
        stats.averageResponseTime = totalMs / responseTimes.length / (1000 * 60); // em minutos
      }
      
      return { success: true, data: stats };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_CONVERSATION_STATS_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao obter estatísticas de conversas',
        },
      };
    }
  },
  
  async getContactStats(): Promise<{ success: boolean; data?: ContactStats; error?: { code: string; message: string } }> {
    try {
      // Obter todos os contatos para calcular estatísticas
      const { data: contacts, error } = await supabase
        .from(TABELAS.CONTACTS)
        .select('id, is_customer, created_at');
      
      if (error) throw error;
      
      // Calcular o início do mês atual e do mês anterior
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      
      const lastMonth = new Date(now);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthStart = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1).toISOString();
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();
      
      // Calcular estatísticas
      const total = contacts.length;
      const customersCount = contacts.filter(c => c.is_customer).length;
      const leadsCount = total - customersCount;
      
      const newThisMonth = contacts.filter(c => c.created_at >= currentMonthStart).length;
      const newLastMonth = contacts.filter(c => c.created_at >= lastMonthStart && c.created_at <= lastMonthEnd).length;
      
      // Calcular taxa de crescimento (evitar divisão por zero)
      let growthRate = 0;
      if (newLastMonth > 0) {
        growthRate = ((newThisMonth - newLastMonth) / newLastMonth) * 100;
      } else if (newThisMonth > 0) {
        growthRate = 100; // 100% de crescimento se não havia no mês anterior
      }
      
      const stats: ContactStats = {
        total,
        customersCount,
        leadsCount,
        newThisMonth,
        newLastMonth,
        growthRate,
      };
      
      return { success: true, data: stats };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_CONTACT_STATS_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao obter estatísticas de contatos',
        },
      };
    }
  },
  
  async getDealStats(period?: 'month' | 'quarter' | 'year'): Promise<{ success: boolean; data?: DealStats; error?: { code: string; message: string } }> {
    try {
      // Determinar o início do período conforme o filtro
      let startDate: Date | null = null;
      const now = new Date();
      
      if (period) {
        startDate = new Date();
        switch (period) {
          case 'month':
            startDate.setMonth(startDate.getMonth() - 1);
            break;
          case 'quarter':
            startDate.setMonth(startDate.getMonth() - 3);
            break;
          case 'year':
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
        }
      }
      
      // Montar a consulta base
      let query = supabase.from(TABELAS.DEALS).select('id, status, value, created_at, closed_at');
      
      // Aplicar filtro de período se fornecido
      if (startDate) {
        const startDateString = startDate.toISOString();
        query = query.gte('created_at', startDateString);
      }
      
      // Executar a consulta
      const { data: deals, error } = await query;
      
      if (error) throw error;
      
      // Calcular estatísticas
      const total = deals.length;
      const openDeals = deals.filter(d => d.status === 'aberta');
      const wonDeals = deals.filter(d => d.status === 'ganha');
      const lostDeals = deals.filter(d => d.status === 'perdida');
      
      const openCount = openDeals.length;
      const wonCount = wonDeals.length;
      const lostCount = lostDeals.length;
      
      // Calcular valores
      const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
      const wonValue = wonDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
      
      // Calcular tamanho médio das negociações
      const averageDealSize = total > 0 ? totalValue / total : 0;
      
      // Calcular taxa de conversão (ganhas / (ganhas + perdidas))
      const closedDealsCount = wonCount + lostCount;
      const conversionRate = closedDealsCount > 0 ? (wonCount / closedDealsCount) * 100 : 0;
      
      const stats: DealStats = {
        total,
        openCount,
        wonCount,
        lostCount,
        totalValue,
        wonValue,
        averageDealSize,
        conversionRate,
      };
      
      return { success: true, data: stats };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_DEAL_STATS_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao obter estatísticas de negociações',
        },
      };
    }
  },
  
  async getUserPerformanceStats(period?: 'week' | 'month' | 'quarter' | 'year'): Promise<{ success: boolean; data?: UserPerformanceStats[]; error?: { code: string; message: string } }> {
    try {
      // Determinar o início do período conforme o filtro
      let startDate: Date | null = null;
      const now = new Date();
      
      if (period) {
        startDate = new Date();
        switch (period) {
          case 'week':
            startDate.setDate(startDate.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(startDate.getMonth() - 1);
            break;
          case 'quarter':
            startDate.setMonth(startDate.getMonth() - 3);
            break;
          case 'year':
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
        }
      }
      
      const startDateString = startDate ? startDate.toISOString() : null;
      
      // Obter todos os usuários
      const { data: users, error: usersError } = await supabase
        .from(TABELAS.PROFILES)
        .select('id, name')
        .eq('role', 'agent');
      
      if (usersError) throw usersError;
      
      // Para cada usuário, coletar estatísticas
      const userStats: UserPerformanceStats[] = [];
      
      for (const user of users) {
        // Conversas resolvidas pelo usuário
        let conversationsQuery = supabase
          .from(TABELAS.CONVERSATIONS)
          .select('id, first_response_at, last_message_at')
          .eq('assigned_to', user.id)
          .eq('status', 'resolvido');
        
        if (startDateString) {
          conversationsQuery = conversationsQuery.gte('closed_at', startDateString);
        }
        
        const { data: resolvedConversations, error: convError } = await conversationsQuery;
        
        if (convError) throw convError;
        
        // Calcular tempo médio de resposta
        let averageResponseTime: number | null = null;
        const responseTimes: number[] = [];
        
        resolvedConversations.forEach(conv => {
          if (conv.first_response_at && conv.last_message_at) {
            const messageDate = new Date(conv.last_message_at);
            const responseDate = new Date(conv.first_response_at);
            const diffInMs = responseDate.getTime() - messageDate.getTime();
            
            if (diffInMs > 0) {
              responseTimes.push(diffInMs);
            }
          }
        });
        
        if (responseTimes.length > 0) {
          const totalMs = responseTimes.reduce((sum, time) => sum + time, 0);
          averageResponseTime = totalMs / responseTimes.length / (1000 * 60); // em minutos
        }
        
        // Negociações do usuário
        let dealsQuery = supabase
          .from(TABELAS.DEALS)
          .select('id, status, value')
          .eq('owner_id', user.id);
        
        if (startDateString) {
          dealsQuery = dealsQuery.gte('closed_at', startDateString);
        }
        
        const { data: userDeals, error: dealsError } = await dealsQuery;
        
        if (dealsError) throw dealsError;
        
        const dealsWon = userDeals.filter(d => d.status === 'ganha').length;
        const dealsLost = userDeals.filter(d => d.status === 'perdida').length;
        const dealValue = userDeals
          .filter(d => d.status === 'ganha')
          .reduce((sum, deal) => sum + (deal.value || 0), 0);
        
        userStats.push({
          userId: user.id,
          userName: user.name,
          resolvedConversations: resolvedConversations.length,
          averageResponseTime,
          dealsWon,
          dealsLost,
          dealValue,
        });
      }
      
      // Ordenar por melhor desempenho (maior número de conversas resolvidas)
      userStats.sort((a, b) => b.resolvedConversations - a.resolvedConversations);
      
      return { success: true, data: userStats };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_USER_PERFORMANCE_ERROR',
          message: error instanceof Error ? error.message : 'Falha ao obter estatísticas de desempenho dos usuários',
        },
      };
    }
  }
}; 