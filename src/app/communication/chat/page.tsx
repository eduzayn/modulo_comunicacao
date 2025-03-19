'use client'

import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Send,
  Archive,
  Plus,
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
  Smile,
  Home,
  MessageSquare,
  Users,
  BarChart2,
  Settings,
  Menu,
  Search
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
import { sizes, spacing, fontSize } from "@/lib/constants"
import { useChatState } from '@/hooks/useChatState'

// Componente de mensagem memoizado
const ChatMessage = memo(function ChatMessage({ message, isOwnMessage }: { message: Message, isOwnMessage: boolean }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 max-w-[80%]",
        isOwnMessage ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      <Avatar className="h-8 w-8 mt-1">
        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.sender}`} />
        <AvatarFallback>{getInitials(message.sender)}</AvatarFallback>
      </Avatar>
      <div className={cn(
        "flex flex-col",
        isOwnMessage ? 'items-end' : 'items-start'
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
      </div>
    </div>
  )
})

export default function ChatPage() {
  const pathname = usePathname()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [state, actions] = useChatState()
  const [message, setMessage] = useState('')
  const menuItems = [
    { title: 'Início', href: '/communication', icon: <Home className="h-4 w-4" /> },
    { title: 'Chat', href: '/communication/chat', icon: <MessageSquare className="h-4 w-4" /> },
    { title: 'Contatos', href: '/communication/contacts', icon: <Users className="h-4 w-4" /> },
    { title: 'Estatísticas', href: '/communication/stats', icon: <BarChart2 className="h-4 w-4" /> },
    { title: 'Configurações', href: '/communication/settings', icon: <Settings className="h-4 w-4" /> }
  ]
  const {
    chats,
    activeChat,
    messages,
    searchTerm,
    isSidebarCollapsed,
    showContactDetails,
    showTransferDialog,
    showNewContactDialog,
    isMobileMenuOpen
  } = state

  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
    return () => clearTimeout(timer)
  }, [messages])

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={cn(
        "w-[280px] border-r bg-muted/50",
        "transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "w-[70px]" : ""
      )}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className={cn(
            "font-semibold text-lg truncate transition-opacity",
            isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100"
          )}>
            Edunéxia Comunicação
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={actions.toggleSidebar}
            aria-label={isSidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="p-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg mb-1",
                "transition-colors duration-200",
                "hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              {item.icon}
              <span className={cn(
                "font-medium transition-opacity",
                isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100"
              )}>
                {item.title}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Lista de Chats */}
      <div className="w-[380px] border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar conversas..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => actions.updateSearchTerm(e.target.value)}
              />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={actions.toggleNewContactDialog}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nova conversa</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => actions.setActiveChat(chat)}
                className={cn(
                  "w-full flex items-start gap-3 p-4 rounded-lg mb-2",
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
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
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
      <div className="flex-1 flex flex-col min-w-0">
        {activeChat ? (
          <>
            <div className="flex items-center justify-between p-4 border-b bg-card">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeChat.contactName}`} 
                    alt={`Avatar de ${activeChat.contactName}`}
                  />
                  <AvatarFallback>{getInitials(activeChat.contactName)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium text-lg leading-none">{activeChat.contactName}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeChat.assignedTo ? `Atribuído para: ${activeChat.assignedTo.name}` : 'Não atribuído'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={actions.toggleTransferDialog}
                      >
                        <Forward className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Transferir conversa</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={actions.toggleContactDetails}
                      >
                        {showContactDetails ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{showContactDetails ? "Ocultar detalhes" : "Mostrar detalhes"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} isOwnMessage={message.sender === 'Você'} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-card">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="min-h-[80px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        if (message.trim()) {
                          actions.sendMessage(message)
                          setMessage('')
                        }
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => document.getElementById('file-input')?.click()}
                        >
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Anexar arquivo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <input
                    type="file"
                    id="file-input"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) actions.handleFileUpload(file)
                    }}
                  />
                  <Button
                    onClick={() => {
                      if (message.trim()) {
                        actions.sendMessage(message)
                        setMessage('')
                      }
                    }}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Bem-vindo ao Chat</h2>
              <p className="text-muted-foreground">Selecione uma conversa para começar</p>
            </div>
          </div>
        )}
      </div>

      {/* Painel de Detalhes */}
      {activeChat && showContactDetails && (
        <div className="w-[300px] border-l bg-card">
          <ScrollArea className="h-full">
            <div className="p-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeChat.contactName}`} />
                  <AvatarFallback>{getInitials(activeChat.contactName)}</AvatarFallback>
                </Avatar>
                <h3 className="mt-4 font-medium text-lg">{activeChat.contactName}</h3>
                {activeChat.contactEmail && (
                  <p className="text-sm text-muted-foreground">{activeChat.contactEmail}</p>
                )}
                {activeChat.contactPhone && (
                  <p className="text-sm text-muted-foreground">{activeChat.contactPhone}</p>
                )}
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
                  onClick={actions.toggleEditDialog}
                >
                  Editar Contato
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
} 