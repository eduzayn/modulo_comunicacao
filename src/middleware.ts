import { NextRequest, NextResponse } from 'next/server';
import { authService } from './services/supabase/auth';

// Define protected routes that require authentication
const protectedRoutes = [
  '/api/communication',
  '/api/auth/profile',
  '/api/auth/api-keys',
  '/(communication)',
];

// Define public routes that don't require authentication
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
  '/auth/error',
  '/auth/dev-login',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/reset-password',
  '/api/auth/session',
];

// Define admin-only routes
const adminRoutes = [
  '/api/communication/metrics',
  '/api/communication/backups',
  '/(communication)/metrics',
  '/(communication)/backups',
];

// Define API routes that can be accessed with API keys
const apiKeyRoutes = [
  '/api/communication',
  '/api/integration',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip authentication for static assets and public routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public') ||
    publicRoutes.some(route => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }
  
  // Check for API key authentication for API routes
  if (apiKeyRoutes.some(route => pathname.startsWith(route))) {
    const apiKey = request.headers.get('x-api-key');
    
    if (apiKey) {
      // Validate API key
      const validation = await authService.validateApiKey(apiKey);
      
      if (validation.valid) {
        // Add user ID and role to request headers for downstream use
        const response = NextResponse.next();
        response.headers.set('x-user-id', validation.userId || '');
        response.headers.set('x-user-role', validation.role || 'user');
        return response;
      }
    }
    
    // Check for session cookie as fallback for API routes
    const sessionResult = await authService.getSession();
    
    if (sessionResult.success && sessionResult.session) {
      const response = NextResponse.next();
      response.headers.set('x-user-id', sessionResult.session.user.id);
      response.headers.set('x-user-role', sessionResult.session.user.role || 'user');
      return response;
    }
    
    // Return unauthorized for API routes
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // For non-API routes, redirect to login if not authenticated
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const sessionResult = await authService.getSession();
    
    if (!sessionResult.success || !sessionResult.session) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    
    // For admin routes, check role
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      const userRole = sessionResult.session.user.role;
      
      if (userRole !== 'admin') {
        // Redirect non-admins to dashboard
        return NextResponse.redirect(new URL('/(communication)', request.url));
      }
    }
    
    // User is authenticated, continue
    const response = NextResponse.next();
    response.headers.set('x-user-id', sessionResult.session.user.id);
    response.headers.set('x-user-role', sessionResult.session.user.role || 'user');
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
