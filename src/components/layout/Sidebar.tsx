'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  MessageSquare,
  Settings,
  LayoutDashboard,
  Phone,
  FileText,
  Brain,
  Mail,
  BarChart,
  HardDrive,
  Palette,
  Users
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

export function Sidebar({ className, module = 'communication' }: SidebarProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  // Module-specific configuration
  const moduleConfig = {
    communication: {
      name: 'Comunicação',
      routes: [
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
      ]
    },
    student: {
      name: 'Portal do Aluno',
      routes: [
        {
          label: 'Dashboard',
          icon: LayoutDashboard,
          href: '/aluno/dashboard',
          active: pathname === '/aluno/dashboard',
        },
        {
          label: 'Meus Cursos',
          icon: FileText,
          href: '/aluno/cursos',
          active: pathname.startsWith('/aluno/cursos'),
        },
        {
          label: 'Aulas',
          icon: FileText,
          href: '/aluno/aulas',
          active: pathname.startsWith('/aluno/aulas'),
        },
        {
          label: 'Notas',
          icon: BarChart,
          href: '/aluno/notas',
          active: pathname.startsWith('/aluno/notas'),
        },
        {
          label: 'Financeiro',
          icon: HardDrive,
          href: '/aluno/financeiro',
          active: pathname.startsWith('/aluno/financeiro'),
        },
        {
          label: 'Meu Perfil',
          icon: Users,
          href: '/aluno/perfil',
          active: pathname.startsWith('/aluno/perfil'),
        },
      ]
    },
    content: {
      name: 'Conteúdo',
      routes: [
        {
          label: 'Dashboard',
          icon: LayoutDashboard,
          href: '/conteudo/dashboard',
          active: pathname === '/conteudo/dashboard',
        },
        {
          label: 'Cursos',
          icon: FileText,
          href: '/conteudo/cursos',
          active: pathname.startsWith('/conteudo/cursos'),
        },
        {
          label: 'Aulas',
          icon: FileText,
          href: '/conteudo/aulas',
          active: pathname.startsWith('/conteudo/aulas'),
        },
        {
          label: 'Materiais',
          icon: FileText,
          href: '/conteudo/materiais',
          active: pathname.startsWith('/conteudo/materiais'),
        },
        {
          label: 'Avaliações',
          icon: BarChart,
          href: '/conteudo/avaliacoes',
          active: pathname.startsWith('/conteudo/avaliacoes'),
        },
        {
          label: 'Configurações',
          icon: Settings,
          href: '/conteudo/configuracoes',
          active: pathname.startsWith('/conteudo/configuracoes'),
        },
      ]
    },
    enrollment: {
      name: 'Matrículas',
      routes: [
        {
          label: 'Dashboard',
          icon: LayoutDashboard,
          href: '/matricula/dashboard',
          active: pathname === '/matricula/dashboard',
        },
        {
          label: 'Alunos',
          icon: Users,
          href: '/matricula/alunos',
          active: pathname.startsWith('/matricula/alunos'),
        },
        {
          label: 'Cursos',
          icon: FileText,
          href: '/matricula/cursos',
          active: pathname.startsWith('/matricula/cursos'),
        },
        {
          label: 'Pagamentos',
          icon: HardDrive,
          href: '/matricula/pagamentos',
          active: pathname.startsWith('/matricula/pagamentos'),
        },
        {
          label: 'Relatórios',
          icon: BarChart,
          href: '/matricula/relatorios',
          active: pathname.startsWith('/matricula/relatorios'),
        },
        {
          label: 'Configurações',
          icon: Settings,
          href: '/matricula/configuracoes',
          active: pathname.startsWith('/matricula/configuracoes'),
        },
      ]
    }
  };

  const config = moduleConfig[module];

  return (
    <div className={cn('pb-12 w-64 bg-background border-r', className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="text-xl font-bold tracking-tight">
            Edunéxia {config.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            Módulo de {config.name}
          </p>
        </div>
        <div className="px-4">
          <div className="space-y-1">
            {config.routes.map((route) => (
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
      
      {/* User Profile */}
      {user && (
        <div className="mt-auto p-4 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-semibold">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-900">{user.name || 'User'}</p>
                <p className="text-xs text-neutral-500">{user.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
