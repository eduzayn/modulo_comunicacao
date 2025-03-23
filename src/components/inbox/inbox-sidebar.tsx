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
  
  // Filtros de status disponíveis
  const statusFilters = useMemo(() => [
    { id: 'all', label: 'Todas', icon: Inbox, param: null, count: '65' },
    { id: 'unassigned', label: 'Não atribuídas', icon: AlertCircle, param: 'unassigned', count: '12', color: 'text-red-500' },
    { id: 'mine', label: 'Minhas', icon: User, param: 'mine', count: '24' },
  ], [])

  // Filtros de status
  const statusTypeFilters = useMemo(() => [
    { id: 'all-status', label: 'Todas', icon: Inbox, param: null },
    { id: 'open', label: 'Abertas', icon: MessageSquare, param: 'open', count: '36' },
    { id: 'resolved', label: 'Resolvidas', icon: FileCheck, param: 'resolved', count: '29' },
  ], [])

  // Filtros de canal
  const channelFilters = useMemo(() => [
    { id: 'all-channels', label: 'Todos os canais', icon: MessageSquare, param: null },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, param: 'whatsapp', count: '28' },
    { id: 'email', label: 'Email', icon: Mail, param: 'email', count: '14' },
    { id: 'facebook', label: 'Facebook', icon: Facebook, param: 'facebook', count: '8' },
    { id: 'instagram', label: 'Instagram', icon: Instagram, param: 'instagram', count: '10' },
  ], [])
  
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
        findLabel(statusTypeFilters, activeFilter) || 
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
  }, [activeFilter, activeChannel, activeGroup, statusFilters, statusTypeFilters, channelFilters])

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

      {/* Filtros principais conforme documentação */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Filtros de Atribuição */}
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground px-2">Atribuição</h3>
            <NavList
              items={statusFilters}
              activeItem={activeFilter}
              onItemClick={handleStatusClick}
              iconColor="text-primary/80"
            />
          </div>
          
          <Separator className="my-1 opacity-50" />
          
          {/* Filtros de Status */}
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground px-2">Status</h3>
            <NavList
              items={statusTypeFilters}
              activeItem={activeFilter}
              onItemClick={handleStatusClick}
            />
          </div>
          
          <Separator className="my-1 opacity-50" />
          
          {/* Filtros de Canais */}
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground px-2">Canais</h3>
            <NavList
              items={channelFilters}
              activeItem={activeChannel}
              onItemClick={(param) => navigateWithFilter('channel', param)}
            />
          </div>
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