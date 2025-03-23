'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Phone, Video, MoreVertical, Send, Paperclip, Mic, Smile } from 'lucide-react'

export default function WhatsAppConversations() {
  const [mensagem, setMensagem] = useState('')
  const [tabValue, setTabValue] = useState<string>('todas')
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">WhatsApp</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="px-4 py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversas</CardTitle>
              <Badge variant="outline">{conversas.length}</Badge>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar conversa" className="pl-8" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={tabValue} onValueChange={setTabValue}>
              <TabsList className="w-full rounded-none">
                <TabsTrigger value="todas" className="flex-1">Todas</TabsTrigger>
                <TabsTrigger value="nao-lidas" className="flex-1">Não lidas</TabsTrigger>
                <TabsTrigger value="resolvidas" className="flex-1">Resolvidas</TabsTrigger>
              </TabsList>
              <TabsContent value="todas" className="m-0">
                <div className="divide-y">
                  {conversas.map((conversa, index) => (
                    <div key={index} className={`flex items-start p-4 gap-3 hover:bg-muted/50 cursor-pointer ${index === 0 ? 'bg-muted/50' : ''}`}>
                      <Avatar>
                        <AvatarImage src={conversa.avatar} />
                        <AvatarFallback>{conversa.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium truncate">{conversa.nome}</h4>
                          <span className="text-xs text-muted-foreground">{conversa.hora}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conversa.ultimaMensagem}</p>
                      </div>
                      {conversa.naoPendentes > 0 && (
                        <Badge className="rounded-full">{conversa.naoPendentes}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="px-4 py-3 border-b flex flex-row items-center">
            <Avatar className="h-9 w-9 mr-2">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-base">Maria Rodrigues</CardTitle>
              <CardDescription className="text-xs">Online agora</CardDescription>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mensagens.map((msg, index) => (
                <div key={index} className={`flex ${msg.remetente === 'eu' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-lg p-3 ${msg.remetente === 'eu' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p className="text-sm">{msg.texto}</p>
                    <div className={`text-xs mt-1 ${msg.remetente === 'eu' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {msg.hora}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Smile className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Input 
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Digite uma mensagem" 
                className="flex-1"
              />
              <Button variant="ghost" size="icon">
                <Mic className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Button size="icon" disabled={mensagem.trim() === ''}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Dados estáticos
const conversas = [
  { 
    nome: 'Maria Rodrigues', 
    avatar: '/placeholder-user.jpg',
    ultimaMensagem: 'Obrigada pelo atendimento!', 
    hora: '10:42', 
    naoPendentes: 0
  },
  { 
    nome: 'João Silva', 
    avatar: '/placeholder-user-2.jpg',
    ultimaMensagem: 'Quero saber mais sobre o produto', 
    hora: '09:30', 
    naoPendentes: 2
  },
  { 
    nome: 'Ana Beatriz', 
    avatar: '/placeholder-user-3.jpg',
    ultimaMensagem: 'Qual o prazo de entrega?', 
    hora: 'Ontem', 
    naoPendentes: 1
  },
  { 
    nome: 'Carlos Mendes', 
    avatar: '/placeholder-user-4.jpg',
    ultimaMensagem: 'Vou verificar e retorno', 
    hora: 'Ontem', 
    naoPendentes: 0
  },
  { 
    nome: 'Fernanda Costa', 
    avatar: '/placeholder-user-5.jpg',
    ultimaMensagem: 'Obrigada!', 
    hora: '20/03', 
    naoPendentes: 0
  },
]

const mensagens = [
  {
    remetente: 'outro',
    texto: 'Olá, bom dia! Gostaria de saber mais informações sobre o produto que vi no site de vocês.',
    hora: '10:30'
  },
  {
    remetente: 'eu',
    texto: 'Bom dia, Maria! Obrigado por entrar em contato. Claro, posso te ajudar com informações sobre nossos produtos. Qual produto específico você está interessada?',
    hora: '10:32'
  },
  {
    remetente: 'outro',
    texto: 'Estou interessada no pacote de comunicação empresarial. Vocês têm planos para pequenas empresas?',
    hora: '10:35'
  },
  {
    remetente: 'eu',
    texto: 'Sim, temos planos específicos para pequenas empresas! Nosso pacote básico inclui chat integrado, email e WhatsApp. Posso te enviar mais detalhes sobre preços e recursos.',
    hora: '10:38'
  },
  {
    remetente: 'outro',
    texto: 'Seria ótimo! Obrigada pelo atendimento!',
    hora: '10:42'
  }
] 