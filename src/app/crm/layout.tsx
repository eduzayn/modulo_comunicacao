'use client'

import { SidebarNav } from '@/components/crm/sidebar-nav'

interface CrmLayoutProps {
  children: React.ReactNode
}

export default function CrmLayout({ children }: CrmLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r bg-background lg:block">
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-4 p-8">
            <h2 className="text-lg font-semibold tracking-tight">CRM</h2>
            <SidebarNav />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
} 