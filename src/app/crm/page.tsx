import { DealStages } from '@/components/crm/deal-stages'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { PageContainer } from '@/components/page-container/page-container'

export default function CRMPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <Breadcrumb />
        
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
  )
} 