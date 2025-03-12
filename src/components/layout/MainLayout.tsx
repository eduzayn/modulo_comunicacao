'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

export const MainLayout = ({ 
  children, 
  module = 'enrollment' 
}: MainLayoutProps) => {
  const { user } = useAuth();
  const pathname = usePathname();
  
  // Don't show sidebar on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }
  
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar module={module} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 md:ml-16 lg:ml-64 transition-all duration-300">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default MainLayout;
