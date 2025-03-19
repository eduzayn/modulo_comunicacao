'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  User,
  MoreHorizontal,
  Phone,
  Mail,
  DollarSign
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CreateDealForm } from '@/components/crm/create-deal-form'
import { useState } from 'react'

const agents = [
  {
    id: '1',
    name: 'Não atribuído',
    avatar: null
  },
  {
    id: '2',
    name: 'Ana Lucia Moreira Gonçalves',
    avatar: '/avatars/ana.png'
  },
  {
    id: '3',
    name: 'Erick Moreira',
    avatar: '/avatars/erick.png'
  },
  {
    id: '4',
    name: 'Daniela Tovar',
    avatar: '/avatars/daniela.png'
  }
]

interface ConversationDetailsProps {
  contactId: string
  contactName: string
}

export function ConversationDetails({ contactId, contactName }: ConversationDetailsProps) {
  const [isCreateDealOpen, setIsCreateDealOpen] = useState(false)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Atribuir</h2>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <Input 
          type="search"
          placeholder="Pesquisar"
          className="h-9"
        />
      </div>

      {/* Agents List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
            >
              {agent.avatar ? (
                <Avatar>
                  <AvatarImage src={agent.avatar} />
                  <AvatarFallback>
                    {agent.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              )}
              <span className="flex-1">{agent.name}</span>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Contact Info */}
      <div className="p-4 border-t space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/avatars/customer.png" />
            <AvatarFallback>OZ</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{contactName}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary">Pré-Atendimento</Badge>
              <Badge variant="outline">Negociação</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4" />
            <span>+55 (83) 8233-2493</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4" />
            <span>ozenira@email.com</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            Resolver
          </Button>
          <Button variant="outline">
            <User className="h-4 w-4 mr-2" />
            Rian
          </Button>
        </div>

        <Dialog open={isCreateDealOpen} onOpenChange={setIsCreateDealOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <DollarSign className="h-4 w-4 mr-2" />
              Criar negociação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <CreateDealForm 
              contactId={contactId}
              contactName={contactName}
              onSuccess={() => setIsCreateDealOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 