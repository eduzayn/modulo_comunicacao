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
  Trash,
  ChevronRight,
  ChevronLeft,
  Wand2,
  PenLine,
  ArrowRightLeft,
  HelpCircle,
  Check,
  Languages,
  Smile
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
import { Link, usePathname } from 'next/navigation'
import { sizes, spacing, fontSize } from "@/lib/constants"

const menuItems = [
  { title: 'Início', href: '/communication', icon: <Home className="h-4 w-4" /> },
  { title: 'Chat', href: '/communication/chat', icon: <MessageSquare className="h-4 w-4" /> }
]

// Componente para exibir arquivo
function FileMessage({ message }: { message: Message }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-accent">
      <div className="p-2 rounded-full bg-background">
        <Paperclip className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{message.fileName}</p>
        <p className="text-xs text-muted-foreground">{message.fileSize}</p>
      </div>
      {message.tags && message.tags.length > 0 && (
        <div className="flex gap-1">
          {message.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ChatPage() {
  const pathname = usePathname()
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredChats, setFilteredChats] = useState<Chat[]>([])

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

  // Funções para manipulação de mensagens
  const handleSimplifyMessage = (message: Message) => {
    const response: Message = {
      id: String(Date.now()),
      content: `Versão simplificada:\n${message.content}`,
      sender: 'Assistente',
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    }
    setMessages(prev => [...prev, response])
  }

  const handleRewriteMessage = (message: Message) => {
    const response: Message = {
      id: String(Date.now()),
      content: `Versão reescrita:\n${message.content}`,
      sender: 'Assistente',
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    }
    setMessages(prev => [...prev, response])
  }

  const handleExpandMessage = (message: Message) => {
    const response: Message = {
      id: String(Date.now()),
      content: `Versão expandida:\n${message.content}`,
      sender: 'Assistente',
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    }
    setMessages(prev => [...prev, response])
  }

  const handleExplainMessage = (message: Message) => {
    const response: Message = {
      id: String(Date.now()),
      content: `Explicação:\n${message.content}`,
      sender: 'Assistente',
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    }
    setMessages(prev => [...prev, response])
  }

  const handleCorrectGrammar = (message: Message) => {
    const response: Message = {
      id: String(Date.now()),
      content: `Correção gramatical:\n${message.content}`,
      sender: 'Assistente',
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    }
    setMessages(prev => [...prev, response])
  }

  const handleTranslateToEnglish = (message: Message) => {
    const response: Message = {
      id: String(Date.now()),
      content: `English translation:\n${message.content}`,
      sender: 'Assistente',
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    }
    setMessages(prev => [...prev, response])
  }

  const handleTranslateToSpanish = (message: Message) => {
    const response: Message = {
      id: String(Date.now()),
      content: `Traducción al español:\n${message.content}`,
      sender: 'Assistente',
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    }
    setMessages(prev => [...prev, response])
  }

  const handleChangeTone = (message: Message) => {
    const response: Message = {
      id: String(Date.now()),
      content: `Tom amigável:\n${message.content}`,
      sender: 'Assistente',
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    }
    setMessages(prev => [...prev, response])
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeChat) return;

    const newMessage: Message = {
      id: String(messages.length + 1),
      content: '',
      sender: 'Você',
      timestamp: new Date(),
      type: 'file',
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      fileType: file.type,
      status: 'sent',
      tags: []
    };

    setMessages(prev => [...prev, newMessage]);
    event.target.value = '';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

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
      <TooltipProvider>
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className={cn(
            "hidden md:flex flex-col w-[var(--sidebar-width)] border-r bg-muted/50",
            "transition-all duration-300 ease-in-out",
            isSidebarCollapsed ? "w-16" : `w-[${sizes.sidebar}]`
          )}>
            <div className="flex items-center justify-between p-4 border-b">
              <h1 className={cn(
                "font-semibold truncate transition-opacity",
                isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100"
              )}>
                Edunéxia Comunicação
              </h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              >
                {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
            <nav className="flex-1 p-2">
              <div className={cn(
                "space-y-1",
                isSidebarCollapsed ? "items-center" : ""
              )}>
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm",
                      "transition-colors duration-200",
                      "hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    )}
                  >
                    {item.icon}
                    <span className={cn(
                      "transition-opacity",
                      isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100"
                    )}>
                      {item.title}
                    </span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          {/* Lista de Chats */}
          <div className={cn(
            "hidden md:flex flex-col border-r",
            `w-[${sizes.chatList}]`
          )}>
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Pesquisar conversas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="icon" onClick={() => setShowNewContactDialog(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-2">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleChatSelect(chat)}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-lg",
                      "transition-colors duration-200",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeChat?.id === chat.id ? "bg-accent text-accent-foreground" : "text-foreground"
                    )}
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0">
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
                      <div className="flex items-center gap-2 mt-1">
                        {chat.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {chat.lastMessage && (
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {formatMessagePreview(chat.lastMessage)}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Área do Chat */}
          <div className="flex-1 flex flex-col">
            {activeChat ? (
              <>
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeChat.contactName}`} />
                      <AvatarFallback>{getInitials(activeChat.contactName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-medium leading-none">{activeChat.contactName}</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activeChat.assignedTo ? `Atribuído para: ${activeChat.assignedTo.name}` : 'Não atribuído'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowTransferDialog(true)}
                    >
                      <Forward className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowContactDetails(!showContactDetails)}
                    >
                      {showContactDetails ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex items-start gap-3 max-w-[80%]",
                          message.sender === 'Você' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                        )}
                      >
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.sender}`} />
                          <AvatarFallback>{getInitials(message.sender)}</AvatarFallback>
                        </Avatar>
                        <div className={cn(
                          "flex flex-col",
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
                            {message.type === 'file' ? (
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-background/10">
                                  <Paperclip className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium truncate">{message.fileName}</p>
                                  <p className="text-sm opacity-80">{message.fileSize}</p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            )}
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  "h-6 w-6 mt-1",
                                  "opacity-0 group-hover:opacity-100 transition-opacity"
                                )}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-56"
                              align={message.sender === 'Você' ? 'end' : 'start'}
                            >
                              <div className="space-y-1">
                                {message.type === 'text' && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start"
                                      onClick={() => handleSimplifyMessage(message)}
                                    >
                                      <Wand2 className="mr-2 h-4 w-4" />
                                      Simplificar
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start"
                                      onClick={() => handleRewriteMessage(message)}
                                    >
                                      <PenLine className="mr-2 h-4 w-4" />
                                      Reescrever
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start"
                                      onClick={() => handleExpandMessage(message)}
                                    >
                                      <ArrowRightLeft className="mr-2 h-4 w-4" />
                                      Expandir
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start"
                                      onClick={() => handleExplainMessage(message)}
                                    >
                                      <HelpCircle className="mr-2 h-4 w-4" />
                                      Explicar
                                    </Button>
                                    <Separator />
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start"
                                      onClick={() => handleCorrectGrammar(message)}
                                    >
                                      <Check className="mr-2 h-4 w-4" />
                                      Corrigir português
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start"
                                      onClick={() => handleTranslateToEnglish(message)}
                                    >
                                      <Languages className="mr-2 h-4 w-4" />
                                      Traduzir para inglês
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start"
                                      onClick={() => handleTranslateToSpanish(message)}
                                    >
                                      <Languages className="mr-2 h-4 w-4" />
                                      Traduzir para espanhol
                                    </Button>
                                    <Separator />
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start"
                                      onClick={() => handleChangeTone(message)}
                                    >
                                      <Smile className="mr-2 h-4 w-4" />
                                      Tom amigável
                                    </Button>
                                    <Separator />
                                  </>
                                )}
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start"
                                  onClick={() => handleCopyMessage(message.type === 'file' ? message.fileName || '' : message.content)}
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
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileUpload}
                      />
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Mic className="h-5 w-5" />
                    </Button>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Digite uma mensagem..."
                      className="flex-1 min-h-9 max-h-32 resize-none"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h2 className="mt-4 text-lg font-medium">Nenhuma conversa selecionada</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Selecione uma conversa para começar a interagir
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Painel de Detalhes */}
          {activeChat && showContactDetails && (
            <div className={cn(
              "hidden md:flex flex-col border-l bg-card",
              `w-[${sizes.details}]`
            )}>
              <ScrollArea className="flex-1">
                <div className="p-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeChat.contactName}`} />
                      <AvatarFallback>{getInitials(activeChat.contactName)}</AvatarFallback>
                    </Avatar>
                    <h3 className="mt-4 font-medium text-lg">{activeChat.contactName}</h3>
                    <p className="text-sm text-muted-foreground">{activeChat.contactEmail}</p>
                    <p className="text-sm text-muted-foreground">{activeChat.contactPhone}</p>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Responsável</h4>
                      {activeChat.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {activeChat.assignedTo.type === 'agent' ? 'Agente' : 'Grupo'}
                          </Badge>
                          <span className="text-sm">{activeChat.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Não atribuído</span>
                      )}
                    </div>

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

                    {activeChat.transferHistory && activeChat.transferHistory.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Histórico de Transferências</h4>
                        <div className="space-y-3">
                          {activeChat.transferHistory.map((transfer, index) => (
                            <div key={index} className="bg-muted/50 rounded-lg p-3">
                              <div className="flex items-center gap-2">
                                <Forward className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  De: {transfer.from.name}
                                </span>
                              </div>
                              <div className="mt-1 ml-6">
                                <span className="text-sm">
                                  Para: {transfer.to.name}
                                </span>
                              </div>
                              <div className="mt-2 ml-6 text-xs text-muted-foreground">
                                {formatTime(transfer.timestamp)}
                                {transfer.reason && (
                                  <p className="mt-1">
                                    Motivo: {transfer.reason}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowEditDialog(true)}
                    >
                      Editar Contato
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </TooltipProvider>
    </BaseLayout>
  )
} 