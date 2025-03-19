'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Inbox, 
  User, 
  Users, 
  Archive, 
  AlertCircle,
  Clock,
  Beaker,
  ChevronDown,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarItems = [
  {
    id: 'entrada',
    label: 'Entrada',
    icon: Inbox,
    count: '999+',
    active: true
  },
  {
    id: 'meus',
    label: 'Meus',
    icon: User,
    count: '66'
  },
  {
    id: 'seguindo',
    label: 'Seguindo',
    icon: Users,
    count: '1'
  },
  {
    id: 'arquivados',
    label: 'Arquivados',
    icon: Archive
  },
  {
    id: 'nao-atribuidos',
    label: 'Não Atribuídos Geral',
    icon: AlertCircle,
    color: 'text-red-500'
  },
  {
    id: 'nunca-respondidos',
    label: 'Nunca Respondidos',
    icon: Clock,
    color: 'text-red-500'
  },
  {
    id: 'teste',
    label: 'teste',
    icon: Beaker
  }
]

export function InboxSidebar() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <Button
          variant="outline"
          className="w-full justify-between"
        >
          Filtros
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-4">
        <Input 
          type="search"
          placeholder="Pesquisar"
          className="h-9"
        />
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1">
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                item.active && "bg-accent",
                item.color
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count && (
                <span className="text-xs tabular-nums">{item.count}</span>
              )}
            </Button>
          ))}
        </nav>
      </ScrollArea>

      {/* Add Filter */}
      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar Filtro
        </Button>
      </div>
    </div>
  )
} 