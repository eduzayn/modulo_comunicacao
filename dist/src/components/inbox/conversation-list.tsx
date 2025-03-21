'use client'

import { useEffect, useState, useMemo, memo } from 'react'
import { Button, Badge } from '@/components/ui'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronDown, MoreVertical, Star, CheckCheck, Check } from 'lucide-react'
import Image from 'next/image'

interface ConversationListProps {
  selectedId: string | null
  onSelectConversation: (id: string) => void
  isLoading?: boolean
  contactMap: Record<string, {
    name: string
    avatar: string
    channel: string
  }>
}

// Componente de mensagem de status - memoizado para evitar re-renders
const StatusMessage = memo(function StatusMessage({ 
  status, 
  timestamp 
}: { 
  status: 'sent' | 'delivered' | 'read' | 'pending'
  timestamp: Date
}) {
  const iconMap = {
    sent: <Check className="h-3 w-3 text-muted-foreground" />,
    delivered: <CheckCheck className="h-3 w-3 text-muted-foreground" />,
    read: <CheckCheck className="h-3 w-3 text-primary" />,
    pending: null
  }
  
  const timeString = useMemo(() => {
    return format(timestamp, 'HH:mm', { locale: ptBR })
  }, [timestamp])
  
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      {iconMap[status]}
      <span>{timeString}</span>
    </div>
  )
})

// Skeleton loader para quando estiver carregando - memoizado pois é estático
const ConversationSkeleton = memo(function ConversationSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 cursor-pointer">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="flex items-center justify-between mt-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  )
})

// Item individual de conversa - memoizado para reduzir renders
interface ConversationItemProps {
  conversation: {
    id: string
    contact: string
    lastMessage: string
    timestamp: Date
    unread: number
    status: 'sent' | 'delivered' | 'read' | 'pending'
    isStarred?: boolean
    attachmentType?: 'image' | 'audio' | 'file'
  }
  isSelected: boolean
  onSelect: () => void
  contactDetails: {
    name: string
    avatar: string
    channel: string
  }
}

const ConversationItem = memo(function ConversationItem({
  conversation,
  isSelected,
  onSelect,
  contactDetails
}: ConversationItemProps) {
  // Manipuladores de evento
  const handleSelect = () => {
    onSelect()
  }
  
  const handleStar = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Implementar lógica para favoritar
    console.log('Star clicked')
  }
  
  const handleOptions = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Implementar lógica para mostrar opções
    console.log('Options clicked')
  }
  
  const formattedTime = useMemo(() => {
    // Formatar o timestamp com date-fns
    return format(conversation.timestamp, 'HH:mm', { locale: ptBR })
  }, [conversation.timestamp])

  // Conteúdo de mensagem baseado no tipo de anexo
  const messageContent = useMemo(() => {
    if (conversation.attachmentType === 'image') {
      return (
        <span className="flex items-center gap-1 text-primary/80">
          <Image 
            src="/icons/image.svg" 
            alt="Image" 
            width={14} 
            height={14} 
            className="opacity-70"
          />
          Imagem
        </span>
      )
    } else if (conversation.attachmentType === 'audio') {
      return (
        <span className="flex items-center gap-1 text-primary/80">
          <Image 
            src="/icons/audio.svg" 
            alt="Audio" 
            width={14} 
            height={14}
            className="opacity-70"
          />
          Áudio
        </span>
      )
    } else if (conversation.attachmentType === 'file') {
      return (
        <span className="flex items-center gap-1 text-primary/80">
          <Image 
            src="/icons/file.svg" 
            alt="File" 
            width={14} 
            height={14}
            className="opacity-70"
          />
          Arquivo
        </span>
      )
    } else {
      return conversation.lastMessage
    }
  }, [conversation.attachmentType, conversation.lastMessage])

  return (
    <div 
      className={cn(
        "flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 relative",
        isSelected && "bg-muted"
      )}
      onClick={handleSelect}
    >
      {/* Indicador de não lido */}
      {conversation.unread > 0 && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
      )}
      
      {/* Avatar com indicador de canal */}
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={contactDetails.avatar} alt={contactDetails.name} />
          <AvatarFallback>{contactDetails.name[0]}</AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 rounded-full p-[3px] bg-background">
          <div 
            className={cn(
              "w-3 h-3 rounded-full border border-background", 
              contactDetails.channel === 'whatsapp' && "bg-green-500",
              contactDetails.channel === 'instagram' && "bg-pink-500",
              contactDetails.channel === 'facebook' && "bg-blue-600",
              contactDetails.channel === 'email' && "bg-blue-400"
            )}
          />
        </div>
      </div>
      
      {/* Informações da conversa */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className={cn(
            "text-sm font-medium truncate",
            conversation.unread > 0 && "font-semibold"
          )}>
            {contactDetails.name}
          </h3>
          <div className="flex items-center gap-1">
            {conversation.status ? (
              <StatusMessage status={conversation.status} timestamp={conversation.timestamp} />
            ) : (
              <span className="text-xs text-muted-foreground">{formattedTime}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-0.5">
          <p className={cn(
            "text-xs truncate text-muted-foreground max-w-[180px]",
            conversation.unread > 0 && "text-foreground font-medium"
          )}>
            {messageContent}
          </p>
          
          <div className="flex items-center">
            {conversation.unread > 0 && (
              <Badge className="h-5 w-5 flex items-center justify-center rounded-full p-0 mr-1">
                {conversation.unread}
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-6 w-6 rounded-full opacity-0 group-hover:opacity-100",
                conversation.isStarred && "opacity-100"
              )}
              onClick={handleStar}
            >
              <Star
                className={cn(
                  "h-3.5 w-3.5",
                  conversation.isStarred && "fill-yellow-400 text-yellow-400"
                )}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
})

// Componente principal da lista de conversas
export default function ConversationList({
  selectedId,
  onSelectConversation,
  isLoading,
  contactMap
}: ConversationListProps) {
  // Usando useMemo para criar as conversas mockadas apenas uma vez
  const mockConversations = useMemo(() => [
    {
      id: '1',
      contact: 'user1',
      lastMessage: 'Bom dia, gostaria de saber mais sobre o curso de Administração.',
      timestamp: new Date('2023-07-16T09:35:00'),
      unread: 2,
      status: 'read' as const
    },
    {
      id: '2',
      contact: 'user2',
      lastMessage: 'Enviou um anexo',
      timestamp: new Date('2023-07-16T08:23:00'),
      unread: 0,
      status: 'delivered' as const,
      attachmentType: 'image' as const
    },
    {
      id: '3',
      contact: 'user3',
      lastMessage: 'Quais são os requisitos para o curso de Direito?',
      timestamp: new Date('2023-07-15T22:15:00'),
      unread: 0,
      status: 'read' as const,
      isStarred: true
    },
    {
      id: '4',
      contact: 'user4',
      lastMessage: 'Enviou um anexo',
      timestamp: new Date('2023-07-15T18:05:00'),
      unread: 0,
      status: 'sent' as const,
      attachmentType: 'audio' as const
    },
    {
      id: '5',
      contact: 'user5',
      lastMessage: 'Ok, obrigado pela informação.',
      timestamp: new Date('2023-07-15T15:47:00'),
      unread: 0,
      status: 'delivered' as const
    },
    {
      id: '6',
      contact: 'user6',
      lastMessage: 'Enviou um anexo',
      timestamp: new Date('2023-07-15T14:30:00'),
      unread: 0,
      status: 'read' as const,
      attachmentType: 'file' as const
    },
    {
      id: '7',
      contact: 'user7',
      lastMessage: 'Qual o valor do curso?',
      timestamp: new Date('2023-07-15T11:20:00'),
      unread: 0,
      status: 'read' as const
    },
    {
      id: '8',
      contact: 'user8',
      lastMessage: 'Quanto tempo dura o curso de Psicologia?',
      timestamp: new Date('2023-07-14T23:15:00'),
      unread: 0,
      isStarred: true,
      status: 'read' as const
    },
    {
      id: '9',
      contact: 'user9',
      lastMessage: 'Preciso de mais informações sobre os horários das aulas.',
      timestamp: new Date('2023-07-14T19:40:00'),
      unread: 0,
      status: 'read' as const
    },
    {
      id: '10',
      contact: 'user10',
      lastMessage: 'Como faço para me inscrever no processo seletivo?',
      timestamp: new Date('2023-07-14T14:25:00'),
      unread: 0,
      status: 'read' as const
    }
  ], [])

  return (
    <div className="h-full flex flex-col border-r">
      {/* Cabeçalho */}
      <div className="p-3 border-b flex items-center justify-between bg-background/60 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-sm font-medium">Conversas</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreVertical className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <ConversationSkeleton />
        ) : (
          <div className="group">
            {mockConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedId === conversation.id}
                onSelect={() => onSelectConversation(conversation.id)}
                contactDetails={contactMap[conversation.contact] || {
                  name: 'Usuário desconhecido',
                  avatar: '',
                  channel: 'whatsapp'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}