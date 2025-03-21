'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Network, 
  Users,
  FileText, 
  Home,
  Layers
} from 'lucide-react'

interface BaseLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: SidebarItem[] = [
  {
    name: 'Início',
    href: '/dashboard',
    icon: <Home className="h-5 w-5" />
  },
  {
    name: 'Comunicação',
    href: '/communication',
    icon: <MessageSquare className="h-5 w-5" />
  },
  {
    name: 'Estatísticas',
    href: '/communication/stats',
    icon: <BarChart3 className="h-5 w-5" />
  },
  {
    name: 'Configurações',
    href: '/communication/settings',
    icon: <Settings className="h-5 w-5" />
  },
  {
    name: 'Integrações',
    href: '/integrations',
    icon: <Network className="h-5 w-5" />
  },
  {
    name: 'Contatos',
    href: '/contacts',
    icon: <Users className="h-5 w-5" />
  },
  {
    name: 'Conteúdo',
    href: '/content',
    icon: <FileText className="h-5 w-5" />
  },
  {
    name: 'Matrículas',
    href: '/enrollment',
    icon: <Layers className="h-5 w-5" />
  },
]

function BaseLayout({ children, title, description }: BaseLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r hidden md:block">
        <div className="h-16 flex items-center px-4 border-b">
          <h1 className="text-lg font-semibold">Módulo de Comunicação</h1>
        </div>
        <ScrollArea className="h-[calc(100vh-64px)] py-2">
          <nav className="space-y-1 px-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        {(title || description) && (
          <header className="border-b p-4 bg-background">
            <div className="max-w-6xl mx-auto">
              {title && <h1 className="text-2xl font-bold">{title}</h1>}
              {description && <p className="text-muted-foreground mt-1">{description}</p>}
            </div>
          </header>
        )}
        
        {/* Page Content */}
        <div className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
} 

export { BaseLayout }
export default BaseLayout 