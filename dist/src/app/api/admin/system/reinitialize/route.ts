import { NextRequest, NextResponse } from 'next/server';
import { forceReinitialization, isSystemInitialized } from '@/lib/initializers';
import { logger } from '@/lib/logger';
import { events } from '@/lib/events';

export async function POST(request: NextRequest) {
  try {
    logger.info('Solicitação de reinicialização do sistema recebida via API');
    
    // Verificar se o sistema já está inicializado
    const wasInitialized = isSystemInitialized();
    
    // Forçar a reinicialização do sistema
    const initialized = forceReinitialization();
    
    // Emitir evento de reinicialização
    await events.emit('system.maintenance', {
      action: 'system_reinitialized',
      success: initialized,
      previousState: wasInitialized ? 'initialized' : 'not_initialized'
    }, 'api');
    
    // Se falhar na inicialização
    if (!initialized) {
      logger.error('Falha ao reinicializar o sistema via API');
      return NextResponse.json(
        { error: 'Falha ao reinicializar o sistema' }, 
        { status: 500 }
      );
    }
    
    logger.info('Sistema reinicializado com sucesso via API');
    
    // Retornar sucesso
    return NextResponse.json({
      success: true,
      message: 'Sistema reinicializado com sucesso',
      initialized
    });
  } catch (error) {
    logger.error('Erro ao reinicializar o sistema', { error });
    return NextResponse.json(
      { error: 'Erro ao reinicializar o sistema' }, 
      { status: 500 }
    );
  }
} 