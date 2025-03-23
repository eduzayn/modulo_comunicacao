import { NextRequest, NextResponse } from 'next/server';
import { isSystemInitialized } from '@/lib/initializers';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const status = {
      initialized: isSystemInitialized(),
      metrics: {
        totalEvents: 0,
        processingTime: 0,
        lastEvent: null
      },
      uptime: process.uptime(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
    };

    // Tentar obter métricas básicas se o sistema estiver inicializado
    if (status.initialized) {
      try {
        // Consulta segura com verificação prévia da existência da tabela
        const { data: tableExists } = await db.from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .eq('table_name', 'event_history')
          .maybeSingle();

        if (tableExists) {
          // Contar eventos totais
          const { count: totalEvents } = await db
            .from('event_history')
            .select('*', { count: 'exact', head: true });

          // Obter tempo médio de processamento
          const { data: avgTime } = await db
            .from('event_history')
            .select('processing_time')
            .limit(100)
            .maybeSingle();

          // Obter último evento
          const { data: lastEvent } = await db
            .from('event_history')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          // Atualizar métricas se dados foram encontrados
          if (totalEvents !== null) status.metrics.totalEvents = totalEvents;
          if (avgTime !== null) status.metrics.processingTime = avgTime.processing_time || 0;
          if (lastEvent !== null) status.metrics.lastEvent = lastEvent;
        }
      } catch (dbError) {
        console.error('Erro ao obter métricas do banco de dados:', dbError);
        // Continuar com valores padrão se ocorrer erro
      }
    }

    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    console.error('Erro na rota de status do sistema:', error);
    return NextResponse.json(
      { error: 'Erro ao obter status do sistema', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 