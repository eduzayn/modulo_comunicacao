import { ReactNode } from 'react'

interface IntegrationsLayoutProps {
  children: ReactNode
}

export default function IntegrationsLayout({ children }: IntegrationsLayoutProps) {
  return (
    <div className="h-full">
      {children}
    </div>
  )
} 