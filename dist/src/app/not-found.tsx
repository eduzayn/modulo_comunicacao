/**
 * not-found.tsx
 * 
 * Página 404 personalizada exibida quando uma rota não é encontrada.
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
            <AlertTriangle className="h-10 w-10 text-yellow-600 dark:text-yellow-300" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <h2 className="text-2xl font-semibold">Página não encontrada</h2>
        
        <p className="text-muted-foreground">
          Desculpe, a página que você está procurando não existe ou foi movida.
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
        
        <div className="text-sm text-muted-foreground pt-8">
          Se você acredita que isso é um erro, entre em contato com o suporte técnico.
        </div>
      </div>
    </div>
  );
} 