import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Função utilitária para criar cliente Supabase para route handlers
function createRouteHandlerClient() {
  const cookieStore = cookies();
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    }
  );
}

export async function GET(req: NextRequest) {
  // Verificar autenticação e permissões
  const supabase = createRouteHandlerClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json(
      { error: 'Não autorizado. Faça login primeiro.' },
      { status: 401 }
    );
  }
  
  // Verificar se o usuário é administrador (você precisará ajustar isso de acordo com sua lógica de permissões)
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  if (!user || user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Você não tem permissão para acessar esta funcionalidade.' },
      { status: 403 }
    );
  }
  
  // Buscar todas as funções SQL do schema public
  try {
    const query = `
      SELECT 
        n.nspname AS schema,
        p.proname AS function_name,
        pg_catalog.pg_get_function_result(p.oid) AS return_type,
        pg_catalog.pg_get_function_arguments(p.oid) AS arguments,
        CASE
          WHEN p.prokind = 'a' THEN 'aggregate'
          WHEN p.prokind = 'w' THEN 'window'
          WHEN p.prokind = 'p' THEN 'procedure'
          WHEN p.prokind = 'f' THEN 'function'
        END AS function_type,
        pg_catalog.pg_get_functiondef(p.oid) AS definition
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'public'
      ORDER BY function_name;
    `;
    
    const { data: functions, error } = await supabase.rpc('execute_sql', { sql_query: query });
    
    if (error) throw error;
    
    return NextResponse.json({ functions });
  } catch (error) {
    console.error('Erro ao buscar funções SQL:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar funções SQL' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Verificar autenticação e permissões
  const supabase = createRouteHandlerClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json(
      { error: 'Não autorizado. Faça login primeiro.' },
      { status: 401 }
    );
  }
  
  // Verificar se o usuário é administrador
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  if (!user || user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Você não tem permissão para acessar esta funcionalidade.' },
      { status: 403 }
    );
  }
  
  try {
    // Obter a consulta SQL do corpo da requisição
    const body = await req.json();
    const { query } = body;
    
    if (!query) {
      return NextResponse.json(
        { error: 'Consulta SQL é obrigatória' },
        { status: 400 }
      );
    }
    
    // Executar a consulta SQL usando RPC
    const { data: results, error } = await supabase.rpc('execute_sql', { sql_query: query });
    
    if (error) throw error;
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Erro ao executar consulta SQL:', error);
    return NextResponse.json(
      { error: 'Erro ao executar consulta SQL' },
      { status: 500 }
    );
  }
} 