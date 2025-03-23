import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

type SupabaseTable = {
  table_name: string;
  table_schema: string;
}

export async function GET(request: NextRequest) {
  // Criar cliente Supabase com autenticação
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Verificar se o usuário está autenticado
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login para acessar este recurso.' },
        { status: 401 }
      );
    }

    // Verificar se o usuário tem permissão de admin (implemente sua lógica de verificação aqui)
    // Por exemplo, verificando o e-mail do usuário ou um papel específico
    const isAdmin = session?.user?.email?.includes('@admin');
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Permissão negada. Apenas administradores podem acessar este recurso.' },
        { status: 403 }
      );
    }

    // Executar consulta SQL para listar as tabelas
    const { data, error } = await supabase.rpc('execute_sql', {
      query_text: `
        SELECT table_name, table_schema 
        FROM information_schema.tables 
        WHERE table_schema IN ('public', 'storage')
        ORDER BY table_schema, table_name
      `
    });

    if (error) {
      console.error('Erro ao executar consulta SQL:', error);
      return NextResponse.json(
        { error: 'Erro ao executar consulta SQL' },
        { status: 500 }
      );
    }

    // Processar os resultados
    const tables = data as SupabaseTable[];

    // Retornar como JSON
    return NextResponse.json({ tables });
  } catch (error) {
    console.error('Erro ao listar tabelas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 