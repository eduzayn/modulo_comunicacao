/**
 * routes.tsx - Configuração de rotas para a área administrativa
 * 
 * Define as rotas e subrotas disponíveis na área administrativa,
 * com agrupamento por funcionalidade e controle de permissões.
 */

import {
  Users,
  Settings,
  FileText,
  Shield,
  BarChart,
  Clock,
  Database,
  Bell,
  Bookmark,
  UserCog,
  Mail,
  LogIn,
  Activity,
  HardDrive,
  Network,
  Grid,
  Code,
  ServerCrash,
  Calendar
} from 'lucide-react';
import { NavGroup } from '@/components/layout/NavMenu';

// Definição de rotas administrativas agrupadas
export const adminRoutes: NavGroup[] = [
  {
    title: 'Usuários',
    items: [
      {
        title: 'Todos os Usuários',
        href: '/admin/users',
        icon: <Users />,
        description: 'Gerenciar usuários do sistema',
        permissions: ['users.view']
      },
      {
        title: 'Funções e Permissões',
        href: '/admin/users/roles',
        icon: <Shield />,
        description: 'Gerenciar funções e permissões',
        permissions: ['roles.manage']
      },
      {
        title: 'Atividade dos Usuários',
        href: '/admin/users/activity',
        icon: <Activity />,
        description: 'Monitorar atividade dos usuários',
        permissions: ['activity.view']
      },
      {
        title: 'Logs de Acesso',
        href: '/admin/users/logs',
        icon: <LogIn />,
        description: 'Visualizar logs de acesso',
        permissions: ['logs.view']
      }
    ]
  },
  {
    title: 'Sistema',
    items: [
      {
        title: 'Status do Sistema',
        href: '/admin/system/status',
        icon: <Activity />,
        description: 'Verificar status dos serviços',
        permissions: ['system.view']
      },
      {
        title: 'Banco de Dados',
        href: '/admin/system/database',
        icon: <Database />,
        description: 'Gerenciar banco de dados',
        permissions: ['database.manage'],
        badge: 'Técnico',
        badgeColor: 'warning'
      },
      {
        title: 'Armazenamento',
        href: '/admin/system/storage',
        icon: <HardDrive />,
        description: 'Gerenciar armazenamento',
        permissions: ['storage.manage']
      },
      {
        title: 'Integrações',
        href: '/admin/system/integrations',
        icon: <Network />,
        description: 'Configurar integrações externas',
        permissions: ['integrations.manage']
      }
    ]
  },
  {
    title: 'Conteúdo',
    items: [
      {
        title: 'Notificações',
        href: '/admin/content/notifications',
        icon: <Bell />,
        description: 'Gerenciar notificações do sistema',
        permissions: ['notifications.manage']
      },
      {
        title: 'Templates',
        href: '/admin/content/templates',
        icon: <FileText />,
        description: 'Gerenciar templates de conteúdo',
        permissions: ['templates.manage']
      },
      {
        title: 'Página Inicial',
        href: '/admin/content/homepage',
        icon: <Grid />,
        description: 'Configurar página inicial',
        permissions: ['content.homepage.edit']
      }
    ]
  },
  {
    title: 'Relatórios',
    items: [
      {
        title: 'Dashboard',
        href: '/admin/reports/dashboard',
        icon: <BarChart />,
        description: 'Visualizar dashboard administrativo',
        permissions: ['reports.view']
      },
      {
        title: 'Relatórios de Uso',
        href: '/admin/reports/usage',
        icon: <Activity />,
        description: 'Relatórios de uso do sistema',
        permissions: ['reports.usage.view']
      },
      {
        title: 'Horas Trabalhadas',
        href: '/admin/reports/time-tracking',
        icon: <Clock />,
        description: 'Relatórios de horas trabalhadas',
        permissions: ['reports.time.view']
      }
    ]
  }
];

// Configurações do sistema
export const settingsRoutes: NavGroup[] = [
  {
    title: 'Configurações',
    items: [
      {
        title: 'Geral',
        href: '/admin/settings/general',
        icon: <Settings />,
        description: 'Configurações gerais do sistema',
        permissions: ['settings.general.edit']
      },
      {
        title: 'Segurança',
        href: '/admin/settings/security',
        icon: <Shield />,
        description: 'Configurações de segurança',
        permissions: ['settings.security.edit']
      },
      {
        title: 'Email',
        href: '/admin/settings/email',
        icon: <Mail />,
        description: 'Configurações de email',
        permissions: ['settings.email.edit']
      },
      {
        title: 'API',
        href: '/admin/settings/api',
        icon: <Code />,
        description: 'Gerenciamento de API',
        permissions: ['settings.api.edit'],
        badge: 'Técnico',
        badgeColor: 'error'
      },
      {
        title: 'Logs do Sistema',
        href: '/admin/settings/logs',
        icon: <ServerCrash />,
        description: 'Visualizar logs do sistema',
        permissions: ['settings.logs.view']
      },
      {
        title: 'Agendamentos',
        href: '/admin/settings/schedules',
        icon: <Calendar />,
        description: 'Configurar tarefas agendadas',
        permissions: ['settings.schedules.edit']
      }
    ]
  }
]; 