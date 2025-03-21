'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Settings, Briefcase, ListFilter, Workflow } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export default function CRMLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 p-6 relative">
      <div className="absolute top-4 right-6">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="end">
            <div className="grid gap-1">
              <Link href="/settings/pipelines" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                <Briefcase className="h-4 w-4 mr-2" />
                <span className="text-sm">Funis de Vendas</span>
              </Link>
              <Link href="/settings/assignment-rules" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                <ListFilter className="h-4 w-4 mr-2" />
                <span className="text-sm">Regras de Atribuição</span>
              </Link>
              <Link href="/settings/automations" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                <Workflow className="h-4 w-4 mr-2" />
                <span className="text-sm">Automações</span>
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {children}
    </div>
  )
} 