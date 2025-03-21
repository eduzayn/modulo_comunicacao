/**
 * routes.tsx - Configuração de rotas para a área de comunicação
 * 
 * Define as rotas e subrotas disponíveis na área de comunicação,
 * com agrupamento por funcionalidade e controle de permissões.
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card } from '@/components/ui/card-wrapper';
import {
  MessageSquare,
  Users,
  BarChart,
  Settings,
  Send,
  Mail,
  FileText,
  Phone,
  Calendar,
  Clock,
  Radio,
  MessageCircle,
  FileCode,
  Bot,
  BookOpen,
  Shield
} from 'lucide-react';

// Tipos existentes
type Route = {
  label: string;
  href: string;
  available: boolean;
};

// Interface para items de menu
export interface MenuItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  external?: boolean;
  description?: string;
  permissions?: string[];
  badge?: string;
  badgeColor?: 'default' | 'success' | 'warning' | 'error' | 'info';
  items?: MenuItem[];
}

// Interface para grupo de menu
export interface MenuGroup {
  title: string;
  items: MenuItem[];
}

// Itens do menu principal do módulo de comunicação
export const communicationMenuItems: MenuGroup[] = [
  {
    title: 'Mensagens',
    items: [
      {
        title: 'Caixa de entrada',
        href: '/comunicacao/mensagens/inbox',
        icon: <Mail />,
        description: 'Visualizar mensagens recebidas',
        permissions: ['messages.view']
      },
      {
        title: 'Enviadas',
        href: '/comunicacao/mensagens/sent',
        icon: <Send />,
        description: 'Visualizar mensagens enviadas',
        permissions: ['messages.view']
      },
      {
        title: 'Rascunhos',
        href: '/comunicacao/mensagens/drafts',
        icon: <FileText />,
        description: 'Gerenciar rascunhos de mensagens',
        permissions: ['messages.view']
      },
      {
        title: 'Todas as Mensagens',
        href: '/comunicacao/mensagens',
        icon: <MessageSquare />,
        description: 'Ver todas as mensagens',
        permissions: ['messages.view']
      }
    ]
  },
  {
    title: 'Conversas',
    items: [
      {
        title: 'Chat',
        href: '/comunicacao/conversas/chat',
        icon: <MessageCircle />,
        description: 'Interface de chat',
        permissions: ['conversations.view']
      },
      {
        title: 'Chamadas',
        href: '/comunicacao/conversas/calls',
        icon: <Phone />,
        description: 'Histórico de chamadas',
        permissions: ['calls.view'],
        disabled: true
      },
      {
        title: 'Broadcasts',
        href: '/comunicacao/conversas/broadcasts',
        icon: <Radio />,
        description: 'Gerenciar mensagens em massa',
        permissions: ['broadcasts.manage'],
        badge: 'Beta',
        badgeColor: 'warning'
      }
    ]
  },
  {
    title: 'Contatos',
    items: [
      {
        title: 'Todos os Contatos',
        href: '/comunicacao/contatos',
        icon: <Users />,
        description: 'Gerenciar contatos',
        permissions: ['contacts.view']
      },
      {
        title: 'Grupos',
        href: '/comunicacao/contatos/groups',
        icon: <Users />,
        description: 'Gerenciar grupos de contatos',
        permissions: ['contacts.groups.manage']
      },
      {
        title: 'Importar/Exportar',
        href: '/comunicacao/contatos/import-export',
        icon: <FileCode />,
        description: 'Importar ou exportar contatos',
        permissions: ['contacts.import_export'],
        badge: 'Pro',
        badgeColor: 'info'
      }
    ]
  },
  {
    title: 'Ferramentas',
    items: [
      {
        title: 'Templates',
        href: '/comunicacao/templates',
        icon: <FileText />,
        description: 'Gerenciar templates de mensagens',
        permissions: ['templates.manage']
      },
      {
        title: 'Inteligência Artificial',
        href: '/comunicacao/ai',
        icon: <Bot />,
        description: 'Configurações de IA e automação',
        permissions: ['ai.manage'],
        badge: 'Pro',
        badgeColor: 'success'
      }
    ]
  },
  {
    title: 'Agenda',
    items: [
      {
        title: 'Calendário',
        href: '/comunicacao/calendar',
        icon: <Calendar />,
        description: 'Visualizar agenda e compromissos',
        permissions: ['calendar.view']
      },
      {
        title: 'Controle de Tempo',
        href: '/comunicacao/time-tracking',
        icon: <Clock />,
        description: 'Controle de tempo das atividades',
        permissions: ['time_tracking.manage'],
        badge: 'Pro',
        badgeColor: 'info'
      }
    ]
  }
];

// Itens adicionais para o menu de configurações
export const communicationSettingsItems: MenuGroup[] = [
  {
    title: 'Configurações',
    items: [
      {
        title: 'Estatísticas',
        href: '/comunicacao/stats',
        icon: <BarChart />,
        description: 'Estatísticas e análises',
        permissions: ['stats.view']
      },
      {
        title: 'Configurações',
        href: '/comunicacao/settings',
        icon: <Settings />,
        description: 'Configurações gerais',
        permissions: ['settings.view']
      },
      {
        title: 'Permissões',
        href: '/comunicacao/settings/permissions',
        icon: <Shield />,
        description: 'Gerenciar permissões de acesso',
        permissions: ['permissions.manage'],
        badge: 'Admin',
        badgeColor: 'error'
      }
    ]
  }
];

// Principais rotas do módulo de comunicação
export const mainCommunicationRoutes: Route[] = [
  { label: 'Mensagens', href: '/comunicacao/mensagens', available: true },
  { label: 'Contatos', href: '/comunicacao/contatos', available: true },
  { label: 'Estatísticas', href: '/comunicacao/stats', available: true },
  { label: 'Configurações', href: '/comunicacao/settings', available: true },
];

// Exportar todas as rotas para uso em diferentes componentes
export const allCommunicationRoutes = [
  ...communicationMenuItems,
  ...communicationSettingsItems
];

export default function RoutesPage() {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const routes: Route[] = [
    { label: 'Mensagens', href: '/comunicacao/mensagens', available: true },
    { label: 'Contatos', href: '/comunicacao/contatos', available: true },
    { label: 'Estatísticas', href: '/comunicacao/stats', available: true },
    { label: 'Configurações', href: '/comunicacao/settings', available: true },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Rotas de Comunicação</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes.map((route) => (
          <Card key={route.href} className="p-4 relative">
            <Link 
              href={route.href}
              className="flex flex-col space-y-2"
            >
              <h2 className="text-xl font-semibold">{route.label}</h2>
              <p className="text-sm text-muted-foreground">
                Gerenciar {route.label.toLowerCase()}
              </p>
              {!route.available && (
                <span className="absolute top-2 right-2 bg-amber-200 text-amber-800 text-xs px-2 py-1 rounded">
                  Em breve
                </span>
              )}
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
} 