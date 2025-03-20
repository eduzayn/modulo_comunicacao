import { Button } from '@/components/ui/button'
import { Settings, FileText, UserPlus, ArrowDownUp } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Calendário - Módulo de Comunicação',
  description: 'Gerencie eventos, reuniões e compromissos no calendário integrado'
}

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 p-4 lg:p-6 relative">
      <div className="absolute top-4 right-6 hidden md:flex space-x-2">
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Exportar
        </Button>
        <Button variant="outline" size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Compartilhar
        </Button>
        <Button variant="outline" size="sm">
          <ArrowDownUp className="mr-2 h-4 w-4" />
          Sincronizar
        </Button>
        <Link href="/settings/calendar">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Button>
        </Link>
      </div>
      {children}
    </div>
  )
} 