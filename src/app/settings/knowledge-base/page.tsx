'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { KnowledgeBaseList } from './components/knowledge-base-list'

export const metadata = {
  title: 'Base de Conhecimento',
  description: 'Gerencie suas bases de conhecimento para treinar a IA.',
}

export default function KnowledgeBasePage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Base de Conhecimento
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas bases de conhecimento para treinar a IA.
          </p>
        </div>

        <Button onClick={() => router.push('/settings/knowledge-base/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Base
        </Button>
      </div>

      <KnowledgeBaseList />
    </div>
  )
} 