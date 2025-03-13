import { NextRequest } from 'next/server';
import { recordMetric } from '../services/metrics';

/**
 * Middleware para registrar métricas de API
 */
export function withMetrics(handler: (request: NextRequest, ...args: unknown[]) => Promise<Response> | Response) {
  return async (request: NextRequest, ...args: unknown[]) => {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();
    
    try {
      // Executa o handler original
      const response = await handler(request, ...args);
      
      // Calcula o tempo de resposta
      const responseTime = Date.now() - startTime;
      
      // Registra a métrica
      await recordMetric({
        type: 'api_request',
        value: responseTime,
        tags: {
          path: request.nextUrl.pathname,
          method: request.method,
          status: response.status,
          requestId,
        },
      });
      
      return response;
    } catch (error) {
      // Registra erro
      await recordMetric({
        type: 'api_error',
        value: 1,
        tags: {
          path: request.nextUrl.pathname,
          method: request.method,
          error: error instanceof Error ? error.message : 'Unknown error',
          requestId,
        },
      });
      
      throw error;
    }
  };
}

export default withMetrics;
