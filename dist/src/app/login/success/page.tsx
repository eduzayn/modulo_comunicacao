'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginSuccess() {
  const router = useRouter()

  useEffect(() => {
    // Redirecionar para a página inicial após login
    router.push('/communication')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Login realizado com sucesso!</h1>
        <p className="text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  )
} 