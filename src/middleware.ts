import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { authService } from '@/services/supabase/auth';

// Define protected routes that require authentication
const protectedRoutes = [
  '/api/communication',
  '/api/auth/profile',
  '/api/auth/api-keys',
  // '/(communication)', // Removido para permitir acesso às rotas principais
];

// Define public routes that don't require authentication
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
  '/auth/error',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/reset-password',
  '/api/auth/session',
  '/', // Adicionado rota raiz como pública
  '/chat-test', // Adicionado rota de teste de chat como pública
  '/contacts', // Adicionado rota de contatos como pública
  '/stats', // Adicionado rota de estatísticas como pública
  '/settings', // Adicionado rota de configurações como pública
  '/help', // Adicionado rota de ajuda como pública
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
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Check for API key authentication for API routes
  if (apiKeyRoutes.some(route => pathname.startsWith(route))) {
    const apiKey = request.headers.get('x-api-key');
    
    if (apiKey) {
      // Validate API key
      const validation = await authService.validateApiKey(apiKey);
      
      if (validation.valid) {
        // Add user ID to request headers for downstream use
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', validation.userId || '');
        
        // Allow the request to proceed
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      }
    }
  }
  
  // For protected routes, verify authentication
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    // If no token, redirect to login
    if (!token) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
    
    // For admin routes, check role
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      if (token.role !== 'admin') {
        // Redirect non-admins to dashboard
        return NextResponse.redirect(new URL('/(communication)', request.url));
      }
    }
  }
  
  // For API routes without valid authentication, return 401
  if (pathname.startsWith('/api/') && !publicRoutes.some(route => pathname.startsWith(route))) {
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
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
