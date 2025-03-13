'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

export function MainLayout({ 
  children, 
  module = 'communication' 
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();
  const pathname = usePathname();
  
  // Don't show sidebar on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Header onMenuToggle={toggleSidebar} />
        <div className="flex flex-1">
          <div
            className={cn(
              'fixed inset-y-0 z-30 flex w-64 flex-col transition-transform duration-300 ease-in-out md:translate-x-0',
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <Sidebar module={module} />
          </div>
          <div
            className={cn(
              'flex-1 transition-all duration-300 ease-in-out',
              sidebarOpen ? 'md:ml-64' : 'ml-0'
            )}
          >
            <main className="container py-6 md:py-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default MainLayout;
