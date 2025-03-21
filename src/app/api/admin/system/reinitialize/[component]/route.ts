import { NextRequest, NextResponse } from 'next/server';
import { initializeEventsSystem } from '@/lib/initializers/events-initializer';
import { initializeMetricsSystem } from '@/lib/initializers/metrics-initializer';
import { initializeChannelMetricsSystem } from '@/lib/initializers/channel-metrics-initializer';
import { initializeMiddlewareSystem } from '@/lib/initializers/middleware-initializer';
import { initializeChannelsSystem } from '@/lib/initializers/channels-initializer';
import { initializeMonitoringSystem } from '@/lib/initializers/monitoring-initializer';
import { logger } from '@/lib/logger';
import { events } from '@/lib/events';

// Mapeamento de componentes e suas funções de inicialização
const componentInitializers: Record<string, () => boolean | Promise<boolean>> = {
  events: initializeEventsSystem,
  metrics: initializeMetricsSystem,
  channels: initializeChannelsSystem,
  middleware: initializeMiddlewareSystem,
  monitoring: initializeMonitoringSystem,
  channel_metrics: initializeChannelMetricsSystem
};

export async function POST(
  request: NextRequest,
  { params }: { params: { component: string } }
) {
  try {
    const component = params.component;
    
    logger.info(`Solicitação de reinicialização do componente "${component}" recebida via API`);
    
    // Verificar se o componente existe
    if (!componentInitializers[component]) {
      logger.warn(`Tentativa de reinicializar componente desconhecido: ${component}`);
      return NextResponse.json(
        { 
          success: false, 
          error: `Componente desconhecido: ${component}` 
        }, 
        { status: 400 }
      );
    }
    
    // Inicializar o componente
    const initializer = componentInitializers[component];
    const result = await Promise.resolve(initializer());
    
    // Emitir evento de reinicialização do componente
    await events.emit('system.maintenance', {
      action: 'component_reinitialized',
      component,
      success: result
    }, 'api');
    
    if (!result) {
      logger.error(`Falha ao reinicializar o componente ${component}`);
      return NextResponse.json(
        { 
          success: false, 
          error: `Falha ao reinicializar o componente ${component}` 
        }, 
        { status: 500 }
      );
    }
    
    logger.info(`Componente ${component} reinicializado com sucesso`);
    
    return NextResponse.json({
      success: true,
      message: `Componente ${component} reinicializado com sucesso`,
      component
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Erro ao reinicializar componente: ${errorMessage}`, { error });
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Erro ao reinicializar componente: ${errorMessage}` 
      }, 
      { status: 500 }
    );
  }
} 