import { NextRequest, NextResponse } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/api/communication',
  '/api/auth/profile',
  '/api/auth/api-keys',
  // '/(communication)', // Removido para permitir acesso às rotas principais
];

// Define public routes that don't require authentication
const publicRoutes = [
  '/', // Rota raiz como pública
  '/chat-test', // Rota de teste de chat como pública
  '/contacts', // Rota de contatos como pública
  '/stats', // Rota de estatísticas como pública
  '/settings', // Rota de configurações como pública
  '/help', // Rota de ajuda como pública
];

// Define admin-only routes
const adminRoutes = [
  '/api/communication/metrics',
  '/api/communication/backups',
  '/(communication)/metrics',
  '/(communication)/backups',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // For protected routes, redirect to main site for authentication
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const mainSiteLoginUrl = new URL(process.env.MAIN_SITE_URL + '/login', request.url);
    mainSiteLoginUrl.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(mainSiteLoginUrl);
  }
  
  // For API routes without valid authentication, return 401
  if (pathname.startsWith('/api/') && !publicRoutes.some(route => pathname.startsWith(route))) {
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        error: 'Unauthorized', 
        message: 'Authentication is now handled by the main site'
      }),
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
