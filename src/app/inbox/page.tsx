'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@supabase/supabase-js'
import { differenceInDays, format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  Users, 
  MessageSquare, 
  Search, 
  Inbox, 
  PanelLeft,
  Filter,
  Loader2,
  Clock
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ConversationView } from './components/conversation-view'
import { useConversationEvents } from '@/hooks/useConversationEvents'
import { logger } from '@/lib/logger'

// Cliente Supabase para operações no banco de dados
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Tipo para conversas
interface Conversation {
  id: string
  channel_id: string
  channel_type: string
  status: string
  customer_name: string
  customer_email?: string
  customer_phone?: string
  assigned_to?: string
  assigned_name?: string
  created_at: string
  updated_at: string
  last_message_at: string
  last_message_content?: string
  unread_count: number
}

export default function InboxPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all')
  const [isMobileViewOpen, setIsMobileViewOpen] = useState(false)
  
  const { useConversationUpdates } = useConversationEvents()
  
  // Consulta para obter a lista de conversas
  const {
    data: conversations,
    isLoading,
    error,
    refetch
  } = useQuery<Conversation[]>({
    queryKey: ['conversations', statusFilter],
    queryFn: async () => {
      try {
        let query = supabase
          .from('conversations')
          .select('*')
          .order('last_message_at', { ascending: false })
        
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter)
        }
        
        const { data, error } = await query
        
        if (error) throw error
        return data
      } catch (err) {
        logger.error('Erro ao carregar conversas', { error: err })
        throw err
      }
    }
  })
  
  // Escutar atualizações em todas as conversas
  useConversationUpdates('all', () => {
    // Atualizar a lista de conversas quando houver alguma modificação
    refetch()
  })
  
  // Filtragem de conversas pelo termo de busca
  const filteredConversations = conversations?.filter(conversation => {
    const searchLower = searchTerm.toLowerCase()
    return (
      conversation.customer_name.toLowerCase().includes(searchLower) ||
      (conversation.customer_email?.toLowerCase().includes(searchLower)) ||
      (conversation.customer_phone?.includes(searchTerm)) ||
      (conversation.last_message_content?.toLowerCase().includes(searchLower))
    )
  })
  
  // Formatação de data relativa para exibição
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffDays = differenceInDays(today, date)
    
    if (diffDays === 0) {
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
    } else if (diffDays < 7) {
      return format(date, "EEEE 'às' HH:mm", { locale: ptBR })
    } else {
      return format(date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })
    }
  }
  
  // Função para selecionar uma conversa
  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id)
    setIsMobileViewOpen(true)
  }
  
  // Renderizar o item da conversa
  const renderConversationItem = (conversation: Conversation) => {
    const isSelected = conversation.id === selectedConversationId
    const hasUnread = conversation.unread_count > 0
    
    return (
      <div 
        key={conversation.id}
        onClick={() => handleSelectConversation(conversation.id)}
        className={`
          border-b p-4 hover:bg-muted/50 cursor-pointer transition-colors
          ${isSelected ? 'bg-muted' : ''}
          ${hasUnread ? 'border-l-4 border-l-primary' : ''}
        `}
      >
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.customer_name)}&background=random`} />
            <AvatarFallback>{conversation.customer_name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <div className="font-medium truncate">{conversation.customer_name}</div>
              <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                {formatRelativeDate(conversation.last_message_at)}
              </div>
            </div>
            
            <div className="flex gap-2 mb-1">
              <Badge variant={conversation.status === 'open' ? 'default' : 'secondary'} className="text-xs">
                {conversation.status === 'open' ? 'Em aberto' : 'Fechado'}
              </Badge>
              
              {conversation.channel_type && (
                <Badge variant="outline" className="text-xs">
                  {conversation.channel_type === 'whatsapp' ? 'WhatsApp' : 
                   conversation.channel_type === 'email' ? 'Email' : 
                   conversation.channel_type}
                </Badge>
              )}
              
              {hasUnread && (
                <Badge variant="destructive" className="text-xs">
                  {conversation.unread_count} não lida{conversation.unread_count > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            
            {conversation.last_message_content && (
              <div className="text-sm text-muted-foreground truncate">
                {conversation.last_message_content}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Painel lateral - Lista de conversas */}
      <div className="w-full md:w-[350px] border-r flex flex-col">
        {/* Cabeçalho do painel */}
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold flex items-center">
              <Inbox className="mr-2 h-5 w-5" />
              Caixa de entrada
            </h1>
            
            {/* Botão para visualização móvel */}
            {selectedConversationId && (
              <Button 
                variant="outline" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsMobileViewOpen(true)}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          {/* Campo de busca */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar conversa..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Filtros */}
        <div className="p-2 border-b flex items-center gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
            className="flex-1"
          >
            Todas
          </Button>
          <Button
            variant={statusFilter === 'open' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('open')}
            className="flex-1"
          >
            Em aberto
          </Button>
          <Button
            variant={statusFilter === 'closed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('closed')}
            className="flex-1"
          >
            Fechadas
          </Button>
        </div>
        
        {/* Lista de conversas */}
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center h-full p-4">
              <p className="text-destructive mb-2">Erro ao carregar conversas</p>
              <Button onClick={() => refetch()}>Tentar novamente</Button>
            </div>
          ) : filteredConversations?.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full p-4 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="font-medium mb-1">Nenhuma conversa encontrada</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm 
                  ? 'Tente ajustar os termos da busca' 
                  : statusFilter === 'all' 
                    ? 'Você não tem nenhuma conversa ainda'
                    : `Não há conversas ${statusFilter === 'open' ? 'em aberto' : 'fechadas'}`
                }
              </p>
            </div>
          ) : (
            filteredConversations?.map(renderConversationItem)
          )}
        </ScrollArea>
      </div>
      
      {/* Área principal - Visualização da conversa selecionada */}
      <div className="hidden md:block flex-1">
        {selectedConversationId ? (
          <ConversationView 
            conversationId={selectedConversationId}
            onBack={() => setSelectedConversationId(null)}
          />
        ) : (
          <div className="flex flex-col justify-center items-center h-full p-4 text-center">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">Selecione uma conversa</h2>
            <p className="text-muted-foreground max-w-md">
              Escolha uma conversa da lista para visualizar e responder mensagens
            </p>
          </div>
        )}
      </div>
      
      {/* Sheet para visualização móvel */}
      <Sheet open={isMobileViewOpen} onOpenChange={setIsMobileViewOpen}>
        <SheetContent side="right" className="p-0 w-full sm:max-w-full">
          {selectedConversationId && (
            <ConversationView 
              conversationId={selectedConversationId}
              onBack={() => setIsMobileViewOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
} 