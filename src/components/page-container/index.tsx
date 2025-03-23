import React from 'react'

interface PageContainerProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function PageContainer({ title, subtitle, children }: PageContainerProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>
      <div>{children}</div>
    </div>
  )
} 