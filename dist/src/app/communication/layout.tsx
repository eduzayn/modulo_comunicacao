/**
 * layout.tsx - Layout principal para área de comunicação
 * 
 * Este layout unifica a área de comunicação, resolvendo conflitos entre
 * as pastas communication e (communication)
 * 
 * ATENÇÃO: A pasta (communication) deve ser removida após migração de suas funcionalidades
 * para evitar conflitos de roteamento. Manter apenas este layout para a área de comunicação.
 */

import { ActivityIndicator } from '@/components/layout/ActivityIndicator';
import { NavMenu } from '@/components/layout/NavMenu';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { communicationRoutes, settingsAndStats } from './routes';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Home, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export const metadata = {
  title: 'Comunicação | Sistema de Comunicação',
  description: 'Área de gerenciamento de comunicações',
}

export default function CommunicationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navegação da área - versão desktop */}
      <div className="bg-white dark:bg-slate-950 border-b py-2 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" aria-label="Voltar para a página inicial">
                <Home className="h-4 w-4 mr-1" />
                <span>Início</span>
              </Link>
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Comunicação</span>
          </div>
          
          {/* Menu para dispositivos móveis */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu de navegação</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="overflow-auto">
                <div className="py-4">
                  <h2 className="text-lg font-semibold mb-4">Menu de Comunicação</h2>
                  <NavMenu 
                    groups={[...communicationRoutes, ...settingsAndStats]} 
                    type="sidebar" 
                    collapseByDefault
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Layout de duas colunas para desktop */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Barra lateral para navegação - apenas desktop */}
        <div className="hidden md:block w-64 border-r bg-muted/30 p-4 overflow-y-auto">
          <NavMenu 
            groups={communicationRoutes} 
            type="sidebar"
          />
          <div className="mt-8">
            <NavMenu 
              groups={settingsAndStats} 
              type="sidebar"
            />
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 overflow-auto">
          {/* Breadcrumbs */}
          <div className="px-4 py-2 border-b">
            <Breadcrumbs />
          </div>
          
          {children}
        </div>
      </div>
      
      {/* Indicador de atividade */}
      <div className="fixed bottom-4 right-4 z-50">
        <ActivityIndicator />
      </div>
    </div>
  )
}
