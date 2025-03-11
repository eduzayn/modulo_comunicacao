import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Extracts the authenticated user ID from API requests
 * Checks for API key in headers first, then falls back to session token
 * 
 * @param request The Next.js request object
 * @returns User ID as string or null if not authenticated
 */
export async function getAuthUser(request: NextRequest): Promise<string | null> {
  // First check for user ID in headers (set by middleware)
  const userId = request.headers.get('x-user-id');
  
  if (userId) {
    return userId;
  }
  
  // If no user ID in headers, check for session token
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  if (token?.sub) {
    return token.sub as string;
  }
  
  return null;
}
