'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'Caixa de Entrada',
    href: '/inbox',
  },
  {
    label: 'CRM',
    href: '/crm',
  },
  {
    label: 'Relatórios',
    href: '/reports',
  },
  {
    label: 'Calendário',
    href: '/calendar',
  },
  {
    label: 'Configurações',
    href: '/settings',
  },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <nav className="flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center text-sm font-medium transition-colors hover:text-primary',
                pathname?.startsWith(item.href)
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Alternar tema"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
} 