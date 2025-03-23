'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { BusinessHoursList } from './components/business-hours-list'

export default function BusinessHoursPage() {
  const router = useRouter()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Horários de Funcionamento</h1>
          <p className="text-sm text-muted-foreground">
            Configure os horários de atendimento para cada dia da semana.
          </p>
        </div>

        <Button
          onClick={() => router.push('/settings/business-hours/new')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo horário
        </Button>
      </div>

      <BusinessHoursList />
    </div>
  )
} 