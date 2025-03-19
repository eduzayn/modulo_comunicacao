import { DealPipeline } from '@/components/crm/deal-pipeline'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export default function CrmPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Negociações</h1>
          <p className="text-sm text-muted-foreground">
            TUTORIA MÚSICA
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Pesquisar
          </Button>
          <Button variant="outline" size="sm">
            Filtrar
          </Button>
        </div>
      </div>

      <DealPipeline />
    </div>
  )
} 