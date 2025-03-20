'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Inbox, Users, BarChart2, Settings, Calendar } from 'lucide-react'

const mainNavItems = [
  {
    title: 'Caixa de Entrada',
    href: '/inbox',
    icon: Inbox,
    matchPattern: '/inbox'
  },
  {
    title: 'CRM',
    href: '/crm',
    icon: Users,
    matchPattern: '/crm'
  },
  {
    title: 'Relatórios',
    href: '/reports',
    icon: BarChart2,
    matchPattern: '/reports'
  },
  {
    title: 'Calendário',
    href: '/calendar',
    icon: Calendar,
    matchPattern: '/calendar'
  },
  {
    title: 'Configurações',
    href: '/settings',
    icon: Settings,
    matchPattern: '/settings'
  }
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {mainNavItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.matchPattern)
        const Icon = item.icon
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center h-9 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:text-primary",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-muted"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="w-4 h-4 mr-2" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
} 