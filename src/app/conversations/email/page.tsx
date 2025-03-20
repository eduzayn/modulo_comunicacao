'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  Filter, 
  Star, 
  StarOff, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Bold, 
  Italic, 
  List, 
  ListOrdered,
  Link as LinkIcon,
  AlignLeft,
  Trash,
  Archive,
  Clock,
  Inbox,
  Send as SendIcon,
  FileCheck,
  AlertCircle,
  RefreshCw
} from 'lucide-react'

export default function EmailPage() {
  const [assunto, setAssunto] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [tabValue, setTabValue] = useState<string>('caixa-entrada')
  const [selectValue, setSelectValue] = useState<string>('todas')
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">E-mail</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="px-4 py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Pastas</CardTitle>
              <Button variant="ghost" size="sm">+</Button>
            </div>
          </CardHeader>
          <CardContent className="px-2 py-0">
            <div className="space-y-1">
              {pastas.map((pasta, index) => (
                <div key={index} className={`flex items-center justify-between py-2 px-2 rounded-md ${index === 0 ? 'bg-muted' : 'hover:bg-muted/50'} cursor-pointer`}>
                  <div className="flex items-center gap-2">
                    <pasta.icone className="h-4 w-4 text-muted-foreground" />
                    <span>{pasta.nome}</span>
                  </div>
                  {pasta.contagem > 0 && (
                    <Badge variant="secondary">{pasta.contagem}</Badge>
                  )}
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="px-2">
              <div className="font-medium text-sm mb-2">Etiquetas</div>
              <div className="space-y-1">
                {etiquetas.map((etiqueta, index) => (
                  <div key={index} className="flex items-center gap-2 py-1 hover:bg-muted/50 rounded-md px-2 cursor-pointer">
                    <div className={`w-2 h-2 rounded-full bg-${etiqueta.cor}-500`}></div>
                    <span className="text-sm">{etiqueta.nome}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <Tabs value={tabValue} onValueChange={setTabValue} className="h-full flex flex-col">
            <CardHeader className="px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="caixa-entrada">Caixa de Entrada</TabsTrigger>
                  <TabsTrigger value="novo-email">Novo E-mail</TabsTrigger>
                </TabsList>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar e-mails" className="pl-8" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 flex-1 overflow-hidden">
              <TabsContent value="caixa-entrada" className="h-full flex flex-col m-0">
                <div className="flex items-center justify-between border-b px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Trash className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Archive className="h-4 w-4 mr-1" />
                      Arquivar
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Clock className="h-4 w-4 mr-1" />
                      Adiar
                    </Button>
                  </div>
                  
                  <Select value={selectValue} onValueChange={setSelectValue}>
                    <SelectTrigger className="w-[180px] h-8">
                      <SelectValue placeholder="Exibir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as mensagens</SelectItem>
                      <SelectItem value="nao-lidas">Não lidas</SelectItem>
                      <SelectItem value="marcadas">Mensagens marcadas</SelectItem>
                      <SelectItem value="anexos">Com anexos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1 overflow-auto">
                  <div className="divide-y">
                    {emails.map((email, index) => (
                      <div key={index} className={`flex items-start p-4 gap-4 hover:bg-muted/50 cursor-pointer ${email.lido ? '' : 'bg-muted/30'}`}>
                        <div className="flex items-center self-start mt-1 gap-2">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            {email.favorito ? (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            ) : (
                              <StarOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                        
                        <Avatar className="mt-1">
                          <AvatarImage src={email.avatar} />
                          <AvatarFallback>{email.remetente.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className={`font-medium truncate ${email.lido ? '' : 'font-semibold'}`}>{email.remetente}</h4>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{email.data}</span>
                          </div>
                          
                          <h5 className={`text-sm ${email.lido ? '' : 'font-semibold'}`}>{email.assunto}</h5>
                          
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {email.previa}
                          </p>
                          
                          {email.etiquetas && email.etiquetas.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {email.etiquetas.map((etiqueta, i) => (
                                <Badge key={i} variant="outline" className={`text-xs py-0 px-2 bg-${etiqueta.cor}-100 text-${etiqueta.cor}-800 border-${etiqueta.cor}-200`}>
                                  {etiqueta.nome}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {email.temAnexo && (
                          <Paperclip className="h-4 w-4 text-muted-foreground self-center" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="novo-email" className="h-full m-0 flex flex-col">
                <div className="p-4 space-y-4 flex-1">
                  <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                    <label className="font-medium">Para:</label>
                    <Input placeholder="destinatario@exemplo.com" />
                  </div>
                  
                  <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                    <label className="font-medium">Cc/Cco:</label>
                    <div className="flex items-center">
                      <Button variant="link" className="text-xs h-6 px-2">Adicionar Cc</Button>
                      <span className="text-muted-foreground">/</span>
                      <Button variant="link" className="text-xs h-6 px-2">Adicionar Cco</Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                    <label className="font-medium">Assunto:</label>
                    <Input 
                      placeholder="Assunto do e-mail" 
                      value={assunto}
                      onChange={(e) => setAssunto(e.target.value)}
                    />
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="bg-muted/30 rounded-md p-1 mb-2 flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 px-2 rounded-sm">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2 rounded-sm">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2 rounded-sm">
                      <List className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2 rounded-sm">
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2 rounded-sm">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2 rounded-sm">
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Textarea 
                    placeholder="Escreva o conteúdo do seu e-mail aqui..."
                    className="flex-1 min-h-[200px]"
                    value={conteudo}
                    onChange={(e) => setConteudo(e.target.value)}
                  />
                </div>
                
                <CardFooter className="border-t px-4 py-3">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="h-4 w-4 mr-1" />
                        Anexar
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Salvar Rascunho
                      </Button>
                      <Button size="sm" disabled={!assunto.trim() || !conteudo.trim()}>
                        <Send className="h-4 w-4 mr-1" />
                        Enviar
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

// Dados estáticos
const pastas = [
  { nome: 'Caixa de Entrada', icone: Inbox, contagem: 4 },
  { nome: 'Enviados', icone: SendIcon, contagem: 0 },
  { nome: 'Rascunhos', icone: FileCheck, contagem: 2 },
  { nome: 'Spam', icone: AlertCircle, contagem: 7 },
  { nome: 'Lixeira', icone: Trash, contagem: 0 },
]

const etiquetas = [
  { nome: 'Importante', cor: 'red' },
  { nome: 'Trabalho', cor: 'blue' },
  { nome: 'Pessoal', cor: 'green' },
  { nome: 'Financeiro', cor: 'yellow' },
  { nome: 'Projetos', cor: 'purple' },
]

const emails = [
  {
    remetente: 'Maria Silva',
    email: 'maria.silva@exemplo.com',
    avatar: '/placeholder-user.jpg',
    assunto: 'Proposta Comercial - Módulo Comunicação',
    previa: 'Olá, estou enviando a proposta comercial conforme solicitado. Por favor, verifique os detalhes e me informe se precisar de algum ajuste...',
    data: '10:28',
    lido: false,
    favorito: true,
    temAnexo: true,
    etiquetas: [{ nome: 'Importante', cor: 'red' }]
  },
  {
    remetente: 'Pedro Santos',
    email: 'pedro.santos@exemplo.com',
    avatar: '/placeholder-user-2.jpg',
    assunto: 'Reunião de Alinhamento',
    previa: 'Prezados, gostaria de confirmar nossa reunião de amanhã às 14h para alinhamento do projeto. A pauta será...',
    data: '09:15',
    lido: true,
    favorito: false,
    temAnexo: false,
    etiquetas: [{ nome: 'Trabalho', cor: 'blue' }]
  },
  {
    remetente: 'Ana Costa',
    email: 'ana.costa@exemplo.com',
    avatar: '/placeholder-user-3.jpg',
    assunto: 'Dúvida sobre integração',
    previa: 'Bom dia, estou com uma dúvida sobre como integrar o sistema de comunicação com nosso CRM existente...',
    data: 'Ontem',
    lido: false,
    favorito: false,
    temAnexo: false,
    etiquetas: []
  },
  {
    remetente: 'Carlos Mendes',
    email: 'carlos.mendes@exemplo.com',
    avatar: '/placeholder-user-4.jpg',
    assunto: 'Feedback sobre implementação',
    previa: 'Olá equipe, gostaria de compartilhar alguns feedbacks sobre a implementação recente do módulo de comunicação...',
    data: 'Ontem',
    lido: true,
    favorito: true,
    temAnexo: true,
    etiquetas: [{ nome: 'Projetos', cor: 'purple' }]
  },
  {
    remetente: 'Equipe Financeiro',
    email: 'financeiro@exemplo.com',
    avatar: '/placeholder-user-5.jpg',
    assunto: 'Fatura Março/2024',
    previa: 'Prezado cliente, segue em anexo a fatura referente aos serviços prestados no mês de março de 2024...',
    data: '20/03',
    lido: false,
    favorito: false,
    temAnexo: true,
    etiquetas: [{ nome: 'Financeiro', cor: 'yellow' }]
  },
] 