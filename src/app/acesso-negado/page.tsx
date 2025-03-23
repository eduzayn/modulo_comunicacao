/**
 * page.tsx (acesso-negado)
 * 
 * Página de acesso negado exibida quando o usuário tenta acessar
 * uma rota para a qual não possui permissões.
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, Home, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Acesso Negado',
  description: 'Você não tem permissão para acessar esta página',
}

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
            <Shield className="h-10 w-10 text-red-600 dark:text-red-300" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">Acesso Negado</h1>
        
        <p className="text-muted-foreground">
          Você não possui permissão para acessar esta página. 
          Se você acredita que deveria ter acesso, entre em contato com um administrador.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Página Inicial
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="javascript:history.back()">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 