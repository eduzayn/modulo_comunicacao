import { NextRequest, NextResponse } from 'next/server';
import { forceReinitialization } from '@/lib/initializers';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    logger.info('Solicitação para forçar reinicialização do sistema recebida');
    
    const reinitializationSuccessful = await forceReinitialization();
    
    if (reinitializationSuccessful) {
      return NextResponse.json({
        success: true,
        message: 'Sistema reinicializado com sucesso',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Falha na reinicialização do sistema',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  } catch (error) {
    logger.error('Erro ao forçar reinicialização do sistema', { error });
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao forçar reinicialização do sistema',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
} 