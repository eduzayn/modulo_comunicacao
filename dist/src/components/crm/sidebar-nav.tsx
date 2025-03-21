'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Briefcase, 
  CheckSquare, 
  Users, 
  Megaphone,
  Target
} from 'lucide-react'

const sidebarNavItems = [
  {
    title: 'Negociações',
    href: '/crm/deals',
    icon: Briefcase
  },
  {
    title: 'Tarefas',
    href: '/crm/tasks',
    icon: CheckSquare
  },
  {
    title: 'Contatos',
    href: '/crm/contacts',
    icon: Users
  },
  {
    title: 'Campanhas',
    href: '/crm/campaigns',
    icon: Megaphone
  },
  {
    title: 'Metas',
    href: '/crm/goals',
    icon: Target
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