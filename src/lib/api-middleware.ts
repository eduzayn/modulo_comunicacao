/**
 * API middleware for consistent error handling
 * 
 * This middleware wraps API route handlers to provide consistent
 * error handling and response formatting.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, createSuccessResponse } from './api-response';

/**
 * Wraps an API route handler with standardized error handling
 */
export function withErrorHandling(
  handler: (req: NextRequest, context: Record<string, unknown>) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: Record<string, unknown>) => {
    try {
      return await handler(req, context);
    } catch (error: unknown) {
      const err = error as Error & { status?: number };
      console.error(`API Error: ${err.message}`, err);
      const { response, status } = createErrorResponse(
        err.message || 'An unexpected error occurred',
        err.status || 500
      );
      return NextResponse.json(response, { status });
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
      console.error(`API Error: ${err.message}`, err);
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
