/**
 * timeTracking.ts
 * 
 * Serviço para gerenciar a contagem de horas trabalhadas e calcular valores
 * 
 * @module services
 * @created 2025-03-20
 */

import { supabase } from '@/lib/supabase';

/**
 * Tipos para o serviço de contagem de horas
 */

export interface TimeEntry {
  id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  is_running: boolean;
  category: string;
  task_description?: string;
  sector_id?: string;
  role_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Sector {
  id: string;
  name: string;
  base_hourly_rate: number;
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  hourly_rate_multiplier: number;
  created_at: string;
}

/**
 * Iniciar contagem de horas
 * 
 * @param userId ID do usuário
 * @param category Categoria da atividade
 * @param taskDescription Descrição da tarefa
 * @param sectorId ID do setor
 * @param roleId ID do cargo
 * @returns Entrada de tempo criada
 */
export async function startTimeTracking(
  userId: string,
  category: string,
  taskDescription?: string,
  sectorId?: string,
  roleId?: string
): Promise<TimeEntry | null> {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('time_entries')
      .insert({
        user_id: userId,
        start_time: now,
        is_running: true,
        category,
        task_description: taskDescription,
        sector_id: sectorId,
        role_id: roleId,
        created_at: now,
        updated_at: now
      })
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao iniciar contagem de horas:', error);
      return null;
    }

    return data as TimeEntry;
  } catch (error) {
    console.error('Erro inesperado ao iniciar contagem de horas:', error);
    return null;
  }
}

/**
 * Pausar contagem de horas
 * 
 * @param timeEntryId ID da entrada de tempo
 * @returns Entrada de tempo atualizada
 */
export async function pauseTimeTracking(timeEntryId: string): Promise<TimeEntry | null> {
  try {
    const now = new Date().toISOString();

    // Buscar a entrada atual
    const { data: currentEntry, error: fetchError } = await supabase
      .from('time_entries')
      .select('*')
      .eq('id', timeEntryId)
      .single();

    if (fetchError || !currentEntry) {
      console.error('Erro ao buscar entrada de tempo:', fetchError);
      return null;
    }

    // Calcular duração
    const startTime = new Date(currentEntry.start_time).getTime();
    const endTime = new Date(now).getTime();
    const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));

    // Atualizar a entrada
    const { data, error } = await supabase
      .from('time_entries')
      .update({
        end_time: now,
        is_running: false,
        duration_minutes: durationMinutes,
        updated_at: now
      })
      .eq('id', timeEntryId)
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao pausar contagem de horas:', error);
      return null;
    }

    return data as TimeEntry;
  } catch (error) {
    console.error('Erro inesperado ao pausar contagem de horas:', error);
    return null;
  }
}

/**
 * Retomar contagem de horas
 * 
 * @param timeEntryId ID da entrada de tempo
 * @returns Nova entrada de tempo
 */
export async function resumeTimeTracking(userId: string, timeEntryId: string): Promise<TimeEntry | null> {
  try {
    // Buscar a entrada anterior
    const { data: previousEntry, error: fetchError } = await supabase
      .from('time_entries')
      .select('*')
      .eq('id', timeEntryId)
      .single();

    if (fetchError || !previousEntry) {
      console.error('Erro ao buscar entrada de tempo anterior:', fetchError);
      return null;
    }

    // Criar uma nova entrada com os mesmos dados
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('time_entries')
      .insert({
        user_id: userId,
        start_time: now,
        is_running: true,
        category: previousEntry.category,
        task_description: previousEntry.task_description,
        sector_id: previousEntry.sector_id,
        role_id: previousEntry.role_id,
        created_at: now,
        updated_at: now
      })
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao retomar contagem de horas:', error);
      return null;
    }

    return data as TimeEntry;
  } catch (error) {
    console.error('Erro inesperado ao retomar contagem de horas:', error);
    return null;
  }
}

/**
 * Obter entradas de tempo de um usuário
 * 
 * @param userId ID do usuário
 * @param limit Limite de resultados
 * @param offset Offset para paginação
 * @returns Lista de entradas de tempo
 */
export async function getUserTimeEntries(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<TimeEntry[]> {
  try {
    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Erro ao obter entradas de tempo:', error);
      return [];
    }

    return data as TimeEntry[];
  } catch (error) {
    console.error('Erro inesperado ao obter entradas de tempo:', error);
    return [];
  }
}

/**
 * Verificar se o usuário tem uma contagem de tempo ativa
 * 
 * @param userId ID do usuário
 * @returns Entrada de tempo ativa ou null
 */
export async function getActiveTimeEntry(userId: string): Promise<TimeEntry | null> {
  try {
    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('is_running', true)
      .maybeSingle();

    if (error) {
      console.error('Erro ao verificar contagem ativa:', error);
      return null;
    }

    return data as TimeEntry | null;
  } catch (error) {
    console.error('Erro inesperado ao verificar contagem ativa:', error);
    return null;
  }
}

/**
 * Calcular valor da hora trabalhada
 * 
 * @param sectorId ID do setor
 * @param roleId ID do cargo
 * @returns Valor da hora trabalhada
 */
export async function calculateHourlyRate(sectorId: string, roleId: string): Promise<number> {
  try {
    // Buscar o setor
    const { data: sector, error: sectorError } = await supabase
      .from('sectors')
      .select('*')
      .eq('id', sectorId)
      .single();

    if (sectorError || !sector) {
      console.error('Erro ao buscar setor:', sectorError);
      return 0;
    }

    // Buscar o cargo
    const { data: role, error: roleError } = await supabase
      .from('roles')
      .select('*')
      .eq('id', roleId)
      .single();

    if (roleError || !role) {
      console.error('Erro ao buscar cargo:', roleError);
      return 0;
    }

    // Calcular valor da hora
    const hourlyRate = sector.base_hourly_rate * role.hourly_rate_multiplier;
    return hourlyRate;
  } catch (error) {
    console.error('Erro inesperado ao calcular valor da hora:', error);
    return 0;
  }
}

/**
 * Calcular horas trabalhadas em um período
 * 
 * @param userId ID do usuário
 * @param startDate Data de início
 * @param endDate Data de fim
 * @returns Total de minutos trabalhados
 */
export async function calculateWorkedTime(
  userId: string,
  startDate: string,
  endDate: string
): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('time_entries')
      .select('duration_minutes')
      .eq('user_id', userId)
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) {
      console.error('Erro ao calcular horas trabalhadas:', error);
      return 0;
    }

    // Calcular total de minutos
    const totalMinutes = data.reduce((total, entry) => total + (entry.duration_minutes || 0), 0);
    return totalMinutes;
  } catch (error) {
    console.error('Erro inesperado ao calcular horas trabalhadas:', error);
    return 0;
  }
}

/**
 * Gerar relatório de horas trabalhadas por usuário
 * 
 * @param userId ID do usuário
 * @param startDate Data de início
 * @param endDate Data de fim
 * @returns Relatório de horas trabalhadas
 */
export async function generateTimeReport(
  userId: string,
  startDate: string,
  endDate: string
) {
  try {
    // Obter todas as entradas no período
    const { data: entries, error: entriesError } = await supabase
      .from('time_entries')
      .select(`
        *,
        sectors:sector_id (name, base_hourly_rate),
        roles:role_id (name, hourly_rate_multiplier)
      `)
      .eq('user_id', userId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: true });

    if (entriesError) {
      console.error('Erro ao obter entradas para relatório:', entriesError);
      return null;
    }

    // Calcular estatísticas
    const totalMinutes = entries.reduce((total, entry) => total + (entry.duration_minutes || 0), 0);
    const totalHours = totalMinutes / 60;
    
    // Agrupar por categoria
    const byCategory = entries.reduce((acc, entry) => {
      const category = entry.category;
      if (!acc[category]) {
        acc[category] = {
          totalMinutes: 0,
          entries: []
        };
      }
      
      acc[category].totalMinutes += (entry.duration_minutes || 0);
      acc[category].entries.push(entry);
      
      return acc;
    }, {} as Record<string, { totalMinutes: number, entries: any[] }>);

    // Calcular valor total
    const totalValue = entries.reduce((total, entry) => {
      if (!entry.sectors || !entry.roles) return total;
      
      const hourlyRate = entry.sectors.base_hourly_rate * entry.roles.hourly_rate_multiplier;
      const entryHours = (entry.duration_minutes || 0) / 60;
      return total + (hourlyRate * entryHours);
    }, 0);

    return {
      userId,
      period: {
        start: startDate,
        end: endDate
      },
      summary: {
        totalMinutes,
        totalHours,
        totalValue
      },
      byCategory,
      entries
    };
  } catch (error) {
    console.error('Erro inesperado ao gerar relatório:', error);
    return null;
  }
} 