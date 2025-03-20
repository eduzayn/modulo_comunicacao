import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Settings, BarChart2, Plug, LayoutDashboard } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export const metadata = {
  title: 'Relatórios e Análises',
  description: 'Visualize estatísticas e relatórios de desempenho do sistema'
}

export default function ReportsLayout({
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
              <Link href="/settings/reports" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                <BarChart2 className="h-4 w-4 mr-2" />
                <span className="text-sm">Relatórios</span>
              </Link>
              <Link href="/settings/integrations" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                <Plug className="h-4 w-4 mr-2" />
                <span className="text-sm">Integrações</span>
              </Link>
              <Link href="/settings/widget" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                <span className="text-sm">Widget</span>
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {children}
    </div>
  )
} 