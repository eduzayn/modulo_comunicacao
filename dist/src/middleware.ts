/**
 * middleware.ts
 * 
 * Middleware global para gerenciar autenticação, redirecionamentos e proteção de rotas.
 * Executa antes de cada requisição para verificar se o usuário tem permissão
 * para acessar a rota solicitada.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas públicas que não precisam de autenticação
const PUBLIC_ROUTES = [
  '/login',
  '/registro',
  '/recuperar-senha',
  '/termos',
  '/politica-privacidade',
  '/api/auth',
]

// Adicionar prefixos ou exatos para considerar como públicos (ex: arquivos estáticos)
const PUBLIC_PATH_PREFIXES = [
  '/_next',
  '/favicon',
  '/images',
  '/fonts',
  '/api/public',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se é uma rota pública
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Verificar autenticação através do cookie
  const authToken = request.cookies.get('auth-token')?.value

  // Se não estiver autenticado, redireciona para o login
  if (!authToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Normalizar rotas de comunicação
  if (pathname.startsWith('/communication') && !pathname.includes('/(communication)')) {
    const newUrl = new URL(pathname.replace('/communication', '/(communication)'), request.url)
    return NextResponse.redirect(newUrl)
  }
  
  // Se chegou aqui, está autenticado e pode acessar a rota
  return NextResponse.next()
}

// Verifica se é uma rota pública baseado nas listas definidas
function isPublicRoute(pathname: string): boolean {
  // Verificar rotas exatas
  if (PUBLIC_ROUTES.includes(pathname)) {
    return true
  }

  // Verificar prefixos públicos
  return PUBLIC_PATH_PREFIXES.some(prefix => pathname.startsWith(prefix))
}

// Configurar quais rotas o middleware deve executar
export const config = {
  matcher: [
    /*
     * Adicionar todas as rotas em que o middleware deve executar.
     * Não fazemos match de _next e arquivos estáticos automaticamente
     * para evitar execução desnecessária do middleware.
     */
    '/((?!_next|favicon.ico|images|fonts|api/public).*)',
  ],
}
