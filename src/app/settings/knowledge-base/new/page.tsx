'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { KnowledgeBaseForm } from '../components/knowledge-base-form'

export default function NewKnowledgeBasePage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/settings/knowledge-base')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Nova Base de Conhecimento
          </h1>
          <p className="text-muted-foreground">
            Crie uma nova base de conhecimento para treinar a IA.
          </p>
        </div>
      </div>

      <KnowledgeBaseForm />
    </div>
  )
} 