'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Inbox, 
  Users, 
  BarChart, 
  Settings, 
  Calendar,
  MessageSquare,
  Home
} from 'lucide-react'

interface SidebarNavItem {
  title: string
  href: string
  icon?: React.ReactNode
}

interface SidebarNavProps {
  items: SidebarNavItem[]
  className?: string
}

export function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("w-64 flex-shrink-0 border-r bg-background h-screen", className)}>
      <div className="flex h-full flex-col p-4">
        <div className="mb-6 px-2">
          <h2 className="text-xl font-bold">Comunicação</h2>
        </div>
        
        <div className="space-y-6 flex-1">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
              Principal
            </h3>
            <SidebarNav
              items={[
                {
                  title: "Dashboard",
                  href: "/dashboard",
                  icon: <Home size={18} />
                },
                {
                  title: "Inbox",
                  href: "/inbox",
                  icon: <Inbox size={18} />
                },
                {
                  title: "CRM",
                  href: "/crm",
                  icon: <Users size={18} />
                },
                {
                  title: "Calendário",
                  href: "/calendar",
                  icon: <Calendar size={18} />
                },
              ]}
            />
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
              Análise
            </h3>
            <SidebarNav
              items={[
                {
                  title: "Relatórios",
                  href: "/reports",
                  icon: <BarChart size={18} />
                },
                {
                  title: "Conversas",
                  href: "/conversations",
                  icon: <MessageSquare size={18} />
                },
              ]}
            />
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
              Sistema
            </h3>
            <SidebarNav
              items={[
                {
                  title: "Configurações",
                  href: "/settings",
                  icon: <Settings size={18} />
                },
              ]}
            />
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t">
          <div className="flex items-center px-2 py-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2">
              U
            </div>
            <div>
              <p className="text-sm font-medium">Usuário</p>
              <p className="text-xs text-muted-foreground">admin@exemplo.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SidebarNav({ items, className }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
            pathname === item.href || pathname.startsWith(item.href + "/")
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          )}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.title}
        </Link>
      ))}
    </nav>
  )
} 