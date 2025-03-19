'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, MessageSquare, Phone } from 'lucide-react'
import { ConversationActions } from './conversation-actions'

const conversations = [
  {
    id: '1',
    avatar: '/avatars/01.png',
    name: 'Emerson Carlos Ribeiro',
    status: 'digitando...',
    tags: ['Segunda Graduação', 'Orgânico - Comercial'],
    timestamp: 'agora',
    preview: 'Enviou um áudio',
    hasWhatsapp: true,
    isAudio: true
  },
  {
    id: '2',
    avatar: '/avatars/02.png',
    name: 'Rodrigo Alves',
    tags: ['Segunda Graduação', 'Orgânico - Comercial'],
    timestamp: 'agora',
    preview: 'Rodrigo: Pode',
    hasWhatsapp: true
  },
  {
    id: '3',
    avatar: '/avatars/03.png',
    name: 'Izabella Dias Basso Aragão',
    tags: ['SUPORTE'],
    timestamp: 'agora',
    preview: 'Izabella: Vou tentar aqui',
    hasWhatsapp: true
  }
]

export function ConversationList() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Abertos</h2>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <ConversationActions />
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <Input 
          type="search"
          placeholder="Pesquisar"
          className="h-9"
        />
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="flex items-start gap-3 p-4 hover:bg-accent cursor-pointer"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={conversation.avatar} />
                <AvatarFallback>
                  {conversation.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {conversation.name}
                    </span>
                    {conversation.status && (
                      <span className="text-xs text-muted-foreground">
                        {conversation.status}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {conversation.timestamp}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {conversation.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {conversation.hasWhatsapp && (
                    <MessageSquare className="h-4 w-4 text-green-500" />
                  )}
                  {conversation.isAudio && (
                    <Phone className="h-4 w-4 text-blue-500" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {conversation.preview}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 