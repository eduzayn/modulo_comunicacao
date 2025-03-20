'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

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
    <div className={cn("w-64 flex-shrink-0 border-r bg-background", className)}>
      <div className="flex h-full flex-col p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Navegação</h2>
        </div>
        <SidebarNav
          items={[
            {
              title: "Perfil",
              href: "/settings/account/profile",
            },
            {
              title: "Notificações",
              href: "/settings/account/notifications",
            },
            {
              title: "Membros",
              href: "/settings/account/members",
            },
            {
              title: "Funções",
              href: "/settings/account/roles",
            },
            {
              title: "Workspace",
              href: "/settings/account/workspace",
            },
          ]}
        />
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
            pathname === item.href
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