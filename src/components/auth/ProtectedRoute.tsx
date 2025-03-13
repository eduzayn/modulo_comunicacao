/**
 * ProtectedRoute.tsx
 * 
 * Description: This component provides route protection for authenticated users.
 * It redirects unauthenticated users to the login page and shows a loading state
 * while authentication is being checked.
 * 
 * @module auth
 * @author Devin AI
 * @created 2025-03-13
 */

'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ReactNode, useEffect } from 'react';

/**
 * Props for the ProtectedRoute component
 */
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'user';
}

/**
 * ProtectedRoute - A component that protects routes requiring authentication
 * 
 * This component checks if a user is authenticated and optionally if they have
 * the required role. If not, it redirects to the login page. While checking
 * authentication status, it displays a loading indicator.
 * 
 * @param props - Component props including children and optional requiredRole
 * @returns The protected content if authenticated, otherwise redirects to login
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      // User is not authenticated, redirect to login
      router.push('/login');
    } else if (!isLoading && requiredRole && user?.role !== requiredRole) {
      // User doesn't have the required role, redirect to unauthorized page
      router.push('/unauthorized');
    }
  }, [isLoading, user, router, requiredRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If we're not loading and have a user, render the protected content
  if (!isLoading && user) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
}
