'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'

interface PageContainerProps {
  title: string
  description?: string
  breadcrumbItems?: Array<{
    href: string
    label: string
  }>
  showBreadcrumb?: boolean
  action?: {
    label: string
    onClick: () => void
    href?: string
    variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive'
  }
  children: React.ReactNode
  className?: string
}

export function PageContainer({
  title,
  description,
  breadcrumbItems,
  showBreadcrumb = true,
  action,
  children,
  className,
}: PageContainerProps) {
  return (
    <div className={cn('container py-6', className)}>
      {showBreadcrumb && (
        <Breadcrumb items={breadcrumbItems} />
      )}
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        
        {action && (
          <div className="mt-4 md:mt-0">
            {action.href ? (
              <Button 
                asChild
                variant={action.variant || 'default'}
              >
                <a href={action.href}>{action.label}</a>
              </Button>
            ) : (
              <Button 
                onClick={action.onClick} 
                variant={action.variant || 'default'}
              >
                {action.label}
              </Button>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-6">
        {children}
      </div>
    </div>
  )
} 