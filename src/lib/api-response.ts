/**
 * API response utilities
 * 
 * This module provides utilities for creating standardized API responses.
 */

/**
 * HTTP status codes
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * Success response interface
 */
export interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

/**
 * Error response interface
 */
export interface ErrorResponse {
  success: false;
  error: string;
  timestamp: string;
}

/**
 * API response type
 */
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Create a success response
 */
export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create an error response with status code
 */
export function createErrorResponse(
  error: string | Error,
  status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR
): { response: ErrorResponse; status: HttpStatus } {
  const errorMessage = error instanceof Error ? error.message : error;
  
  return {
    response: {
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    },
    status,
  };
}

/**
 * Create a Next.js API response
 */
export function createApiResponse<T>(
  data: T,
  status: HttpStatus = HttpStatus.OK
): Response {
  return new Response(JSON.stringify(createSuccessResponse(data)), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Create a Next.js API error response
 */
export function createApiErrorResponse(
  error: string | Error,
  status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR
): Response {
  const { response } = createErrorResponse(error, status);
  
  return new Response(JSON.stringify(response), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
