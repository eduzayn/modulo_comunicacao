'use client'

import { BaseLayout } from '@/components/layout/BaseLayout'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send } from 'lucide-react'
import { FC } from 'react'

const ChatPage: FC = () => {
  return (
    <BaseLayout module="communication">
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chat</h2>
          <p className="text-muted-foreground">
            Gerencie suas conversas com alunos e professores
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-12rem)]">
          {/* Lista de Contatos */}
          <Card className="col-span-3 p-4">
            <div className="mb-4">
              <Input placeholder="Buscar contatos..." />
            </div>
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-2">
                {['Maria Silva', 'João Santos', 'Carlos Oliveira', 'Ana Pereira'].map((name, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-communication/10 flex items-center justify-center text-communication">
                        {name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{name}</p>
                        <p className="text-sm text-muted-foreground">Online</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Área de Chat */}
          <Card className="col-span-9 p-4 flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4">
              <ScrollArea className="h-[calc(100vh-20rem)]">
                <div className="space-y-4">
                  {[
                    { sender: 'Maria Silva', message: 'Olá, tudo bem?', time: '10:30' },
                    { sender: 'Você', message: 'Oi Maria! Tudo ótimo, e com você?', time: '10:31' },
                    { sender: 'Maria Silva', message: 'Estou bem também! Gostaria de tirar uma dúvida sobre o curso.', time: '10:32' },
                  ].map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.sender === 'Você' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          msg.sender === 'Você'
                            ? 'bg-communication text-white'
                            : 'bg-accent'
                        }`}
                      >
                        <p className="text-sm font-medium">{msg.sender}</p>
                        <p>{msg.message}</p>
                        <p className="text-xs mt-1 opacity-70">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Digite sua mensagem..." className="flex-1" />
              <Button>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </BaseLayout>
  )
}

export default ChatPage 