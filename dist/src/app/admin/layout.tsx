/**
 * layout.tsx - Layout principal para área administrativa
 * 
 * Este layout define a estrutura padrão para todas as páginas da área administrativa
 */

import { ActivityIndicator } from '@/components/layout/ActivityIndicator';
import { NavMenu } from '@/components/layout/NavMenu';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { adminRoutes, settingsRoutes } from './routes';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Menu, Settings } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ProtectedPage } from '@/components/auth/withAuth';

export const metadata = {
  title: 'Administração | Sistema de Comunicação',
  description: 'Área administrativa do sistema',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedPage requiredPermissions={['admin.access']}>
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
              <span className="font-medium">Administração</span>
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
                    <h2 className="text-lg font-semibold mb-4">Menu Administrativo</h2>
                    <NavMenu 
                      groups={[...adminRoutes, ...settingsRoutes]} 
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
          <div className="hidden md:block w-64 border-r bg-slate-50 dark:bg-slate-900 p-4 overflow-y-auto">
            <NavMenu 
              groups={adminRoutes} 
              type="sidebar"
            />
            <div className="mt-8">
              <NavMenu 
                groups={settingsRoutes} 
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
    </ProtectedPage>
  )
} 