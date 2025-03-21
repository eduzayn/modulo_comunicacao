import { NextRequest, NextResponse } from 'next/server';
import { initializeSystem } from '@/lib/initializers';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    logger.info('Solicitação para inicialização do sistema recebida');
    
    const result = await initializeSystem();
    
    if (result) {
      return NextResponse.json({ 
        success: true, 
        message: 'Sistema inicializado com sucesso',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Falha ao inicializar o sistema' 
      }, { status: 500 });
    }
  } catch (error) {
    logger.error('Erro durante inicialização do sistema', { error });
    
    return NextResponse.json({ 
      success: false, 
      message: 'Erro durante inicialização do sistema',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 