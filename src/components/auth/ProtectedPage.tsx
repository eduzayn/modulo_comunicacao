'use client'

/**
 * ProtectedPage.tsx
 * 
 * Componente de ordem superior (HOC) para proteger rotas baseado em permissões do usuário.
 * Redireciona para a página de login se o usuário não estiver autenticado ou
 * para uma página de acesso negado se o usuário não tiver as permissões necessárias.
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedPageProps {
  children: React.ReactNode
  permissions?: string[]
  roles?: string[]
  redirectTo?: string
  fallback?: React.ReactNode
}

export function ProtectedPage({
  children,
  permissions = [],
  roles = [],
  redirectTo = '/login',
  fallback
}: ProtectedPageProps) {
  const router = useRouter()
  const { isAuthenticated, checkPermission, checkRole, isLoading } = useAuthContext()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    if (isLoading) return

    // Se não estiver autenticado, redireciona para o login
    if (!isAuthenticated) {
      router.push(`${redirectTo}?redirectTo=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    // Verifica permissões e roles
    const hasPermission = permissions.length === 0 || 
      permissions.some(permission => checkPermission(permission))
    
    const hasRole = roles.length === 0 || 
      roles.some(role => checkRole(role))

    // Define se está autorizado apenas quando tiver as permissões necessárias
    setIsAuthorized(hasPermission && hasRole)
  }, [isAuthenticated, checkPermission, checkRole, permissions, roles, router, redirectTo, isLoading])

  // Enquanto estiver carregando ou verificando autorização, mostra o loader
  if (isLoading || isAuthorized === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Se não estiver autorizado, mostra o fallback ou redireciona para acesso negado
  if (!isAuthorized) {
    if (fallback) {
      return <>{fallback}</>
    }
    
    router.push('/acesso-negado')
    return null
  }

  // Se estiver autorizado, renderiza os filhos
  return <>{children}</>
} 