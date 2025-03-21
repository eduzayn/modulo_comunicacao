'use client';

/**
 * withAuth.tsx
 * 
 * Higher-Order Component para proteger rotas baseado em autenticação e permissões
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface WithAuthOptions {
  requiredPermissions?: string[];
  redirectTo?: string;
  loadingComponent?: React.ReactNode;
  unauthorizedComponent?: React.ReactNode;
}

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  {
    requiredPermissions = [],
    redirectTo = '/login',
    loadingComponent,
    unauthorizedComponent,
  }: WithAuthOptions = {}
) => {
  const WithAuthWrapper = (props: P) => {
    const { isAuthenticated, isLoading, hasPermission, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Se não estiver carregando e não estiver autenticado, redirecionar
      if (!isLoading && !isAuthenticated) {
        if (redirectTo.startsWith('/login')) {
          // Adicionar parâmetro de redirecionamento
          const currentPath = window.location.pathname;
          router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
        } else {
          router.push(redirectTo);
        }
      }
    }, [isLoading, isAuthenticated, router]);

    // Verificar permissões se necessário
    const hasRequiredPermissions = requiredPermissions.length === 0 || 
      requiredPermissions.every(permission => hasPermission(permission));

    // Mostrar spinner durante o carregamento
    if (isLoading) {
      return loadingComponent || (
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    // Se não estiver autenticado, não renderizar nada (o redirecionamento vai ocorrer)
    if (!isAuthenticated) {
      return null;
    }

    // Se não tiver as permissões necessárias, mostrar mensagem ou componente personalizado
    if (!hasRequiredPermissions) {
      return unauthorizedComponent || (
        <div className="container mx-auto py-12 px-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Acesso Restrito</AlertTitle>
            <AlertDescription>
              Você não tem permissão para acessar esta página. Entre em contato com o administrador.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    // Se tudo estiver ok, renderizar o componente protegido
    return <Component {...props} />;
  };

  // Atualizar displayName para facilitar depuração
  const componentName = Component.displayName || Component.name || 'Component';
  WithAuthWrapper.displayName = `withAuth(${componentName})`;

  return WithAuthWrapper;
};

// Componente para proteger páginas
export function ProtectedPage({
  children,
  requiredPermissions = [],
  fallback,
}: {
  children: React.ReactNode;
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || null;
  }

  const hasRequiredPermissions = requiredPermissions.length === 0 || 
    requiredPermissions.every(permission => hasPermission(permission));

  if (!hasRequiredPermissions) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Acesso Restrito</AlertTitle>
        <AlertDescription>
          Você não tem permissão para acessar este conteúdo.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}

// Componente para mostrar conteúdo apenas para usuários com permissões específicas
export function PermissionGate({
  children,
  permissions,
  fallback,
}: {
  children: React.ReactNode;
  permissions: string | string[];
  fallback?: React.ReactNode;
}) {
  const { hasPermission } = useAuth();
  
  const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
  const userHasPermission = requiredPermissions.some(p => hasPermission(p));
  
  if (!userHasPermission) {
    return fallback || null;
  }
  
  return <>{children}</>;
} 