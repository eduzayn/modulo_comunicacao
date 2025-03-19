'use client'

import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface BaseLayoutProps {
  children: React.ReactNode
}

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  )
} 