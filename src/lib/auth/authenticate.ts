/**
 * Authentication utility for API routes
 * 
 * This utility provides a standardized way to authenticate requests
 * across the communication module.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from './get-auth-user';
import { createErrorResponse } from '../api-response';

/**
 * Authenticates a request and returns the user ID if authenticated
 */
export async function authenticate(req: NextRequest) {
  const userId = await getAuthUser(req);
  
  if (!userId) {
    const { response, status } = createErrorResponse('Unauthorized', 401);
    return { authenticated: false, response: NextResponse.json(response, { status }) };
  }
  
  return { authenticated: true, userId };
}

/**
 * Middleware to require authentication for API routes
 */
export function withAuth(
  handler: (req: NextRequest, context: { params: Record<string, string | string[]> }, userId: string) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: { params: Record<string, string | string[]> }) => {
    const { authenticated, userId, response } = await authenticate(req);
    
    if (!authenticated) {
      return response;
    }
    
    return handler(req, context, userId as string);
  };
}

/**
 * Middleware to require admin role for API routes
 */
export function withAdminAuth(
  handler: (req: NextRequest, context: { params: Record<string, string | string[]> }, userId: string) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: { params: Record<string, string | string[]> }) => {
    const { authenticated, userId, response } = await authenticate(req);
    
    if (!authenticated) {
      return response;
    }
    
    // Check if user has admin role
    // This would typically involve checking the user's role in the database
    // For development, we'll assume the user is an admin if they're authenticated
    const isAdmin = process.env.NODE_ENV === 'development' || 
                    req.headers.get('x-user-role') === 'admin';
    
    if (!isAdmin) {
      const { response, status } = createErrorResponse('Forbidden: Admin access required', 403);
      return NextResponse.json(response, { status });
    }
    
    return handler(req, context, userId as string);
  };
}
