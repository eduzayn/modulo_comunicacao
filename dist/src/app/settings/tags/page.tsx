'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { TagList } from './components/tag-list'

export default function TagsPage() {
  const router = useRouter()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Tags</h1>
          <p className="text-sm text-muted-foreground">
            Categorize suas conversas e negócios com etiquetas facilitando a identificação, busca e filtragem.
          </p>
        </div>

        <Button
          onClick={() => router.push('/settings/tags/new')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova tag
        </Button>
      </div>

      <TagList />
    </div>
  )
} 