'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Inbox, 
  User, 
  Users, 
  Archive, 
  AlertCircle,
  Clock,
  Beaker,
  ChevronDown,
  Plus,
  MessageSquare, 
  Facebook,
  Instagram,
  Mail,
  Star,
  Flag,
  Tags,
  Bookmark,
  BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

// Status filters
const statusItems = [
  {
    id: 'entrada',
    label: 'Entrada',
    icon: Inbox,
    count: '999+',
    param: null
  },
  {
    id: 'meus',
    label: 'Meus',
    icon: User,
    count: '59',
    param: 'meus'
  },
  {
    id: 'seguindo',
    label: 'Seguindo',
    icon: Bookmark,
    count: '1',
    param: 'seguindo'
  },
  {
    id: 'arquivados',
    label: 'Arquivados',
    icon: Archive,
    param: 'arquivados'
  }
]

// Status filters para seção de não atribuídos
const unassignedItems = [
  {
    id: 'nao-atribuidos',
    label: 'Não Atribuídos Geral',
    icon: AlertCircle,
    color: 'text-red-500',
    param: 'nao-atribuidos'
  },
  {
    id: 'nunca-respondidos',
    label: 'Nunca Respondidos',
    icon: Clock,
    color: 'text-red-500',
    param: 'nunca-respondidos'
  }
]

// Status filters para seção de teste
const testItems = [
  {
    id: 'teste',
    label: 'teste',
    icon: Beaker,
    param: 'teste'
  }
]

// Status filters para seção de atribuídos
const assignedItems = [
  {
    id: 'atribuidos-guilherme',
    label: 'Atribuídos Guilherme',
    icon: User,
    param: 'atribuidos-guilherme'
  },
  {
    id: 'atribuidos-guilherme-antigo',
    label: 'Atribuídos guilherme antigo',
    icon: User,
    param: 'atribuidos-guilherme-antigo'
  }
]

// Channel filters
const channelItems = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageSquare,
    color: 'text-green-500',
    count: '52',
    param: 'whatsapp'
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: Facebook,
    color: 'text-blue-600',
    count: '8',
    param: 'facebook'
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: Instagram,
    color: 'text-pink-600',
    count: '12',
    param: 'instagram'
  },
  {
    id: 'email',
    label: 'Email',
    icon: Mail,
    color: 'text-blue-500',
    count: '5',
    param: 'email'
  }
]

// Grupos
const groupItems = [
  {
    id: 'sem-grupo',
    label: 'Sem grupo',
    icon: Users,
    param: 'sem-grupo'
  },
  {
    id: 'plataforma-unicv',
    label: 'PLATAFORMA UNICV',
    icon: BookOpen,
    param: 'plataforma-unicv'
  },
  {
    id: 'desqualificados',
    label: 'DESQUALIFICADOS',
    icon: Flag,
    param: 'desqualificados'
  },
  {
    id: 'secretaria-musica',
    label: 'SECRETÁRIA DE MÚSICA',
    icon: Star,
    param: 'secretaria-musica'
  },
  {
    id: 'primeira-graduacao',
    label: 'PRIMEIRA GRADUAÇÃO UNICV',
    icon: BookOpen,
    param: 'primeira-graduacao'
  },
  {
    id: 'analise-certificacao',
    label: 'ANÁLISE CERTIFICAÇÃO',
    icon: Flag,
    param: 'analise-certificacao'
  },
  {
    id: 'certificacao-andamento',
    label: 'CERTIFICAÇÃO EM ANDAMENTO',
    icon: Clock,
    param: 'certificacao-andamento'
  },
  {
    id: 'suporte',
    label: 'SUPORTE',
    icon: AlertCircle,
    param: 'suporte'
  },
  {
    id: 'financeiro',
    label: 'FINANCEIRO',
    icon: Flag,
    param: 'financeiro'
  },
  {
    id: 'apressamentos',
    label: 'APRESSAMENTOS',
    icon: Clock,
    param: 'apressamentos'
  },
  {
    id: 'aguardando-diploma',
    label: 'AGUARDANDO DIPLOMA',
    icon: Clock,
    param: 'aguardando-diploma'
  }
]

export function InboxSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [activeChannel, setActiveChannel] = useState<string | null>(null)
  const [activeGroup, setActiveGroup] = useState<string | null>(null)

  // Atualiza os filtros ativos com base nos parâmetros de URL
  useEffect(() => {
    const status = searchParams.get('status')
    const channel = searchParams.get('channel')
    const group = searchParams.get('group')
    
    setActiveFilter(status)
    setActiveChannel(channel)
    setActiveGroup(group)
  }, [searchParams])

  // Função para navegar com os filtros
  const navigateWithFilter = useCallback((type: 'status' | 'channel' | 'group', value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set(type, value)
    } else {
      params.delete(type)
    }
    
    router.push(`/inbox?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium mb-2">Filtros</h3>
      </div>

      {/* Main filters */}
      <div className="flex-1 overflow-auto">
        {/* Status Nav */}
        <div className="px-4 py-2">
          <nav className="grid gap-1">
            {statusItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  activeFilter === item.param && "bg-accent"
                )}
                onClick={() => navigateWithFilter('status', item.param)}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.count && (
                  <Badge variant="secondary" className="text-xs">
                    {item.count}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>
        </div>

        <div className="my-2 border-t" />

        {/* Não Atribuídos */}
        <div className="px-4 py-2">
          <h3 className="text-sm font-medium mb-2 text-red-500">Não Atribuídos</h3>
          <nav className="grid gap-1">
            {unassignedItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  activeFilter === item.param && "bg-accent",
                  item.color
                )}
                onClick={() => navigateWithFilter('status', item.param)}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>

        <div className="my-2 border-t" />

        {/* Teste */}
        <div className="px-4 py-2">
          <nav className="grid gap-1">
            {testItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  activeFilter === item.param && "bg-accent"
                )}
                onClick={() => navigateWithFilter('status', item.param)}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>

        <div className="my-2 border-t" />

        {/* Atribuídos */}
        <div className="px-4 py-2">
          <nav className="grid gap-1">
            {assignedItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  activeFilter === item.param && "bg-accent"
                )}
                onClick={() => navigateWithFilter('status', item.param)}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>

        <div className="my-2 border-t" />

        {/* Grupos */}
        <div className="px-4 py-2">
          <h3 className="text-sm font-medium mb-2">Grupos</h3>
          <nav className="grid gap-1">
            {groupItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  activeGroup === item.param && "bg-accent"
                )}
                onClick={() => navigateWithFilter('group', item.param)}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1 text-left truncate">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>

        <div className="my-2 border-t" />

        {/* Channel Nav */}
        <div className="px-4 py-2">
          <h3 className="text-sm font-medium mb-2">Canais</h3>
          <nav className="grid gap-1">
            {channelItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  activeChannel === item.param && "bg-accent"
                )}
                onClick={() => navigateWithFilter('channel', item.param)}
              >
                <item.icon className={cn("h-4 w-4", item.color)} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.count && (
                  <Badge variant="secondary" className="text-xs">
                    {item.count}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Active filters display */}
      {(activeFilter || activeChannel || activeGroup) && (
        <div className="p-4 border-t">
          <div className="text-sm font-medium mb-2">Filtros ativos:</div>
          <div className="flex flex-wrap gap-2">
            {activeFilter && (
              <Badge variant="outline" className="flex items-center gap-1">
                {statusItems.find(item => item.param === activeFilter)?.label || 
                 unassignedItems.find(item => item.param === activeFilter)?.label || 
                 testItems.find(item => item.param === activeFilter)?.label || 
                 assignedItems.find(item => item.param === activeFilter)?.label || 
                 activeFilter}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1" 
                  onClick={() => navigateWithFilter('status', null)}
                >
                  <AlertCircle className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {activeChannel && (
              <Badge variant="outline" className="flex items-center gap-1">
                {channelItems.find(item => item.param === activeChannel)?.label || activeChannel}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1" 
                  onClick={() => navigateWithFilter('channel', null)}
                >
                  <AlertCircle className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {activeGroup && (
              <Badge variant="outline" className="flex items-center gap-1">
                {groupItems.find(item => item.param === activeGroup)?.label || activeGroup}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1" 
                  onClick={() => navigateWithFilter('group', null)}
                >
                  <AlertCircle className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 