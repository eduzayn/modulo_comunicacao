'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Inbox, Users, BarChart2, Settings } from 'lucide-react'

const mainNavItems = [
  {
    title: 'Caixa de Entrada',
    href: '/inbox',
    icon: Inbox
  },
  {
    title: 'CRM',
    href: '/crm',
    icon: Users
  },
  {
    title: 'Relatórios',
    href: '/reports',
    icon: BarChart2
  },
  {
    title: 'Configurações',
    href: '/settings',
    icon: Settings
  }
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {mainNavItems.map((item) => {
        const isActive = pathname === item.href
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
          >
            <Icon className="w-4 h-4 mr-2" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
} 