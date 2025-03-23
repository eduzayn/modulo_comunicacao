'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard,
  Activity,
  Clock,
  Users,
  Star
} from 'lucide-react'

const sidebarNavItems = [
  {
    title: 'Dashboard',
    href: '/reports/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Visão geral',
    href: '/reports/overview',
    icon: Activity
  },
  {
    title: 'Produtividade',
    href: '/reports/productivity',
    icon: Clock
  },
  {
    title: 'Atribuição',
    href: '/reports/attribution',
    icon: Users
  },
  {
    title: 'Avaliação',
    href: '/reports/evaluation',
    icon: Star
  }
]

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {sidebarNavItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname.startsWith(item.href)
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              isActive ? "bg-accent text-accent-foreground" : "transparent"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
} 