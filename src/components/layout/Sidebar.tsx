'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  Settings,
  LayoutDashboard,
  Phone,
  FileText,
  Brain,
  Mail,
  Database,
  BarChart,
  HardDrive,
  Palette,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/',
      active: pathname === '/',
    },
    {
      label: 'Channels',
      icon: Phone,
      href: '/channels',
      active: pathname.startsWith('/channels'),
    },
    {
      label: 'Conversations',
      icon: MessageSquare,
      href: '/conversations',
      active: pathname.startsWith('/conversations'),
    },
    {
      label: 'Templates',
      icon: FileText,
      href: '/templates',
      active: pathname.startsWith('/templates'),
    },
    {
      label: 'AI Settings',
      icon: Brain,
      href: '/ai',
      active: pathname.startsWith('/ai'),
    },
    {
      label: 'Email',
      icon: Mail,
      href: '/email',
      active: pathname.startsWith('/email'),
    },
    {
      label: 'Metrics',
      icon: BarChart,
      href: '/metrics',
      active: pathname.startsWith('/metrics'),
    },
    {
      label: 'Backups',
      icon: HardDrive,
      href: '/backups',
      active: pathname.startsWith('/backups'),
    },
    {
      label: 'Design System',
      icon: Palette,
      href: '/design-system',
      active: pathname.startsWith('/design-system'),
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/settings',
      active: pathname.startsWith('/settings'),
    },
  ];

  return (
    <div className={cn('pb-12 w-64 bg-background border-r', className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="text-xl font-bold tracking-tight">
            Edunéxia Comunicação
          </h2>
          <p className="text-sm text-muted-foreground">
            Módulo de Comunicação
          </p>
        </div>
        <div className="px-4">
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'flex items-center py-2 px-3 text-sm font-medium rounded-md transition-colors',
                  route.active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
