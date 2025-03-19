'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export function BackButton() {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => router.back()}
      className="hover:bg-transparent"
      data-testid="back-button"
    >
      <ChevronLeft className="h-6 w-6" />
      <span className="sr-only">Voltar</span>
    </Button>
  )
} 