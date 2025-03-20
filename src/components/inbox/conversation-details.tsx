'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Phone, Mail, Info, Smile, Upload, Paperclip, Send, Search } from 'lucide-react'
import {
  CheckCircle,
  User,
  MoreHorizontal,
  DollarSign,
  MessageSquare,
  Facebook,
  Instagram,
  Loader2
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CreateDealForm } from '@/components/crm/create-deal-form'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

// Definição dos tipos de canais
type ChannelType = 'whatsapp' | 'email' | 'facebook' | 'instagram' | 'chat' | 'sms'

// Interface para as propriedades do componente
interface ConversationDetailsProps {
  contactId: string
  contactName?: string
  conversation?: {
    id: string
    channel: ChannelType
    channelData?: Record<string, any>
  }
  onSendMessage?: (message: string, attachments?: File[]) => Promise<void>
}

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

// Função para obter o ícone e cor do canal
const getChannelInfo = (channelType: ChannelType) => {
  switch (channelType) {
    case 'whatsapp':
      return { 
        icon: <MessageSquare className="h-5 w-5" />, 
        color: 'bg-green-500 text-white',
        name: 'WhatsApp'
      }
    case 'facebook':
      return { 
        icon: <Facebook className="h-5 w-5" />, 
        color: 'bg-blue-600 text-white',
        name: 'Facebook'
      }
    case 'instagram':
      return { 
        icon: <Instagram className="h-5 w-5" />, 
        color: 'bg-pink-600 text-white',
        name: 'Instagram'
      }
    case 'email':
      return { 
        icon: <Mail className="h-5 w-5" />, 
        color: 'bg-blue-500 text-white',
        name: 'Email'
      }
    case 'sms':
      return { 
        icon: <MessageSquare className="h-5 w-5" />, 
        color: 'bg-purple-500 text-white',
        name: 'SMS'
      }
    default:
      return { 
        icon: <MessageSquare className="h-5 w-5" />, 
        color: 'bg-gray-500 text-white',
        name: 'Chat'
      }
  }
}

export default function ConversationDetails({ 
  contactId, 
  contactName = "Visitante", 
  conversation,
  onSendMessage 
}: ConversationDetailsProps) {
  const [isCreateDealOpen, setIsCreateDealOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedTab, setSelectedTab] = useState('info')
  const [isLoading, setIsLoading] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [agentId, setAgentId] = useState('1')
  const [replyText, setReplyText] = useState('')
  const [quickResponses, setQuickResponses] = useState(['Olá!', 'Como posso ajudar?', 'Tudo bem?'])
  const [isSending, setIsSending] = useState(false)

  // Define o canal atual ou usa um padrão
  const currentChannel = conversation?.channel || 'chat'
  const channelInfo = getChannelInfo(currentChannel)

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return
    
    setIsLoading(true)
    try {
      if (onSendMessage) {
        await onSendMessage(message, attachments)
      }
      setMessage('')
      setAttachments([])
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files))
    }
  }

  const getPlaceholder = () => {
    switch (currentChannel) {
      case 'facebook':
        return 'Escreva uma resposta ao comentário...'
      case 'instagram':
        return 'Escreva uma resposta...'
      case 'whatsapp':
        return 'Escreva uma mensagem...'
      case 'email':
        return 'Escreva um email...'
      default:
        return 'Escreva uma mensagem...'
    }
  }

  const handleSend = async () => {
    if (!replyText.trim()) return
    
    setIsSending(true)
    try {
      if (onSendMessage) {
        await onSendMessage(replyText, [])
      }
      setReplyText('')
    } catch (error) {
      console.error('Erro ao enviar resposta:', error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="px-3 py-2 border-b bg-background/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className={`flex items-center justify-center h-6 w-6 rounded-full ${channelInfo.color}`}>
              {channelInfo.icon}
            </div>
            <h3 className="text-sm font-medium">Detalhes</h3>
          </div>
          <Badge variant="outline" className="text-xs px-1.5 py-0.5">{channelInfo.name}</Badge>
        </div>
      </div>

      {/* Corpo */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
        <TabsList className="w-full px-1 pt-1 bg-background/50 rounded-none border-b">
          <TabsTrigger value="info" className="flex-1 rounded-t-lg text-xs py-1">Informações</TabsTrigger>
          <TabsTrigger value="agent" className="flex-1 rounded-t-lg text-xs py-1">Atribuir</TabsTrigger>
          <TabsTrigger value="reply" className="flex-1 rounded-t-lg text-xs py-1">Responder</TabsTrigger>
        </TabsList>

        {/* Tab de Informações */}
        <TabsContent value="info" className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-4">
              {/* Contato */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-1 ring-primary/10">
                    {conversation?.channelData?.avatar && (
                      <AvatarImage src={conversation.channelData.avatar} alt={contactName || 'Cliente'} />
                    )}
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary">
                      {contactName?.slice(0, 1).toUpperCase() || 'C'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-base">{contactName || 'Cliente'}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant="secondary" className="text-[10px] rounded-full px-1.5 py-0">
                        {currentChannel === 'facebook' ? 'Comentário' : 
                         currentChannel === 'instagram' ? 'Instagram' : 
                         'Contato'}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] rounded-full px-1.5 py-0">Atendimento</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 bg-background/50 p-2 rounded-lg">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    <span>+55 (83) 8233-2493</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <span>cliente@email.com</span>
                  </div>
                </div>
              </div>

              {/* Informações do Canal */}
              {currentChannel === 'facebook' && (
                <div className="space-y-1.5 border-t pt-3">
                  <h4 className="font-medium text-xs text-muted-foreground">Detalhes do Facebook</h4>
                  <div className="bg-background/50 p-2 rounded-lg text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Facebook className="h-3.5 w-3.5 text-blue-600" />
                      <p>Página: {conversation?.channelData?.pageName || 'Minha Página'}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
                      <p>Post: {conversation?.channelData?.postTitle || 'Publicação'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ações para o contato */}
              <div className="space-y-2 border-t pt-3">
                <h4 className="font-medium text-xs text-muted-foreground">Ações</h4>
                <div className="flex gap-1.5">
                  <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-8 text-xs">
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                    Resolver
                  </Button>
                  <Dialog open={isCreateDealOpen} onOpenChange={setIsCreateDealOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1 h-8 text-xs">
                        <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                        Criar negociação
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <CreateDealForm 
                        contactId={contactId}
                        contactName={contactName || ''}
                        onSuccess={() => setIsCreateDealOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Tab de Atribuição */}
        <TabsContent value="agent" className="flex-1 overflow-hidden flex flex-col">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-[9px] text-muted-foreground" />
              <Input 
                type="search"
                placeholder="Pesquisar agentes"
                className="h-8 pl-8 text-xs bg-background/60"
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-1.5">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  className={cn(
                    "flex items-center gap-2 w-full text-left p-2 rounded-lg mb-0.5 transition-colors text-xs",
                    agent.id === agentId ? "bg-accent" : "hover:bg-accent/50"
                  )}
                  onClick={() => setAgentId(agent.id)}
                >
                  <Avatar className="h-8 w-8">
                    {agent.avatar ? (
                      <AvatarImage src={agent.avatar} alt={agent.name} />
                    ) : null}
                    <AvatarFallback className={agent.id === '1' ? 'bg-muted' : undefined}>
                      {agent.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{agent.name}</p>
                    {agent.id === '1' && (
                      <p className="text-[10px] text-muted-foreground">Sem agente atribuído</p>
                    )}
                  </div>
                  {agent.id === agentId && (
                    <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="p-2 border-t bg-background/60">
            <Button className="w-full h-8 text-xs">Atribuir Agente</Button>
          </div>
        </TabsContent>

        {/* Tab de Resposta */}
        <TabsContent value="reply" className="flex-1 overflow-hidden flex flex-col">
          <div className="p-3 border-b">
            <div className="flex items-center gap-1.5 mb-2">
              <h4 className="text-xs font-medium">Responder</h4>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">{channelInfo.name}</Badge>
            </div>
            <Textarea 
              placeholder="Digite sua mensagem..." 
              className="min-h-20 text-xs bg-background/80 resize-none"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </div>

          <div className="p-1.5 flex-1">
            <div className="flex items-center gap-1.5 p-1">
              <Button variant="ghost" size="icon" className="rounded-full h-7 w-7">
                <Smile className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-7 w-7">
                <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-7 w-7">
                <Upload className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </div>
            
            <div className="px-1.5 mt-1.5">
              <h4 className="text-xs font-medium mb-1.5">Respostas Rápidas</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1.5">
                {quickResponses.map((response, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-1.5 text-xs rounded-lg bg-background hover:bg-accent transition-colors"
                    onClick={() => setReplyText(response)}
                  >
                    {response.length > 60 ? response.substring(0, 60) + '...' : response}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-2 border-t bg-background/60">
            <Button className="w-full h-8 text-xs" disabled={!replyText.trim()} onClick={handleSend}>
              {isSending ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="mr-1.5 h-3.5 w-3.5" />
              )}
              Enviar
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 