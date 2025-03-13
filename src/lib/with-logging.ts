/**
 * Higher-order functions for adding logging to components and API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

/**
 * Wrap an API route handler with logging
 */
export function withLogging(
  handler: (req: NextRequest, context: { params: Record<string, string> }) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: { params: Record<string, string> }) => {
    const requestId = req.headers.get('x-request-id') || crypto.randomUUID();
    const url = req.nextUrl.pathname;
    const method = req.method;
    
    // Create a child logger with request context
    const requestLogger = logger.child({
      requestId,
      url,
      method,
    });
    
    requestLogger.info(`API Request: ${method} ${url}`);
    
    const startTime = performance.now();
    
    try {
      const response = await handler(req, context);
      
      const endTime = performance.now();
      const durationMs = endTime - startTime;
      
      requestLogger.info(`API Response: ${method} ${url}`, {
        status: response.status,
        durationMs,
      });
      
      // Add request ID to response headers
      response.headers.set('x-request-id', requestId);
      
      return response;
    } catch (error) {
      const endTime = performance.now();
      const durationMs = endTime - startTime;
      
      requestLogger.error(`API Error: ${method} ${url}`, error as Error, {
        durationMs,
      });
      
      // Return a standardized error response
      return NextResponse.json(
        {
          success: false,
          error: (error as Error).message || 'Internal Server Error',
          timestamp: new Date().toISOString(),
        },
        { status: 500, headers: { 'x-request-id': requestId } }
      );
    }
  };
}

/**
 * Wrap a database operation with performance logging
 */
export function withDbLogging<T>(
  operation: () => Promise<T>,
  operationName: string,
  tableName: string
): Promise<T> {
  const startTime = performance.now();
  
  return operation()
    .then((result) => {
      const endTime = performance.now();
      const durationMs = endTime - startTime;
      
      logger.logDbOperation(operationName, tableName, durationMs);
      
      return result;
    })
    .catch((error) => {
      const endTime = performance.now();
      const durationMs = endTime - startTime;
      
      logger.error(`DB Error: ${operationName} ${tableName}`, error, {
        durationMs,
      });
      
      throw error;
    });
}

/**
 * Create a middleware for logging API requests
 */
export function createLoggingMiddleware() {
  return async (req: NextRequest) => {
    const requestId = req.headers.get('x-request-id') || crypto.randomUUID();
    const url = req.nextUrl.pathname;
    const method = req.method;
    
    logger.info(`API Request: ${method} ${url}`, {
      requestId,
      url,
      method,
      userAgent: req.headers.get('user-agent'),
    });
    
    // Continue to the next middleware or route handler
    return NextResponse.next({
      headers: {
        'x-request-id': requestId,
      },
    });
  };
}
