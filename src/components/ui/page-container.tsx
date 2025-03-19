'use client'

import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`container p-6 pt-8 md:p-8 max-w-7xl mx-auto ${className}`}>
      {children}
    </div>
  )
} 