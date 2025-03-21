/**
 * supabase.ts
 * 
 * Configuração do cliente Supabase para uso em toda a aplicação.
 * Exporta o cliente configurado e tipos de banco de dados.
 */

import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Obter variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl) {
  throw new Error('Variável de ambiente NEXT_PUBLIC_SUPABASE_URL não definida')
}

if (!supabaseAnonKey) {
  throw new Error('Variável de ambiente NEXT_PUBLIC_SUPABASE_ANON_KEY não definida')
}

// Criar cliente Supabase tipado
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Cliente para uso no lado do servidor (server components)
export const createServerSupabaseClient = () => {
  return createClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: false
      }
    }
  )
}

// Hooks relacionados ao Supabase serão implementados em arquivos separados
// para manter a organização do código
