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

// Definição de rotas de comunicação agrupadas
export const communicationRoutes: MenuGroup[] = [
  {
    title: 'Mensagens',
    items: [
      {
        title: 'Caixa de Entrada',
        href: '/communication/messages/inbox',
        icon: <Mail />,
        description: 'Visualizar mensagens recebidas'
      },
      {
        title: 'Enviadas',
        href: '/communication/messages/sent',
        icon: <Send />,
        description: 'Visualizar mensagens enviadas'
      },
      {
        title: 'Rascunhos',
        href: '/communication/messages/drafts',
        icon: <FileText />,
        description: 'Gerenciar rascunhos de mensagens'
      },
      {
        title: 'Todas as mensagens',
        href: '/communication/messages',
        icon: <MessageSquare />,
        description: 'Visualizar todas as mensagens'
      }
    ]
  },
  {
    title: 'Conversas',
    items: [
      {
        title: 'Chat',
        href: '/communication/conversations/chat',
        icon: <MessageCircle />,
        description: 'Chat em tempo real'
      },
      {
        title: 'Chamadas',
        href: '/communication/conversations/calls',
        icon: <Phone />,
        description: 'Registro de chamadas',
        disabled: true
      },
      {
        title: 'Transmissões',
        href: '/communication/conversations/broadcasts',
        icon: <Radio />,
        description: 'Envio de transmissões em massa',
        badge: 'Novo',
        badgeColor: 'success'
      }
    ]
  },
  {
    title: 'Contatos',
    items: [
      {
        title: 'Todos os contatos',
        href: '/communication/contacts',
        icon: <Users />,
        description: 'Gerenciar todos os contatos'
      },
      {
        title: 'Grupos',
        href: '/communication/contacts/groups',
        icon: <Users />,
        description: 'Gerenciar grupos de contatos'
      },
      {
        title: 'Importar/Exportar',
        href: '/communication/contacts/import-export',
        icon: <FileCode />,
        description: 'Importar ou exportar contatos',
        permissions: ['contacts.import', 'contacts.export']
      }
    ]
  },
  {
    title: 'Recursos Avançados',
    items: [
      {
        title: 'Modelos',
        href: '/communication/templates',
        icon: <BookOpen />,
        description: 'Gerenciar modelos de mensagens'
      },
      {
        title: 'Assistente IA',
        href: '/communication/ai',
        icon: <Bot />,
        description: 'Assistente de comunicação com IA',
        badge: 'Beta',
        badgeColor: 'warning'
      },
      {
        title: 'Agendamento',
        href: '/communication/calendar',
        icon: <Calendar />,
        description: 'Agendar envio de mensagens'
      },
      {
        title: 'Histórico de Tempo',
        href: '/communication/time-tracking',
        icon: <Clock />,
        description: 'Visualizar histórico de tempo'
      }
    ]
  }
];

// Configurações e estatísticas
export const settingsAndStats: MenuGroup[] = [
  {
    title: 'Gerenciamento',
    items: [
      {
        title: 'Estatísticas',
        href: '/communication/stats',
        icon: <BarChart />,
        description: 'Visualizar estatísticas de comunicação',
        permissions: ['stats.view']
      },
      {
        title: 'Configurações',
        href: '/communication/settings',
        icon: <Settings />,
        description: 'Configurar módulo de comunicação',
        permissions: ['settings.edit']
      },
      {
        title: 'Permissões',
        href: '/communication/settings/permissions',
        icon: <Shield />,
        description: 'Gerenciar permissões de acesso',
        permissions: ['admin.permissions'],
        badge: 'Admin',
        badgeColor: 'error'
      }
    ]
  }
];

// Exportar todas as rotas para uso em diferentes componentes
export const allCommunicationRoutes = [
  ...communicationRoutes,
  ...settingsAndStats
];

export default function RoutesPage() {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const routes: Route[] = [
    { label: 'Mensagens', href: '/communication/messages', available: true },
    { label: 'Contatos', href: '/communication/contacts', available: true },
    { label: 'Estatísticas', href: '/communication/stats', available: true },
    { label: 'Configurações', href: '/communication/settings', available: true },
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