'use client';

/**
 * NavMenu.tsx
 * 
 * Componente de navegação principal que mostra grupos de rotas em formato de menu.
 * Suporta rotas agrupadas por seção, ícones, e destaque para item ativo.
 */

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight } from 'lucide-react'

// Tipos para configuração das rotas
export interface NavItem {
  title: string
  href: string
  icon?: React.ReactNode
  description?: string
  disabled?: boolean
  permission?: string
  external?: boolean
}

export interface NavGroup {
  title: string
  items: NavItem[]
  icon?: React.ReactNode
  permission?: string
  collapsed?: boolean
}

interface NavMenuProps {
  groups: NavGroup[]
  orientation?: 'horizontal' | 'vertical'
  className?: string
  activeClassName?: string
  inactiveClassName?: string
  groupClassName?: string
  showIcons?: boolean
  showDescriptions?: boolean
  collapsible?: boolean
}

export function NavMenu({
  groups,
  orientation = 'vertical',
  className,
  activeClassName = 'bg-accent text-accent-foreground',
  inactiveClassName = 'hover:bg-muted/50',
  groupClassName,
  showIcons = true,
  showDescriptions = false,
  collapsible = true,
}: NavMenuProps) {
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<string[]>([])

  // Verifica se um item está ativo
  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`)

  // Alterna o estado de abertura de um grupo
  const toggleGroup = (title: string) => {
    setOpenGroups(prev =>
      prev.includes(title)
        ? prev.filter(group => group !== title)
        : [...prev, title]
    )
  }

  return (
    <nav className={cn(
      'flex',
      orientation === 'vertical' ? 'flex-col space-y-2' : 'flex-row space-x-2',
      className
    )}>
      {groups.map((group) => (
        <div key={group.title} className={cn('space-y-1', groupClassName)}>
          {collapsible ? (
            <Collapsible
              open={openGroups.includes(group.title) || !group.collapsed}
              onOpenChange={() => toggleGroup(group.title)}
              className="space-y-1"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between px-2 font-medium"
                  size="sm"
                >
                  <div className="flex items-center">
                    {showIcons && group.icon && <span className="mr-2">{group.icon}</span>}
                    {group.title}
                  </div>
                  {openGroups.includes(group.title) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-1 pl-6">
                {group.items.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    isActive={isActive(item.href)}
                    activeClassName={activeClassName}
                    inactiveClassName={inactiveClassName}
                    showIcon={showIcons}
                    showDescription={showDescriptions}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <>
              <h3 className="px-3 text-sm font-medium text-muted-foreground">
                {showIcons && group.icon && <span className="mr-2">{group.icon}</span>}
                {group.title}
              </h3>
              
              <div className="space-y-1 pl-6">
                {group.items.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    isActive={isActive(item.href)}
                    activeClassName={activeClassName}
                    inactiveClassName={inactiveClassName}
                    showIcon={showIcons}
                    showDescription={showDescriptions}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </nav>
  )
}

interface NavItemProps {
  item: NavItem
  isActive: boolean
  activeClassName: string
  inactiveClassName: string
  showIcon: boolean
  showDescription: boolean
}

function NavItem({
  item,
  isActive,
  activeClassName,
  inactiveClassName,
  showIcon,
  showDescription,
}: NavItemProps) {
  if (item.disabled) {
    return (
      <div
        className="flex cursor-not-allowed items-center rounded-md px-3 py-2 text-muted-foreground opacity-60"
        title={item.disabled ? "Indisponível" : undefined}
      >
        {showIcon && item.icon && <span className="mr-2">{item.icon}</span>}
        <div>
          <div>{item.title}</div>
          {showDescription && item.description && (
            <p className="text-xs text-muted-foreground">{item.description}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
        isActive ? activeClassName : inactiveClassName,
        item.disabled && "cursor-not-allowed opacity-60"
      )}
    >
      {showIcon && item.icon && <span className="mr-2">{item.icon}</span>}
      <div>
        <div>{item.title}</div>
        {showDescription && item.description && (
          <p className="text-xs text-muted-foreground">{item.description}</p>
        )}
      </div>
    </Link>
  )
} 