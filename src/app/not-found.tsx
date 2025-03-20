'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-6 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold">Página não encontrada</h2>
      <p className="text-muted-foreground">
        Desculpe, a página que você está procurando não existe ou foi movida.
      </p>
      <div className="flex space-x-4">
        <Button onClick={() => router.back()} variant="outline">
          Voltar
        </Button>
        <Button asChild>
          <Link href="/">Ir para a página inicial</Link>
        </Button>
      </div>
    </div>
  )
} 