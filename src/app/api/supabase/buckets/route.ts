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
    // Consulta para listar todos os buckets
    const query = "SELECT * FROM storage.buckets";
    
    const { data: buckets, error } = await supabase.rpc('execute_sql', { sql_query: query });
    
    if (error) throw error;
    
    return NextResponse.json({ buckets });
  } catch (error) {
    console.error('Erro ao buscar buckets de armazenamento:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar buckets de armazenamento' },
      { status: 500 }
    );
  }
} 