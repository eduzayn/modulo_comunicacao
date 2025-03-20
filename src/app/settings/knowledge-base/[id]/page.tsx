'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { KnowledgeBaseForm } from '../components/knowledge-base-form'
import { useKnowledgeBase } from '../hooks/use-knowledge-base'

interface EditKnowledgeBasePageProps {
  params: {
    id: string
  }
}

export default function EditKnowledgeBasePage({
  params,
}: EditKnowledgeBasePageProps) {
  const router = useRouter()
  const { knowledgeBase, isLoading } = useKnowledgeBase(params.id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!knowledgeBase) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Base de conhecimento não encontrada</p>
      </div>
    )
  }

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
            Editar Base de Conhecimento
          </h1>
          <p className="text-muted-foreground">
            Edite uma base de conhecimento existente.
          </p>
        </div>
      </div>

      <KnowledgeBaseForm id={params.id} onSuccess={() => router.push('/settings/knowledge-base')} />
    </div>
  )
} 