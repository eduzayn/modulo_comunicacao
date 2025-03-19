'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">Página não encontrada</p>
      <Button onClick={() => router.back()}>Voltar</Button>
    </div>
  )
} 