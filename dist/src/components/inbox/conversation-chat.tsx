'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CheckCircle, Clock, Send, Paperclip, Smile, MessageSquare, Facebook, Instagram, Mail, Phone, Info, MoreHorizontal, CheckCheck, Check, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'

// Importando com lazy loading para componentes pesados
import dynamic from 'next/dynamic'

// Componentes base que são pequenos e podem ser importados diretamente
import { QuickPhrases } from '@/components/ui/quick-phrases'
import { InternalNote } from '@/components/chat/internal-note'
import { Chat } from '@/components/chat'

// Importando componentes pesados com lazy loading
const EmojiPicker = dynamic(() => import('@/components/ui/emoji-picker').then(mod => mod.EmojiPicker), {
  ssr: false,
  loading: () => <Button variant="ghost" size="icon"><Smile className="h-5 w-5" /></Button>
})

const VoiceRecorder = dynamic(() => import('@/components/ui/voice-recorder').then(mod => mod.VoiceRecorder), {
  ssr: false,
  loading: () => <Button variant="ghost" size="icon"><Phone className="h-5 w-5" /></Button>
})

const FileUploader = dynamic(() => import('@/components/ui/file-uploader').then(mod => mod.FileUploader), {
  ssr: false,
  loading: () => <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5" /></Button>
})

const MentionPicker = dynamic(() => import('@/components/ui/mention-picker').then(mod => mod.MentionPicker), {
  ssr: false
})

// Mantendo a interface Message original para compatibilidade com o código existente
interface Message {
  id: string
  text: string
  sender: 'user' | 'contact' | 'assistant'
  timestamp: Date
  status: 'sent' | 'delivered' | 'read' | 'pending'
  attachments?: {
    type: 'image' | 'audio' | 'file'
    url: string
    name?: string
  }[]
}

// Interface para compatibilidade com o componente Chat
interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type?: 'text' | 'image' | 'file' | 'audio' | 'document';
  status?: 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string | Date;
}

// Definição da interface User que era importada anteriormente do mention-picker
interface User {
  id: string;
  name: string;
  email: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  department?: string;
}

type ChannelType = 'whatsapp' | 'facebook' | 'instagram' | 'email' | 'sms' | 'chat'

interface ConversationChatProps {
  conversationId?: string
  contactName?: string
  contactAvatar?: string
  channelType?: ChannelType
  status?: string
}

// Lista simulada de colegas para menções
const teammates: User[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@exemplo.com',
    status: 'online',
    department: 'Suporte'
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@exemplo.com',
    status: 'away',
    department: 'Vendas'
  },
  {
    id: '3',
    name: 'Juliana Santos',
    email: 'juliana.santos@exemplo.com',
    status: 'online',
    department: 'Financeiro'
  },
  {
    id: '4',
    name: 'Roberto Almeida',
    email: 'roberto.almeida@exemplo.com',
    status: 'busy',
    department: 'TI'
  },
]

// Usuário atual simulado
const currentUser = {
  id: 'agent1',
  name: 'Ozenira Silva',
  avatar: '/avatars/agent1.png'
}

export default function ConversationChat({
  conversationId = '1',
  contactName = 'Cliente',
  contactAvatar,
  channelType = 'whatsapp',
  status
}: ConversationChatProps) {
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showFileUploader, setShowFileUploader] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [hasInternalNotes, setHasInternalNotes] = useState(true)
  const suggestions = ['Obrigado pelo contato!', 'Como posso ajudar?', 'Vou verificar isso para você']
  
  // Exemplo de mensagens
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá, tudo bem? Gostaria de saber mais sobre os cursos oferecidos.',
      sender: 'contact',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hora atrás
      status: 'read'
    },
    {
      id: '2',
      text: 'Olá! Claro, estamos com várias opções de cursos disponíveis. Você tem interesse em alguma área específica?',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 minutos atrás
      status: 'read'
    },
    {
      id: '3',
      text: 'Tenho interesse na área de tecnologia.',
      sender: 'contact',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutos atrás
      status: 'read'
    },
    {
      id: '4',
      text: 'Perfeito! Temos cursos de programação, design UX/UI, data science e muito mais. Posso te enviar nosso catálogo completo?',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
      status: 'delivered'
    },
    {
      id: '5',
      text: 'Sim, por favor. Também queria saber sobre valores e formas de pagamento.',
      sender: 'contact',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutos atrás
      status: 'read'
    }
  ])

  // Rolar para o final quando carregar ou adicionar novas mensagens
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight
      }
    }
  }, [messages])

  // Função auxiliar para formatar a hora
  const formatTime = (date: Date) => {
    return format(date, 'HH:mm', { locale: ptBR })
  }

  // Modificando a função handleSendMessage para retornar uma Promise
  const handleSendMessage = async (content: string = newMessage, mediaUrl?: string, type?: string) => {
    if (!content.trim() && !mediaUrl) return;
    
    setIsLoading(true);
    
    // Adicionar a nova mensagem ao estado
    const newMessageObj: Message = {
      id: `new-${Date.now()}`,
      text: content,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
      ...(mediaUrl && {
        attachments: [
          {
            type: (type === 'image' ? 'image' : type === 'audio' ? 'audio' : 'file') as any,
            url: mediaUrl,
            name: 'Arquivo enviado'
          }
        ]
      })
    };
    
    setMessages(prev => [...prev, newMessageObj]);
    setNewMessage('');
    
    // Simular envio (agora com Promise)
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        // Atualizar o status da mensagem para delivered
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessageObj.id 
              ? { ...msg, status: 'delivered' as const } 
              : msg
          )
        );
        resolve();
      }, 1000);
    });
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleAddNote = async (note: string, conversationId: string) => {
    console.log(`Adicionando anotação "${note}" para conversa ${conversationId}`)
    // Aqui você implementaria a chamada real para a API
    return Promise.resolve()
  }

  const handleSendAudio = async (blob: Blob) => {
    // Simulando upload de áudio
    setIsLoading(true)
    console.log('Enviando áudio de tamanho', blob.size)
    
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simular URL do áudio após upload
    const audioUrl = URL.createObjectURL(blob)
    
    // Enviar mensagem com o áudio
    handleSendMessage('', audioUrl, 'audio')
    setIsLoading(false)
  }

  const handleUploadFiles = async (files: File[]): Promise<string[]> => {
    // Simulando upload de arquivos
    setIsLoading(true)
    console.log('Fazendo upload de', files.length, 'arquivos')
    
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Criar URLs para os arquivos (em produção, isso seria URLs reais do servidor)
    const mediaUrls = files.map(file => URL.createObjectURL(file))
    
    setIsLoading(false)
    return mediaUrls
  }

  // Função para obter o ícone do canal
  const getChannelIcon = () => {
    switch (channelType) {
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case 'facebook':
        return <Facebook className="h-4 w-4 text-blue-600" />
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-600" />
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />
      case 'sms':
        return <Phone className="h-4 w-4 text-purple-500" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  // Converter mensagens para o formato do componente Chat
  const chatMessages = messages.map(msg => ({
    id: msg.id,
    conversationId: conversationId || '1',
    senderId: msg.sender === 'user' ? currentUser.id : 
              msg.sender === 'contact' ? 'contact-1' : 'assistant',
    content: msg.text,
    type: msg.attachments?.[0]?.type as any || 'text',
    status: msg.status === 'pending' ? 'sent' : msg.status,
    mediaUrl: msg.attachments?.[0]?.url,
    createdAt: msg.timestamp
  })) as any

  return (
    <div className="flex flex-col h-full">
      {/* Cabeçalho da conversa - novo design mais compacto */}
      <div className="flex items-center justify-between px-2 py-1 border-b bg-background/70 backdrop-blur-sm">
        <div className="flex items-center">
          <Avatar className="h-6 w-6 mr-2">
            {contactAvatar ? (
              <AvatarImage src={contactAvatar} alt={contactName} />
            ) : (
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {contactName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-xs">{contactName}</span>
              {channelType && (
                <Badge 
                  variant="outline" 
                  className="px-1 h-4 text-[9px] font-normal flex items-center gap-1 bg-background/40"
                >
                  {getChannelIcon()}
                  {channelType.charAt(0).toUpperCase() + channelType.slice(1)}
                </Badge>
              )}
              {status && (
                <Badge 
                  variant="outline" 
                  className="px-1 h-4 text-[9px] font-normal bg-green-50 text-green-700 border-green-200"
                >
                  {status}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
            <Info className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Abas (Informações/Atribuir/Responder) */}
      <div className="flex border-b text-xs">
        <Button variant="ghost" className="flex-1 h-8 rounded-none border-b-2 border-transparent hover:bg-muted/30 px-2">
          Informações
        </Button>
        <Button variant="ghost" className="flex-1 h-8 rounded-none border-b-2 border-transparent hover:bg-muted/30 px-2">
          Atribuir
        </Button>
        <Button variant="ghost" className="flex-1 h-8 rounded-none border-b-2 border-primary text-primary hover:bg-muted/30 px-2">
          Responder
        </Button>
      </div>

      {/* Área do chat - limpa e organizada */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-3 space-y-3">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-2 max-w-[85%]",
                  message.sender === 'contact' ? "ml-0" : "ml-auto justify-end"
                )}
              >
                {message.sender === 'contact' && (
                  <Avatar className="h-6 w-6 mt-0.5">
                    {contactAvatar ? (
                      <AvatarImage src={contactAvatar} alt={contactName} />
                    ) : (
                      <AvatarFallback className="text-xs">
                        {contactName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                )}
                <div
                  className={cn(
                    "p-2 rounded-lg text-sm",
                    message.sender === 'contact' 
                      ? "bg-muted/50" 
                      : "bg-primary/10 text-primary-foreground"
                  )}
                >
                  {/* Conteúdo da mensagem */}
                  <div className="space-y-1">
                    {message.text && <p>{message.text}</p>}
                    {message.attachments?.map((attachment, i) => (
                      <div key={i}>
                        {attachment.type === 'image' && (
                          <img 
                            src={attachment.url} 
                            alt="Imagem anexada" 
                            className="max-w-[200px] max-h-[200px] rounded-md mt-1"
                          />
                        )}
                        {attachment.type === 'audio' && (
                          <audio 
                            src={attachment.url} 
                            controls 
                            className="max-w-[200px] h-8 mt-1"
                          />
                        )}
                        {attachment.type === 'file' && (
                          <a 
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 flex items-center mt-1"
                          >
                            <Paperclip className="h-3 w-3 mr-1" />
                            {attachment.name || 'Arquivo anexado'}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Timestamp e status */}
                  <div className={cn(
                    "flex items-center justify-end gap-1 mt-1",
                    "text-[9px] opacity-70"
                  )}>
                    {formatTime(message.timestamp)}
                    {message.sender === 'user' && message.status && (
                      <span>
                        {message.status === 'sent' && <Check className="h-3 w-3" />}
                        {message.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                        {message.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-500" />}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Indicador de rolagem */}
        {isScrolling && (
          <Button 
            variant="outline" 
            size="sm"
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 shadow-md rounded-full bg-white"
            onClick={() => {
              if (scrollAreaRef.current) {
                const scrollArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
                if (scrollArea) {
                  scrollArea.scrollTop = scrollArea.scrollHeight
                }
              }
            }}
          >
            <ChevronDown className="h-4 w-4 mr-1" />
            Novas mensagens
          </Button>
        )}
      </div>

      {/* Seção de anotações internas - toggle visível */}
      {hasInternalNotes && (
        <div className="border-t border-dashed border-amber-200 bg-amber-50/50 p-2 text-xs">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center text-amber-800 font-medium">
              <span className="mr-1">📝</span> Anotações internas
            </div>
            <Badge variant="outline" className="text-[9px] bg-amber-100 border-amber-200 text-amber-800">
              Visível apenas para equipe interna
            </Badge>
          </div>
          <InternalNote 
            conversationId={conversationId}
            onAddNote={handleAddNote}
            currentUser={currentUser}
          />
        </div>
      )}

      {/* Caixa de mensagem - design otimizado */}
      <div className="border-t p-2 bg-background">
        <div className="bg-transparent border rounded-md shadow-sm">
          <Chat 
            messages={chatMessages}
            currentUserId={currentUser.id}
            conversationId={conversationId}
            onSendMessage={handleSendMessage}
            onSendAudio={handleSendAudio}
            onUploadFiles={handleUploadFiles}
            isLoading={isLoading}
            currentUser={currentUser}
            teammates={teammates}
            assistantName="Prof Ana"
            showInternalNotes={false}
          />
        </div>
      </div>
    </div>
  )
} 