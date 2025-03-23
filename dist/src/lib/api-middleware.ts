/**
 * API middleware for consistent error handling
 * 
 * This middleware wraps API route handlers to provide consistent
 * error handling and response formatting.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, createSuccessResponse } from './api-response';
import { logger } from './logger';
import { createClient } from '@supabase/supabase-js';

// Definindo tipos para as respostas da API
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
};

// Erro personalizado para a API
export class ApiError extends Error {
  code: string;
  status: number;
  details?: any;

  constructor(message: string, code: string = 'ERROR_INTERNAL', status: number = 500, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// Erros comuns
export const apiErrors = {
  UNAUTHORIZED: new ApiError('Não autorizado', 'ERROR_UNAUTHORIZED', 401),
  FORBIDDEN: new ApiError('Acesso negado', 'ERROR_FORBIDDEN', 403),
  NOT_FOUND: new ApiError('Recurso não encontrado', 'ERROR_NOT_FOUND', 404),
  VALIDATION_ERROR: new ApiError('Erro de validação', 'ERROR_VALIDATION', 400),
  INTERNAL_ERROR: new ApiError('Erro interno do servidor', 'ERROR_INTERNAL', 500),
  SERVICE_UNAVAILABLE: new ApiError('Serviço indisponível', 'ERROR_SERVICE_UNAVAILABLE', 503),
  RATE_LIMIT_EXCEEDED: new ApiError('Limite de requisições excedido', 'ERROR_RATE_LIMIT', 429),
};

// Cliente Supabase para verificação de autenticação
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Middleware para verificar autenticação
 * @param req Objeto de requisição
 * @throws ApiError se o usuário não estiver autenticado
 */
export async function authMiddleware(req: Request): Promise<{userId: string, token: string}> {
  try {
    // Extrair o token de autenticação do cabeçalho
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw apiErrors.UNAUTHORIZED;
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar o token com o Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      logger.warn('Falha na autenticação', { error: error?.message });
      throw apiErrors.UNAUTHORIZED;
    }

    return { userId: user.id, token };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Erro no middleware de autenticação', { error });
    throw apiErrors.UNAUTHORIZED;
  }
}

/**
 * Middleware para log de requisições
 * @param req Objeto de requisição
 */
export function loggerMiddleware(req: Request) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  const method = req.method;
  const url = new URL(req.url);
  
  logger.info(`Requisição iniciada: ${method} ${url.pathname}`, {
    requestId,
    method,
    path: url.pathname,
    query: Object.fromEntries(url.searchParams),
  });
  
  return { requestId, startTime };
}

/**
 * Middleware para validação de dados de entrada
 * @param schema Schema de validação (ex: Zod)
 * @param data Dados a serem validados
 */
export function validateData<T>(schema: any, data: any): T {
  try {
    return schema.parse(data);
  } catch (error: any) {
    throw new ApiError(
      'Dados de entrada inválidos',
      'ERROR_VALIDATION',
      400,
      error.errors || error.message
    );
  }
}

/**
 * Função de manipulação de erros
 * @param error Erro capturado
 */
export function handleApiError(error: unknown, requestId?: string): NextResponse<ApiResponse> {
  let apiError: ApiError;

  if (error instanceof ApiError) {
    apiError = error;
  } else if (error instanceof Error) {
    logger.error(`Erro não tratado: ${error.message}`, {
      stack: error.stack,
      requestId
    });
    apiError = new ApiError(
      'Ocorreu um erro inesperado',
      'ERROR_INTERNAL',
      500
    );
  } else {
    logger.error('Erro desconhecido', { error, requestId });
    apiError = apiErrors.INTERNAL_ERROR;
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        message: apiError.message,
        code: apiError.code,
        details: apiError.details
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId
      }
    } as ApiResponse,
    { status: apiError.status }
  );
}

/**
 * Wraps an API route handler with standardized error handling
 */
export function withErrorHandling(
  handler: (req: NextRequest, context: Record<string, unknown>) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: Record<string, unknown>) => {
    const { requestId, startTime } = loggerMiddleware(req);
    try {
      const result = await handler(req, context);
      const duration = Date.now() - startTime;
      logger.info(`Requisição concluída: ${req.method} ${new URL(req.url).pathname}`, {
        requestId,
        duration
      });
      return result;
    } catch (error: unknown) {
      const duration = Date.now() - startTime;
      logger.error(`Requisição falhou: ${req.method} ${new URL(req.url).pathname}`, {
        requestId,
        duration,
        error
      });
      return handleApiError(error, requestId);
    }
  };
}

/**
 * Wraps an API route handler with standardized response formatting
 */
export function withApiResponse<T>(
  handler: (req: NextRequest, context: Record<string, unknown>) => Promise<T>
) {
  return async (req: NextRequest, context: Record<string, unknown>) => {
    try {
      const result = await handler(req, context);
      const response = createSuccessResponse(result);
      return NextResponse.json(response);
    } catch (error: unknown) {
      const err = error as Error & { status?: number };
      logger.error(`API Error: ${err.message}`, { error: err });
      const { response, status } = createErrorResponse(
        err.message || 'An unexpected error occurred',
        err.status || 500
      );
      return NextResponse.json(response, { status });
    }
  };
}

/**
 * Combines multiple middleware functions
 */
type ApiHandler = (req: NextRequest, context: Record<string, unknown>) => Promise<NextResponse>;
type Middleware = (handler: ApiHandler) => ApiHandler;

export function composeMiddleware(...middlewares: Middleware[]) {
  return (handler: ApiHandler) => {
    return middlewares.reduceRight((composed, middleware) => {
      return middleware(composed);
    }, handler);
  };
}

/**
 * Wrapper para handlers de API com suporte a middlewares
 * @param handler Função de manipulação da requisição
 * @param options Opções do wrapper
 */
export function apiHandler<T = any>(
  handler: (req: Request, context?: any) => Promise<T>,
  options: {
    requireAuth?: boolean,
    rateLimit?: {
      limit: number,
      window: number // em segundos
    }
  } = {}
) {
  return async function(req: Request, context?: any): Promise<NextResponse> {
    const { requestId, startTime } = loggerMiddleware(req);
    let userId: string | undefined;
    
    try {
      // Verificar autenticação se necessário
      if (options.requireAuth) {
        const authResult = await authMiddleware(req);
        userId = authResult.userId;
      }
      
      // Verificar rate limit se configurado
      if (options.rateLimit) {
        // Implementação do rate limit a ser adicionada aqui
      }
      
      // Executar o handler
      const result = await handler(req, { ...context, userId, requestId });
      
      // Log de sucesso
      const duration = Date.now() - startTime;
      logger.info(`Requisição concluída: ${req.method} ${new URL(req.url).pathname}`, {
        requestId,
        duration,
        userId
      });
      
      // Formatar resposta de sucesso
      return NextResponse.json({
        success: true,
        data: result,
        meta: {
          timestamp: new Date().toISOString(),
          requestId
        }
      } as ApiResponse);
      
    } catch (error) {
      // Log de erro
      const duration = Date.now() - startTime;
      logger.error(`Requisição falhou: ${req.method} ${new URL(req.url).pathname}`, {
        requestId,
        duration,
        userId,
        error
      });
      
      // Tratar e formatar erro
      return handleApiError(error, requestId);
    }
  }
}

/**
 * Função auxiliar para criar respostas de sucesso
 * @param data Dados a serem retornados
 */
export function apiSuccess<T = any>(data: T, requestId?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId
    }
  } as ApiResponse<T>);
}
