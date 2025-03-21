/**
 * Cliente de banco de dados centralizado para acesso ao Supabase
 *
 * Este módulo oferece uma interface simplificada para acessar o banco de dados
 * Supabase, fornecendo métodos unificados para operações CRUD.
 */

import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

// Cliente de banco de dados simplificado
export const db = {
  /**
   * Seleciona registros de uma tabela
   */
  from: (table: string) => {
    return supabaseAdmin.from(table);
  },

  /**
   * Verifica se uma tabela existe no banco de dados
   */
  tableExists: async (tableName: string, schema = 'public') => {
    try {
      const { data, error } = await supabaseAdmin
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', schema)
        .eq('table_name', tableName)
        .maybeSingle();

      if (error) {
        logger.error(`Erro ao verificar se a tabela ${tableName} existe`, { error });
        return false;
      }

      return !!data;
    } catch (error) {
      logger.error(`Erro ao verificar se a tabela ${tableName} existe`, { error });
      return false;
    }
  },

  /**
   * Executa uma função RPC no Supabase
   */
  rpc: (functionName: string, params: Record<string, any> = {}) => {
    return supabaseAdmin.rpc(functionName, params);
  },

  /**
   * Executa uma consulta SQL bruta
   */
  query: (sql: string, params: any[] = []) => {
    return supabaseAdmin.rpc('execute_sql', { query: sql, params });
  }
}; 