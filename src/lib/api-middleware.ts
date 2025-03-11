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
  handler: (req: NextRequest, context: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: any) => {
    try {
      return await handler(req, context);
    } catch (error: any) {
      console.error(`API Error: ${error.message}`, error);
      const { response, status } = createErrorResponse(
        error.message || 'An unexpected error occurred',
        error.status || 500
      );
      return NextResponse.json(response, { status });
    }
  };
}

/**
 * Wraps an API route handler with standardized response formatting
 */
export function withApiResponse<T>(
  handler: (req: NextRequest, context: any) => Promise<T>
) {
  return async (req: NextRequest, context: any) => {
    try {
      const result = await handler(req, context);
      const response = createSuccessResponse(result);
      return NextResponse.json(response);
    } catch (error: any) {
      console.error(`API Error: ${error.message}`, error);
      const { response, status } = createErrorResponse(
        error.message || 'An unexpected error occurred',
        error.status || 500
      );
      return NextResponse.json(response, { status });
    }
  };
}

/**
 * Combines multiple middleware functions
 */
export function composeMiddleware(...middlewares: any[]) {
  return (handler: any) => {
    return middlewares.reduceRight((composed, middleware) => {
      return middleware(composed);
    }, handler);
  };
}
