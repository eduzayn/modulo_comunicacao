'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea, Badge, Separator } from '@/components/ui'
import { 
  Inbox, 
  User, 
  Users, 
  Archive, 
  AlertCircle,
  Clock,
  Beaker,
  ChevronDown,
  ChevronRight,
  Plus,
  MessageSquare, 
  Facebook,
  Instagram,
  Mail,
  Star,
  Flag,
  Tags,
  Bookmark,
  BookOpen,
  Cross,
  Filter,
  CreditCard,
  CalendarClock,
  GraduationCap,
  FileCheck,
  HelpCircle,
  History,
  Award,
  FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useMemo, memo } from 'react'

// Componente para cabeçalho de seção colapsável
interface SectionHeaderProps {
  title: string;
  color?: string;
  isExpanded: boolean;
  onToggle: () => void;
  count?: number;
  icon?: React.ReactNode;
}

const SectionHeader = memo(function SectionHeader({ 
  title, 
  color = "text-foreground", 
  isExpanded, 
  onToggle, 
  count, 
  icon 
}: SectionHeaderProps) {
  return (
    <div 
      className="flex items-center justify-between px-2 py-1 cursor-pointer group" 
      onClick={onToggle}
    >
      <div className="flex items-center gap-2">
        {icon}
        <h3 className={cn("text-sm font-medium", color)}>{title}</h3>
        {count && (
          <Badge variant="secondary" className="text-xs">{count}</Badge>
        )}
      </div>
      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-70 group-hover:opacity-100">
        {isExpanded ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  )
})

// Item de navegação
interface NavItemProps {
  item: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    param: string | null;
    color?: string;
    count?: string;
  };
  isActive: boolean;
  onClick: () => void;
  iconColor?: string;
}

const NavItem = memo(function NavItem({ item, isActive, onClick, iconColor }: NavItemProps) {
  const Icon = item.icon;
  
  return (
    <Button
      key={item.id}
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2 text-sm rounded-lg h-auto py-2",
        isActive && "bg-accent/70 font-medium",
        item.color
      )}
      onClick={onClick}
    >
      <Icon className={cn("h-4 w-4", iconColor)} />
      <span className="flex-1 text-left truncate">{item.label}</span>
      {item.count && (
        <Badge variant="secondary" className="text-xs">
          {item.count}
        </Badge>
      )}
    </Button>
  );
})

// Lista de navegação
interface NavListProps {
  items: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    param: string | null;
    color?: string;
    count?: string;
  }>;
  activeItem: string | null;
  onItemClick: (param: string | null) => void;
  iconColor?: string;
}

const NavList = memo(function NavList({ items, activeItem, onItemClick, iconColor }: NavListProps) {
  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <NavItem
          key={item.id}
          item={item}
          isActive={activeItem === item.param}
          onClick={() => onItemClick(item.param)}
          iconColor={iconColor}
        />
      ))}
    </nav>
  );
})

export function InboxSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [activeChannel, setActiveChannel] = useState<string | null>(null)
  const [activeGroup, setActiveGroup] = useState<string | null>(null)
  
  // Estado de expansão das seções
  const [expandedSections, setExpandedSections] = useState({
    main: true,
    unassigned: true,
    test: false, // Colapsar por padrão seções menos usadas
    assigned: true,
    departments: false,
    processes: false,
    support: false,
    channels: true,
  })

  // Toggle expansão de seção
  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }, [])

  // Atualiza os filtros ativos com base nos parâmetros de URL
  useEffect(() => {
    const status = searchParams.get('status')
    const channel = searchParams.get('channel')
    const group = searchParams.get('group')
    
    setActiveFilter(status)
    setActiveChannel(channel)
    setActiveGroup(group)
  }, [searchParams])

  // Função para navegar com os filtros - memoizada para evitar recriações
  const navigateWithFilter = useCallback((type: 'status' | 'channel' | 'group', value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set(type, value)
    } else {
      params.delete(type)
    }
    
    router.push(`/inbox?${params.toString()}`)
  }, [router, searchParams])

  // Handlers memoizados para evitar re-renders
  const handleStatusClick = useCallback((param: string | null) => {
    navigateWithFilter('status', param)
  }, [navigateWithFilter])

  const handleChannelClick = useCallback((param: string | null) => {
    navigateWithFilter('channel', param)
  }, [navigateWithFilter])

  const handleGroupClick = useCallback((param: string | null) => {
    navigateWithFilter('group', param)
  }, [navigateWithFilter])
  
  // Memoização de componentes de filtro para evitar renderizações desnecessárias
  const statusFilters = useMemo(() => {
    return [
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
  }, [])
  
  const unassignedFilters = useMemo(() => {
    return [
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
  }, [])
  
  const channelFilters = useMemo(() => {
    return [
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
  }, [])
  
  // Memoização dos badges de filtros ativos para evitar re-renders
  const activeBadges = useMemo(() => {
    const badges = []
    
    // Função auxiliar para encontrar rótulo de item
    const findLabel = (items: any[], param: string | null): string => {
      const item = items.find(item => item.param === param)
      return item?.label || String(param)
    }
    
    if (activeFilter) {
      const label = 
        findLabel(statusFilters, activeFilter) || 
        findLabel(unassignedFilters, activeFilter) || 
        activeFilter
        
      badges.push({
        type: 'status' as const,
        label,
        param: activeFilter
      })
    }
    
    if (activeChannel) {
      badges.push({
        type: 'channel' as const,
        label: findLabel(channelFilters, activeChannel),
        param: activeChannel
      })
    }
    
    if (activeGroup) {
      // Não usamos findLabel aqui porque os grupos são renderizados sob demanda
      badges.push({
        type: 'group' as const,
        label: activeGroup,
        param: activeGroup
      })
    }
    
    return badges
  }, [activeFilter, activeChannel, activeGroup, statusFilters, unassignedFilters, channelFilters])

  return (
    <div className="flex h-full flex-col bg-background/50">
      {/* Cabeçalho */}
      <div className="p-4 border-b bg-background/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="relative">
          <Input
            placeholder="Buscar conversas..."
            className="pl-8 pr-3 h-9 text-sm"
          />
          <Filter className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Filtros principais */}
      <ScrollArea className="flex-1">
        <div className="p-1">
          {/* Seção Principal */}
          <SectionHeader 
            title="Conversas" 
            isExpanded={expandedSections.main}
            onToggle={() => toggleSection('main')}
          />
          
          {expandedSections.main && (
            <div className="px-2 py-1">
              <NavList
                items={statusFilters}
                activeItem={activeFilter}
                onItemClick={handleStatusClick}
                iconColor="text-primary/80"
              />
            </div>
          )}

          <Separator className="my-1 opacity-50" />

          {/* Não Atribuídos */}
          <SectionHeader 
            title="Não Atribuídos" 
            color="text-red-500"
            isExpanded={expandedSections.unassigned}
            onToggle={() => toggleSection('unassigned')}
            icon={<AlertCircle className="h-4 w-4 text-red-500" />}
          />
          
          {expandedSections.unassigned && (
            <div className="px-2 py-1">
              <NavList
                items={unassignedFilters}
                activeItem={activeFilter}
                onItemClick={handleStatusClick}
              />
            </div>
          )}

          {/* Atribuídos */}
          <SectionHeader 
            title="Atribuídos" 
            color="text-green-600"
            isExpanded={expandedSections.assigned}
            onToggle={() => toggleSection('assigned')}
            icon={<User className="h-4 w-4 text-green-600" />}
          />
          
          {expandedSections.assigned && (
            <div className="px-2 py-1">
              <NavList
                items={[
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
                ]}
                activeItem={activeFilter}
                onItemClick={handleStatusClick}
                iconColor="text-green-600"
              />
            </div>
          )}

          <Separator className="my-1 opacity-50" />

          {/* Canais */}
          <SectionHeader 
            title="Canais" 
            isExpanded={expandedSections.channels}
            onToggle={() => toggleSection('channels')}
          />
          
          {expandedSections.channels && (
            <div className="px-2 py-1">
              <NavList
                items={channelFilters}
                activeItem={activeChannel}
                onItemClick={handleChannelClick}
              />
            </div>
          )}

          <Separator className="my-1 opacity-50" />

          {/* Grupos Departamentais */}
          <SectionHeader 
            title="Departamentos" 
            color="text-blue-600"
            isExpanded={expandedSections.departments}
            onToggle={() => toggleSection('departments')}
            icon={<Users className="h-4 w-4 text-blue-600" />}
          />
          
          {expandedSections.departments && (
            <div className="px-2 py-1">
              <NavList
                items={[
                  {
                    id: 'sem-grupo',
                    label: 'Sem grupo',
                    icon: Users,
                    param: 'sem-grupo'
                  },
                  {
                    id: 'plataforma-unicv',
                    label: 'PLATAFORMA UNICV',
                    icon: GraduationCap,
                    param: 'plataforma-unicv'
                  },
                  {
                    id: 'primeira-graduacao',
                    label: 'PRIMEIRA GRADUAÇÃO UNICV',
                    icon: GraduationCap,
                    param: 'primeira-graduacao'
                  },
                  {
                    id: 'secretaria-musica',
                    label: 'SECRETÁRIA DE MÚSICA',
                    icon: Star,
                    param: 'secretaria-musica'
                  }
                ]}
                activeItem={activeGroup}
                onItemClick={handleGroupClick}
                iconColor="text-blue-500"
              />
            </div>
          )}

          {/* Grupos de Processos */}
          <SectionHeader 
            title="Processos" 
            color="text-amber-600"
            isExpanded={expandedSections.processes}
            onToggle={() => toggleSection('processes')}
            icon={<History className="h-4 w-4 text-amber-600" />}
          />
          
          {expandedSections.processes && (
            <div className="px-2 py-1">
              <NavList
                items={[
                  {
                    id: 'analise-certificacao',
                    label: 'ANÁLISE CERTIFICAÇÃO',
                    icon: FileCheck,
                    param: 'analise-certificacao'
                  },
                  {
                    id: 'certificacao-andamento',
                    label: 'CERTIFICAÇÃO EM ANDAMENTO',
                    icon: History,
                    param: 'certificacao-andamento'
                  },
                  {
                    id: 'aguardando-diploma',
                    label: 'AGUARDANDO DIPLOMA',
                    icon: Award,
                    param: 'aguardando-diploma'
                  },
                  {
                    id: 'apressamentos',
                    label: 'APRESSAMENTOS',
                    icon: CalendarClock,
                    param: 'apressamentos'
                  }
                ]}
                activeItem={activeGroup}
                onItemClick={handleGroupClick}
                iconColor="text-amber-600"
              />
            </div>
          )}

          {/* Grupos de Suporte */}
          <SectionHeader 
            title="Suporte" 
            color="text-indigo-600"
            isExpanded={expandedSections.support}
            onToggle={() => toggleSection('support')}
            icon={<HelpCircle className="h-4 w-4 text-indigo-600" />}
          />
          
          {expandedSections.support && (
            <div className="px-2 py-1">
              <NavList
                items={[
                  {
                    id: 'suporte',
                    label: 'SUPORTE',
                    icon: HelpCircle,
                    param: 'suporte'
                  },
                  {
                    id: 'financeiro',
                    label: 'FINANCEIRO',
                    icon: CreditCard,
                    param: 'financeiro'
                  },
                  {
                    id: 'desqualificados',
                    label: 'DESQUALIFICADOS',
                    icon: Flag,
                    param: 'desqualificados'
                  }
                ]}
                activeItem={activeGroup}
                onItemClick={handleGroupClick}
                iconColor="text-indigo-600"
              />
            </div>
          )}

          {/* Ambiente de Teste (escondido por padrão) */}
          <SectionHeader 
            title="Ambiente de Teste" 
            color="text-purple-500"
            isExpanded={expandedSections.test}
            onToggle={() => toggleSection('test')}
            icon={<Beaker className="h-4 w-4 text-purple-500" />}
          />
          
          {expandedSections.test && (
            <div className="px-2 py-1">
              <NavList
                items={[
                  {
                    id: 'teste',
                    label: 'Teste',
                    icon: Beaker,
                    param: 'teste'
                  }
                ]}
                activeItem={activeFilter}
                onItemClick={handleStatusClick}
                iconColor="text-purple-500"
              />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Mostrar filtros ativos, se houver */}
      {activeBadges.length > 0 && (
        <div className="p-3 border-t bg-background/70 flex items-center gap-2 flex-wrap">
          <h3 className="text-xs font-medium text-muted-foreground w-full mb-1">Filtros ativos:</h3>
          
          {activeBadges.map((badge) => (
            <Badge 
              key={`${badge.type}-${badge.param}`}
              className="text-xs gap-1 px-2 py-0 h-6 bg-accent text-accent-foreground"
            >
              {badge.label}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => navigateWithFilter(badge.type, null)}
              >
                <Cross className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
} 