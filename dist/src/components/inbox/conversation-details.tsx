'use client'

import React, { useState } from 'react'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  User,
  Heart,
  Tag,
  MessageSquare,
  ChevronRight,
  Edit2,
  Plus,
  Trash2,
  Star,
  UserCircle,
  Package,
  BarChart2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Interfaces
interface Conversation {
  id: string
  status?: 'active' | 'pending' | 'closed'
  channelData?: {
    type: string
    name?: string
    avatar?: string
  }
}

interface Task {
  id: string
  title: string
  dueDate: Date
  status: 'pending' | 'completed' | 'overdue'
}

interface Deal {
  id: string
  title: string
  stage: string
  value: number
  probability: number
  expectedCloseDate: Date
}

interface Tag {
  id: string
  name: string
  color: string
}

interface ContactHistoryItem {
  id: string
  type: 'message' | 'call' | 'email' | 'note' | 'meeting'
  content: string
  date: Date
  channel?: string
}

interface ConversationDetailsProps {
  contactId?: string
  contactName?: string
  conversation?: Conversation
  onSendMessage?: (message: string, attachments: any[]) => Promise<void>
}

const dummyTags: Tag[] = [
  { id: '1', name: 'Interessado', color: 'bg-green-100 text-green-800' },
  { id: '2', name: 'Novo Lead', color: 'bg-blue-100 text-blue-800' },
  { id: '3', name: 'Aguardando Retorno', color: 'bg-amber-100 text-amber-800' }
]

const dummyTasks: Task[] = [
  { id: '1', title: 'Enviar proposta comercial', dueDate: new Date(Date.now() + 86400000), status: 'pending' },
  { id: '2', title: 'Agendar demonstração', dueDate: new Date(Date.now() + 86400000 * 3), status: 'pending' },
  { id: '3', title: 'Fazer follow-up por telefone', dueDate: new Date(Date.now() - 86400000), status: 'overdue' }
]

const dummyDeals: Deal[] = [
  { 
    id: '1', 
    title: 'Plano Básico Mensalidade', 
    stage: 'Proposta', 
    value: 1200, 
    probability: 60,
    expectedCloseDate: new Date(Date.now() + 86400000 * 7)
  }
]

const dummyHistory: ContactHistoryItem[] = [
  {
    id: '1',
    type: 'message',
    content: 'Olá, gostaria de saber mais sobre os planos disponíveis',
    date: new Date(Date.now() - 86400000 * 2),
    channel: 'whatsapp'
  },
  {
    id: '2',
    type: 'note',
    content: 'Cliente interessado no plano básico, mas quer negociar desconto',
    date: new Date(Date.now() - 86400000),
  },
  {
    id: '3',
    type: 'call',
    content: 'Ligação para esclarecer dúvidas sobre o contrato',
    date: new Date(Date.now() - 86400000 / 2),
  }
]

export default function ConversationDetails({ 
  contactId, 
  contactName = "Visitante", 
  conversation,
  onSendMessage 
}: ConversationDetailsProps) {
  const [isCreateDealOpen, setIsCreateDealOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  const [replyText, setReplyText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [contactDetails] = useState({
    id: contactId || '1',
    name: contactName || 'Visitante',
    email: 'cliente@exemplo.com',
    phone: '+55 (83) 8233-2493',
    address: 'Rua Exemplo, 123 - Cidade',
    source: 'WhatsApp',
    createdAt: new Date(Date.now() - 86400000 * 30),
    lastContact: new Date(Date.now() - 86400000),
    stage: 'Lead Qualificado',
    assignedTo: 'Juliana Mendes',
    tags: dummyTags,
    company: 'Empresa Exemplo Ltda.',
    position: 'Gerente de Marketing',
    website: 'www.exemplo.com.br',
    socialMedia: {
      linkedin: 'linkedin.com/in/exemplo',
      facebook: 'facebook.com/exemplo'
    }
  })
  
  const currentChannel = conversation?.channelData?.type || 'whatsapp'
  
  // Informações do canal atual
  const channelInfo = {
    whatsapp: {
      name: 'WhatsApp',
      color: 'bg-green-500/10 text-green-600',
      icon: <MessageSquare className="w-3 h-3" />
    },
    facebook: {
      name: 'Facebook',
      color: 'bg-blue-500/10 text-blue-600',
      icon: <MessageSquare className="w-3 h-3" />
    },
    instagram: {
      name: 'Instagram',
      color: 'bg-pink-500/10 text-pink-600',
      icon: <MessageSquare className="w-3 h-3" />
    },
    email: {
      name: 'Email',
      color: 'bg-purple-500/10 text-purple-600',
      icon: <Mail className="w-3 h-3" />
    }
  }[currentChannel] || {
    name: 'Chat',
    color: 'bg-primary/10 text-primary',
    icon: <MessageSquare className="w-3 h-3" />
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

  const formatDate = (date: Date) => {
    return format(date, 'dd MMM yyyy', { locale: ptBR })
  }

  const formatDateTime = (date: Date) => {
    return format(date, 'dd MMM yyyy - HH:mm', { locale: ptBR })
  }

  const renderTagBadge = (tag: Tag) => (
    <Badge 
      key={tag.id} 
      className={cn("text-xs font-normal", tag.color)}
    >
      {tag.name}
    </Badge>
  )
  
  // Renderização de itens de histórico
  const renderHistoryItem = (item: ContactHistoryItem) => {
    const iconMap = {
      message: <MessageSquare className="h-3.5 w-3.5" />,
      call: <Phone className="h-3.5 w-3.5" />,
      email: <Mail className="h-3.5 w-3.5" />,
      note: <Edit2 className="h-3.5 w-3.5" />,
      meeting: <Calendar className="h-3.5 w-3.5" />
    }
    
    const bgColorMap = {
      message: 'bg-blue-50',
      call: 'bg-green-50',
      email: 'bg-purple-50',
      note: 'bg-amber-50',
      meeting: 'bg-indigo-50'
    }
    
    const textColorMap = {
      message: 'text-blue-600',
      call: 'text-green-600',
      email: 'text-purple-600',
      note: 'text-amber-600',
      meeting: 'text-indigo-600'
    }
    
    return (
      <div key={item.id} className="mb-3 last:mb-0">
        <div className="flex gap-2">
          <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center", bgColorMap[item.type])}>
            <div className={textColorMap[item.type]}>
              {iconMap[item.type]}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-1">
              <div className="font-medium text-sm capitalize">{item.type}</div>
              <div className="text-xs text-muted-foreground">{format(item.date, 'dd/MM - HH:mm')}</div>
            </div>
            <div className="text-sm">{item.content}</div>
            {item.channel && (
              <Badge variant="outline" className="mt-1 text-xs">
                {item.channel}
              </Badge>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Renderização de tarefas
  const renderTaskItem = (task: Task) => {
    const isOverdue = task.status === 'overdue'
    const isPending = task.status === 'pending'
    const isCompleted = task.status === 'completed'
    
    const statusClasses = {
      completed: 'bg-green-50 text-green-800 border-green-200',
      pending: 'bg-blue-50 text-blue-800 border-blue-200',
      overdue: 'bg-red-50 text-red-800 border-red-200'
    }
    
    return (
      <div key={task.id} className="mb-3 last:mb-0">
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 mt-0.5 flex-shrink-0">
            <input 
              type="checkbox" 
              className="h-4 w-4 rounded border-gray-300 text-primary" 
              checked={isCompleted}
              readOnly
            />
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm">{task.title}</div>
            <div className="flex items-center mt-1">
              <Clock className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {formatDate(task.dueDate)}
              </span>
              <Badge className={cn("ml-2 text-xs", statusClasses[task.status])}>
                {isOverdue ? 'Atrasada' : isPending ? 'Pendente' : 'Concluída'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Renderização de negociações
  const renderDealItem = (deal: Deal) => {
    return (
      <div key={deal.id} className="bg-card shadow-sm p-3 rounded-lg border mb-3 last:mb-0">
        <div className="flex items-start justify-between mb-2">
          <div className="font-medium">{deal.title}</div>
          <Badge variant="outline" className="font-normal">
            {deal.stage}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
          <div className="flex items-center">
            <Package className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
            <span className="text-muted-foreground">Valor:</span>
          </div>
          <div className="font-medium">R$ {deal.value.toLocaleString('pt-BR')}</div>
          
          <div className="flex items-center">
            <BarChart2 className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
            <span className="text-muted-foreground">Prob.:</span>
          </div>
          <div className="font-medium">{deal.probability}%</div>
          
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
            <span className="text-muted-foreground">Previsão:</span>
          </div>
          <div className="font-medium">{formatDate(deal.expectedCloseDate)}</div>
        </div>
      </div>
    )
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
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-6">
          {/* Informações de Contato */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12 ring-1 ring-primary/10">
                {conversation?.channelData?.avatar && (
                  <AvatarImage src={conversation.channelData.avatar} alt={contactName || 'Cliente'} />
                )}
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary">
                  {contactName?.slice(0, 1).toUpperCase() || 'C'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-base">{contactName || 'Cliente'}</h3>
                  <Button variant="ghost" size="icon-sm" className="h-7 w-7 rounded-full">
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge variant="secondary" className="text-[10px] rounded-full px-1.5 py-0">
                    {contactDetails.stage}
                  </Badge>
                  {currentChannel && (
                    <Badge variant="outline" className="text-[10px] rounded-full px-1.5 py-0">
                      {channelInfo.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="info" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 h-8 mb-4 text-xs">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="hist">Histórico</TabsTrigger>
                <TabsTrigger value="tasks">Tarefas</TabsTrigger>
                <TabsTrigger value="deals">Negócios</TabsTrigger>
              </TabsList>
              
              {/* Tab de Informações */}
              <TabsContent value="info" className="mt-0">
                <div className="space-y-4">
                  {/* Dados de contato */}
                  <Card className="shadow-none">
                    <CardHeader className="p-3 pb-1.5">
                      <CardTitle className="text-sm flex items-center">
                        <User className="w-4 h-4 mr-1.5" />
                        Dados de Contato
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 text-sm">
                      <div className="grid grid-cols-[20px_1fr] gap-x-2 gap-y-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <div>{contactDetails.phone}</div>
                        
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <div>{contactDetails.email}</div>
                        
                        {contactDetails.address && (
                          <>
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <div>{contactDetails.address}</div>
                          </>
                        )}
                        
                        {contactDetails.company && (
                          <>
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <div>
                              {contactDetails.company}
                              {contactDetails.position && (
                                <span className="text-xs text-muted-foreground block">
                                  {contactDetails.position}
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Informações adicionais */}
                  <Card className="shadow-none">
                    <CardHeader className="p-3 pb-1.5">
                      <CardTitle className="text-sm flex items-center">
                        <Clock className="w-4 h-4 mr-1.5" />
                        Informações Adicionais
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 text-sm">
                      <div className="grid grid-cols-[1fr_auto] gap-2">
                        <div className="text-muted-foreground">Origem</div>
                        <div>{contactDetails.source}</div>
                        
                        <div className="text-muted-foreground">Cliente desde</div>
                        <div>{formatDate(contactDetails.createdAt)}</div>
                        
                        <div className="text-muted-foreground">Último contato</div>
                        <div>{formatDate(contactDetails.lastContact)}</div>
                        
                        <div className="text-muted-foreground">Responsável</div>
                        <div>{contactDetails.assignedTo}</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Tags */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium flex items-center">
                        <Tag className="w-4 h-4 mr-1.5" />
                        Tags
                      </h4>
                      <Button variant="ghost" size="icon-sm" className="h-6 w-6 rounded-full">
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {contactDetails.tags.map(renderTagBadge)}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Tab de Histórico */}
              <TabsContent value="hist" className="mt-0 space-y-3">
                <div className="space-y-3 divide-y">
                  {dummyHistory.map(renderHistoryItem)}
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Carregar mais
                </Button>
              </TabsContent>
              
              {/* Tab de Tarefas */}
              <TabsContent value="tasks" className="mt-0">
                <div className="mb-3 space-y-3 divide-y">
                  {dummyTasks.map(renderTaskItem)}
                </div>
                
                <Button variant="outline" size="sm" className="w-full flex items-center text-xs mb-2">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Nova Tarefa
                </Button>
              </TabsContent>
              
              {/* Tab de Negócios */}
              <TabsContent value="deals" className="mt-0">
                <div className="mb-3">
                  {dummyDeals.map(renderDealItem)}
                </div>
                
                <Button variant="outline" size="sm" className="w-full flex items-center text-xs">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Novo Negócio
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ScrollArea>
      
      {/* Ações rápidas */}
      <div className="p-3 border-t bg-muted/20">
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" className="text-xs h-9">
            <Phone className="h-3.5 w-3.5 mr-1.5" />
            Ligar
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-9">
            <Mail className="h-3.5 w-3.5 mr-1.5" />
            Email
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-9">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            Agendar
          </Button>
        </div>
      </div>
    </div>
  )
} 