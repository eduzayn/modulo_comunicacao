'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Settings, Users, MessageCircle, Inbox, Briefcase, 
  BarChart2, Plug, Bot, LayoutDashboard, Database, Tag, 
  Clock, BookOpen, ListFilter, Workflow, CreditCard,
  Menu, X, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

// Lista de navegação para configurações
const navigationItems = [
  {
    title: 'Conta',
    href: '/settings/account',
    icon: Settings,
  },
  {
    title: 'Equipes',
    href: '/settings/groups',
    icon: Users,
  },
  {
    title: 'Canais',
    href: '/settings/channels',
    icon: MessageCircle,
  },
  {
    title: 'Caixa de Entrada',
    href: '/settings/inbox',
    icon: Inbox,
  },
  {
    title: 'CRM',
    href: '/settings/crm',
    icon: Briefcase,
  },
  {
    title: 'Relatórios',
    href: '/settings/reports',
    icon: BarChart2,
  },
  {
    title: 'Integrações',
    href: '/settings/integrations',
    icon: Plug,
  },
  {
    title: 'Bots',
    href: '/settings/bots',
    icon: Bot,
  },
  {
    title: 'Widget',
    href: '/settings/widget',
    icon: LayoutDashboard,
  },
  {
    title: 'Campos Personalizados',
    href: '/settings/custom-fields',
    icon: Database,
  },
  {
    title: 'Frases Rápidas',
    href: '/settings/quick-phrases',
    icon: MessageCircle,
  },
  {
    title: 'Tags',
    href: '/settings/tags',
    icon: Tag,
  },
  {
    title: 'Horários',
    href: '/settings/business-hours',
    icon: Clock,
  },
  {
    title: 'Base de Conhecimento',
    href: '/settings/knowledge-base',
    icon: BookOpen,
  },
  {
    title: 'Regras de Atribuição',
    href: '/settings/assignment-rules',
    icon: ListFilter,
  },
  {
    title: 'Automações',
    href: '/settings/automations',
    icon: Workflow,
  },
  {
    title: 'Faturamento',
    href: '/settings/billing',
    icon: CreditCard,
  },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Cabeçalho da página */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-14 items-center px-4">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu de navegação</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <nav className="grid gap-2 text-sm">
                  <Link href="/settings" className="flex items-center gap-2 font-semibold">
                    <Settings className="h-5 w-5" />
                    <span>Configurações</span>
                  </Link>
                  <ScrollArea className="h-[calc(100vh-8rem)] py-4">
                    {navigationItems.map((item) => (
                      <Link 
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent",
                          pathname === item.href && "bg-accent font-medium"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {pathname === item.href && (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </Link>
                    ))}
                  </ScrollArea>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href="/settings"
              className="flex items-center text-lg font-semibold"
            >
              <Settings className="mr-2 h-5 w-5" />
              <span>Configurações</span>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Layout principal */}
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        {/* Navegação lateral (apenas desktop) */}
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <ScrollArea className="py-6 pr-6 lg:py-8">
            <nav className="grid gap-2 text-sm">
              {navigationItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent",
                    pathname === item.href && "bg-accent font-medium"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                  {pathname === item.href && (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </Link>
              ))}
            </nav>
          </ScrollArea>
        </aside>
        
        {/* Conteúdo principal */}
        <main className="flex w-full flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
} 