'use client'

import { PageContainer } from '@/components/page-container/page-container'
import { DealStages } from '@/components/crm/deal-stages'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { PlusCircle } from 'lucide-react'

export default function DealsPage() {
  const router = useRouter()
  
  return (
    <PageContainer
      title="Negociações"
      description="Gerencie oportunidades e negócios em andamento"
      breadcrumbItems={[
        { href: '/crm', label: 'CRM' },
        { href: '/crm/deals', label: 'Negociações' }
      ]}
      action={{
        label: 'Nova Negociação',
        onClick: () => router.push('/crm/deals/new'),
        variant: 'default'
      }}
    >
      <DealStages />
    </PageContainer>
  )
} 