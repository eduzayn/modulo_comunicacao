'use client'

import { useState, useEffect, useRef } from 'react'
import { BaseLayout } from '@/components/layout/BaseLayout'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Menu,
  Send,
  Archive,
  Plus,
  MessageSquare,
  Home,
  Paperclip,
  Mic,
  MoreVertical,
  ChevronDown,
  Phone,
  Forward,
  Reply,
  PlayCircle,
  Copy,
  Trash
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip'
import { 
  Chat, 
  Message,
  getInitials,
  formatMessagePreview,
  formatTime,
  generateMockChats,
  generateMockMessages,
  simulateResponse
} from '@/types/chat'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const menuItems = [
  { title: 'Início', href: '/communication', icon: <Home className="h-4 w-4" /> },
  { title: 'Chat', href: '/communication/chat', icon: <MessageSquare className="h-4 w-4" /> }
]

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>(generateMockChats())
  const [activeChat, setActiveChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showContactDetails, setShowContactDetails] = useState(true)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showNewContactDialog, setShowNewContactDialog] = useState(false)
  const [editingContact, setEditingContact] = useState({
    name: '',
    email: '',
    phone: '',
    type: ''
  })
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    type: '',
    message: ''
  })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (activeChat) {
      setMessages(generateMockMessages(activeChat.id))
      setEditingContact({
        name: activeChat.contactName,
        email: activeChat.contactEmail,
        phone: activeChat.contactPhone,
        type: activeChat.contactType
      })
    }
  }, [activeChat])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!message.trim() || !activeChat) return

    const newMessage: Message = {
      id: String(Date.now()),
      content: message,
      sender: 'Você',
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    }

    setMessages(prev => [...prev, newMessage])
    setMessage('')

    // Simular resposta após 1 segundo
    setTimeout(() => {
      const response = simulateResponse(message)
      setMessages(prev => [...prev, response])
    }, 1000)
  }

  const handleNewChat = () => {
    setShowNewContactDialog(true)
  }

  const handleCreateNewContact = () => {
    if (!newContact.name || !newContact.type) return

    const newChat: Chat = {
      id: String(Date.now()),
      contactName: newContact.name,
      contactEmail: newContact.email,
      contactPhone: newContact.phone,
      contactType: newContact.type,
      unreadCount: 0,
      tags: ['novo'],
      status: 'active'
    }

    setChats(prev => [newChat, ...prev])
    setActiveChat(newChat)
    setMessages([])
    setShowNewContactDialog(false)

    // Se houver mensagem inicial, enviar
    if (newContact.message) {
      const initialMessage: Message = {
        id: String(Date.now()),
        content: newContact.message,
        sender: 'Você',
        timestamp: new Date(),
        type: 'text',
        status: 'sent'
      }
      setMessages([initialMessage])

      // Simular resposta após 1 segundo
      setTimeout(() => {
        const response = simulateResponse(newContact.message)
        setMessages(prev => [...prev, response])
      }, 1000)
    }

    // Limpar o formulário
    setNewContact({
      name: '',
      email: '',
      phone: '',
      type: '',
      message: ''
    })
  }

  const handleEditContact = () => {
    if (!activeChat) return

    const updatedChat: Chat = {
      ...activeChat,
      contactName: editingContact.name,
      contactEmail: editingContact.email,
      contactPhone: editingContact.phone,
      contactType: editingContact.type
    }

    setChats(prev =>
      prev.map(chat => (chat.id === activeChat.id ? updatedChat : chat))
    )
    setActiveChat(updatedChat)
    setShowEditDialog(false)
  }

  // Adicionar função para copiar mensagem
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  // Adicionar função para responder mensagem
  const handleReplyMessage = (message: Message) => {
    setMessage(`> ${message.content}\n\n`)
  }

  // Adicionar função para excluir mensagem
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(msg => msg.id !== messageId))
  }

  // Componente de carregamento para a lista de conversas
  function ChatListSkeleton() {
    return (
      <div className="space-y-4 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Componente de carregamento para as mensagens
  function MessagesSkeleton() {
    return (
      <div className="space-y-4 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <BaseLayout module="communication" items={menuItems}>
      <div className="flex flex-col h-screen bg-background">
        <div className="flex-1 flex">
          {/* Sidebar para Mobile */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Conversas</h2>
                      <Button onClick={handleNewChat} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="flex-1">
                    {isLoading ? (
                      <ChatListSkeleton />
                    ) : (
                      <div className="space-y-2 p-2">
                        {chats.map((chat) => (
                          <div
                            key={chat.id}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                              "hover:bg-accent",
                              activeChat?.id === chat.id && "bg-accent"
                            )}
                            onClick={() => {
                              setActiveChat(chat)
                              setIsMobileMenuOpen(false)
                            }}
                          >
                            <Avatar>
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${chat.contactName}`} />
                              <AvatarFallback>{getInitials(chat.contactName)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-medium truncate">{chat.contactName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {chat.lastMessage ? formatTime(chat.lastMessage.timestamp) : ''}
                                </span>
                              </div>
                              {chat.lastMessage && (
                                <p className="text-sm text-muted-foreground truncate">
                                  {formatMessagePreview(chat.lastMessage.content)}
                                </p>
                              )}
                              <div className="flex gap-2 mt-1 flex-wrap">
                                {chat.tags.map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            {chat.unreadCount > 0 && (
                              <Badge className="ml-2">{chat.unreadCount}</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Sidebar para Desktop */}
          <div className="hidden lg:flex lg:w-80 border-r bg-card">
            <div className="flex flex-col w-full">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Conversas</h2>
                  <Button onClick={handleNewChat} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1">
                {isLoading ? (
                  <ChatListSkeleton />
                ) : (
                  <div className="space-y-2 p-2">
                    {chats
                      .filter(chat => chat.status === 'active')
                      .map(chat => (
                        <div
                          key={chat.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                            "hover:bg-accent",
                            activeChat?.id === chat.id && "bg-accent"
                          )}
                          onClick={() => setActiveChat(chat)}
                        >
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${chat.contactName}`} />
                            <AvatarFallback>{getInitials(chat.contactName)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate">{chat.contactName}</span>
                              <span className="text-xs text-muted-foreground">
                                {chat.lastMessage ? formatTime(chat.lastMessage.timestamp) : ''}
                              </span>
                            </div>
                            {chat.lastMessage && (
                              <p className="text-sm text-muted-foreground truncate">
                                {formatMessagePreview(chat.lastMessage.content)}
                              </p>
                            )}
                            <div className="flex gap-2 mt-1 flex-wrap">
                              {chat.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {chat.unreadCount > 0 && (
                            <Badge className="ml-2">{chat.unreadCount}</Badge>
                          )}
                        </div>
                      ))
                    }
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          {/* Área Principal */}
          <div className="flex-1 flex flex-col min-w-0">
            {activeChat ? (
              <>
                {/* Cabeçalho do Chat */}
                <div className="flex items-center justify-between p-4 border-b bg-card">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeChat.contactName}`} />
                      <AvatarFallback>{getInitials(activeChat.contactName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-medium">{activeChat.contactName}</h2>
                      <p className="text-sm text-muted-foreground">{activeChat.contactType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowContactDetails(!showContactDetails)}
                    >
                      <Forward className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Área de Mensagens */}
                <ScrollArea className="flex-1 p-4">
                  {isLoading ? (
                    <MessagesSkeleton />
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex items-start gap-3",
                            message.sender === 'Você' ? 'flex-row-reverse' : 'flex-row'
                          )}
                        >
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.sender}`} />
                            <AvatarFallback>{getInitials(message.sender)}</AvatarFallback>
                          </Avatar>
                          <div className={cn(
                            "flex flex-col max-w-[70%]",
                            message.sender === 'Você' ? 'items-end' : 'items-start'
                          )}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{message.sender}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                            <div className={cn(
                              "rounded-lg p-3",
                              message.sender === 'Você'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            )}>
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 mt-1">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-40" align={message.sender === 'Você' ? 'end' : 'start'}>
                                <div className="space-y-1">
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onClick={() => handleCopyMessage(message.content)}
                                  >
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copiar
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onClick={() => handleReplyMessage(message)}
                                  >
                                    <Reply className="mr-2 h-4 w-4" />
                                    Responder
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start text-destructive"
                                    onClick={() => handleDeleteMessage(message.id)}
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Excluir
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Área de Input */}
                <div className="p-4 border-t bg-card">
                  <div className="flex gap-2">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      placeholder="Digite sua mensagem..."
                      className="min-h-[40px] max-h-[120px]"
                      style={{ resize: 'none' }}
                    />
                    <div className="flex flex-col gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="h-10 w-10">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Anexar arquivo</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="h-10 w-10">
                            <Mic className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Gravar áudio</p>
                        </TooltipContent>
                      </Tooltip>
                      <Button onClick={handleSendMessage} size="icon" className="h-10 w-10">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Nenhuma conversa selecionada</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Selecione uma conversa ou inicie uma nova
                  </p>
                  <Button onClick={handleNewChat} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Conversa
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Painel de Detalhes do Contato */}
          {activeChat && showContactDetails && (
            <div className="hidden md:flex w-80 border-l bg-card">
              <div className="flex flex-col w-full p-4">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeChat.contactName}`} />
                    <AvatarFallback>{getInitials(activeChat.contactName)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="font-medium">{activeChat.contactName}</h3>
                    <p className="text-sm text-muted-foreground">{activeChat.contactEmail}</p>
                    <p className="text-sm text-muted-foreground">{activeChat.contactPhone}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeChat.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Status</h4>
                    <Badge variant={activeChat.status === 'active' ? 'default' : 'secondary'}>
                      {activeChat.status === 'active' ? 'Ativo' : 'Arquivado'}
                    </Badge>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowEditDialog(true)}
                  >
                    Editar Contato
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Contato</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={editingContact.name}
                    onChange={(e) =>
                      setEditingContact({ ...editingContact, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingContact.email}
                    onChange={(e) =>
                      setEditingContact({ ...editingContact, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={editingContact.phone}
                    onChange={(e) =>
                      setEditingContact({ ...editingContact, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={editingContact.type}
                    onValueChange={(value) =>
                      setEditingContact({ ...editingContact, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aluno">Aluno</SelectItem>
                      <SelectItem value="Prospect">Prospect</SelectItem>
                      <SelectItem value="Ex-Aluno">Ex-Aluno</SelectItem>
                      <SelectItem value="Parceiro">Parceiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleEditContact}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Diálogo de Novo Contato */}
          <Dialog open={showNewContactDialog} onOpenChange={setShowNewContactDialog}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Nova Conversa</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Contato</Label>
                  <Input
                    id="name"
                    placeholder="Digite o nome do contato"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite o email do contato"
                    value={newContact.email}
                    onChange={(e) =>
                      setNewContact({ ...newContact, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="Digite o telefone do contato"
                    value={newContact.phone}
                    onChange={(e) =>
                      setNewContact({ ...newContact, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Contato</Label>
                  <Select
                    value={newContact.type}
                    onValueChange={(value) =>
                      setNewContact({ ...newContact, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de contato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aluno">Aluno</SelectItem>
                      <SelectItem value="Prospect">Prospect</SelectItem>
                      <SelectItem value="Ex-Aluno">Ex-Aluno</SelectItem>
                      <SelectItem value="Parceiro">Parceiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem Inicial (opcional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Digite uma mensagem inicial..."
                    value={newContact.message}
                    onChange={(e) =>
                      setNewContact({ ...newContact, message: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewContactDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateNewContact}>Criar Conversa</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </BaseLayout>
  )
} 