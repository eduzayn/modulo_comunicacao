'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-4">Erro no Servidor</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Ocorreu um erro inesperado. Por favor, tente novamente.
      </p>
      <Button onClick={() => reset()}>Tentar Novamente</Button>
    </div>
  )
} 