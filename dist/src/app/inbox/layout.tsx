import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Settings, MessageSquare, Tag, Zap } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export const metadata = {
  title: 'Caixa de Entrada Unificada',
  description: 'Gerencie todas as suas conversas e interações de múltiplos canais em um só lugar.'
}

export default function InboxLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 relative">
      <div className="absolute top-4 right-6 z-10">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="end">
            <div className="grid gap-1">
              <Link href="/settings/channels" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="text-sm">Canais</span>
              </Link>
              <Link href="/settings/quick-phrases" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                <Zap className="h-4 w-4 mr-2" />
                <span className="text-sm">Frases Rápidas</span>
              </Link>
              <Link href="/settings/tags" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                <Tag className="h-4 w-4 mr-2" />
                <span className="text-sm">Tags</span>
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {children}
    </div>
  )
} 