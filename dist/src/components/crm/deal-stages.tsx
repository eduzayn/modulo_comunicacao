'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface Deal {
  id: string
  title: string
  value: number
  customer: string
  updatedAt: string
}

interface Stage {
  id: string
  title: string
  count: number
  deals: Deal[]
}

const stages: Stage[] = [
  {
    id: 'pos-vendas',
    title: 'PÓS-VENDAS',
    count: 999,
    deals: []
  },
  {
    id: 'documentacao',
    title: 'DOCUMENTAÇÃO',
    count: 0,
    deals: []
  },
  {
    id: 'correcao-trabalhos',
    title: 'CORREÇÃO TRABALHOS',
    count: 0,
    deals: []
  },
  {
    id: 'emissao-certificados',
    title: 'EMISSÃO DE CERTIFICADOS',
    count: 0,
    deals: []
  },
  {
    id: 'emissao-diploma',
    title: 'EMISSÃO DE DIPLOMA',
    count: 0,
    deals: []
  }
]

export function DealStages() {
  return (
    <div className="grid grid-cols-5 gap-4 p-4">
      {stages.map((stage) => (
        <div key={stage.id} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                {stage.title}
              </h3>
              <p className="text-2xl font-bold">{stage.count}</p>
            </div>
            <Button variant="ghost" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {stage.deals.map((deal) => (
              <Card key={deal.id} className="p-4">
                <h4 className="font-medium">{deal.title}</h4>
                <p className="text-sm text-muted-foreground">{deal.customer}</p>
                <p className="text-sm font-medium">R$ {deal.value.toLocaleString()}</p>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
} 