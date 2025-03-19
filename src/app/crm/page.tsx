import { SidebarNav } from '@/components/crm/sidebar-nav'
import { DealStages } from '@/components/crm/deal-stages'

export default function CRMPage() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r bg-background">
        <div className="p-6">
          <h2 className="text-lg font-semibold">CRM</h2>
        </div>
        <SidebarNav className="px-4" />
      </aside>
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Negociações</h1>
              <p className="text-sm text-muted-foreground">
                TUTORIA MÚSICA
              </p>
            </div>
          </div>
          
          <DealStages />
        </div>
      </div>
    </div>
  )
} 