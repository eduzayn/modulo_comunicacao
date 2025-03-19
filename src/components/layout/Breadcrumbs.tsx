import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbsProps {
  items: {
    title: string
    href: string
  }[]
  module: 'communication' | 'student' | 'content' | 'enrollment'
}

export function Breadcrumbs({ items, module }: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="Navegação estrutural" 
      className="flex items-center space-x-1 text-sm text-muted-foreground"
    >
      <Link
        href="/"
        className="flex items-center hover:text-foreground transition-colors"
        aria-label="Ir para página inicial"
      >
        <Home className="h-4 w-4" />
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <Link
            href={item.href}
            className={cn(
              'ml-1 hover:text-foreground transition-colors',
              index === items.length - 1 && {
                'text-communication-dark font-medium': module === 'communication',
                'text-student-dark font-medium': module === 'student',
                'text-content-dark font-medium': module === 'content',
                'text-enrollment-dark font-medium': module === 'enrollment',
              }
            )}
            aria-current={index === items.length - 1 ? 'page' : undefined}
          >
            {item.title}
          </Link>
        </div>
      ))}
    </nav>
  )
} 