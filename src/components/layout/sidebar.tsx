'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MessageSquare, 
  Users, 
  Settings, 
  HelpCircle,
  Home,
  BarChart2
} from 'lucide-react';

const navItems = [
  {
    name: 'Início',
    href: '/',
    icon: Home
  },
  {
    name: 'Chat',
    href: '/chat-test',
    icon: MessageSquare
  },
  {
    name: 'Contatos',
    href: '/contacts',
    icon: Users
  },
  {
    name: 'Estatísticas',
    href: '/stats',
    icon: BarChart2
  },
  {
    name: 'Configurações',
    href: '/settings',
    icon: Settings
  },
  {
    name: 'Ajuda',
    href: '/help',
    icon: HelpCircle
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">Eduzayn</h1>
        <p className="text-sm text-gray-500">Módulo de Comunicação</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
            U
          </div>
          <div>
            <p className="text-sm font-medium">Usuário</p>
            <p className="text-xs text-gray-500">usuario@eduzayn.com.br</p>
          </div>
        </div>
      </div>
    </div>
  );
}
