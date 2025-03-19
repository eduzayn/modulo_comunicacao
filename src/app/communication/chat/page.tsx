'use client'

import { useState, useEffect } from 'react'
import { BaseLayout } from '@/components/layout/BaseLayout'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Menu, Send, Archive, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  archived: boolean
}

const mockResponses = [
  'Olá! Como posso ajudar?',
  'Entendi sua pergunta. Vou pesquisar e responder.',
  'Claro, posso ajudar com isso.',
  'Poderia fornecer mais detalhes?'
]

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<Chat | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Fecha o menu mobile quando selecionar um chat
    if (activeChat) {
      setIsMobileMenuOpen(false)
    }
  }, [activeChat])

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Math.random().toString(36).substring(7),
      title: 'Nova Conversa',
      messages: [],
      archived: false
    }
    setChats([...chats, newChat])
    setActiveChat(newChat)
    setError(null)
    setIsMobileMenuOpen(false)
  }

  const handleSendMessage = async () => {
    if (!activeChat) {
      setError('Nenhuma conversa ativa')
      return
    }

    if (!message.trim()) return

    setIsLoading(true)
    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    }

    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, newMessage]
    }

    setChats(chats.map(chat => 
      chat.id === activeChat.id ? updatedChat : chat
    ))
    setActiveChat(updatedChat)
    setMessage('')

    // Simula resposta da IA
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const aiResponse: Message = {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        timestamp: new Date()
      }

      const chatWithResponse = {
        ...updatedChat,
        messages: [...updatedChat.messages, aiResponse]
      }

      setChats(chats.map(chat => 
        chat.id === activeChat.id ? chatWithResponse : chat
      ))
      setActiveChat(chatWithResponse)
    } catch (err) {
      setError('Erro ao processar mensagem')
    } finally {
      setIsLoading(false)
    }
  }

  const handleArchiveChat = () => {
    if (!activeChat) return
    setIsArchiveDialogOpen(true)
  }

  const confirmArchive = () => {
    if (!activeChat) return

    const updatedChat = {
      ...activeChat,
      archived: true
    }

    setChats(chats.map(chat => 
      chat.id === activeChat.id ? updatedChat : chat
    ))
    setActiveChat(null)
    setIsArchiveDialogOpen(false)
  }

  return (
    <BaseLayout module="communication">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div 
          data-testid="chat-sidebar"
          className={cn(
            "w-64 border-r bg-background p-4",
            "fixed inset-y-0 left-0 z-50 md:relative",
            "transition-transform duration-200 ease-in-out",
            !isMobileMenuOpen && "-translate-x-full md:translate-x-0"
          )}
        >
          <Button 
            onClick={handleNewChat}
            className="w-full mb-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Conversa
          </Button>

          <ScrollArea className="h-[calc(100vh-8rem)]">
            {chats.filter(chat => !chat.archived).map(chat => (
              <Button
                key={chat.id}
                variant={chat.id === activeChat?.id ? 'secondary' : 'ghost'}
                className="w-full justify-start mb-1"
                onClick={() => setActiveChat(chat)}
              >
                {chat.title}
              </Button>
            ))}
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                name="Menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h2 className="text-2xl font-bold">Chat</h2>
            </div>
            {activeChat && (
              <Button
                variant="outline"
                onClick={handleArchiveChat}
                name="Arquivar Conversa"
              >
                <Archive className="h-4 w-4 mr-2" />
                Arquivar Conversa
              </Button>
            )}
          </div>

          <Card className="flex-1 p-4 mb-4">
            <ScrollArea className="h-full">
              {activeChat?.messages.map(msg => (
                <div
                  key={msg.id}
                  data-testid={`message-${msg.role}`}
                  className={cn(
                    "mb-4 p-3 rounded-lg",
                    msg.role === 'user' ? 'bg-primary/10 ml-auto' : 'bg-muted',
                    "max-w-[80%]"
                  )}
                >
                  {msg.content}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-center py-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              )}
            </ScrollArea>
          </Card>

          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading}
              name="Enviar"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Arquivar Conversa</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja arquivar esta conversa?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsArchiveDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmArchive}>
              Arquivar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BaseLayout>
  )
} 