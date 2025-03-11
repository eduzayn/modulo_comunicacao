'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header onMenuToggle={toggleSidebar} />
      <div className="flex flex-1">
        <div
          className={cn(
            'fixed inset-y-0 z-30 flex w-64 flex-col transition-transform duration-300 ease-in-out md:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <Sidebar />
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
  );
}
