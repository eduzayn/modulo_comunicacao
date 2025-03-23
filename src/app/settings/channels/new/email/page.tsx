'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, Mail, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/ui/page-container'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/toast/use-toast'
import { useChannels } from '@/hooks/use-channels'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { EmailConfig, ChannelConfigJson, CreateChannelInput } from '@/types/channels'

const emailFormSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  email: z.string().email('E-mail inválido').min(1, 'O e-mail é obrigatório'),
  host: z.string().min(1, 'O servidor é obrigatório'),
  port: z.string().min(1, 'A porta é obrigatória'),
  username: z.string().min(1, 'O usuário é obrigatório'),
  password: z.string().min(1, 'A senha é obrigatória'),
  type: z.enum(['imap', 'pop3']),
  encryption: z.enum(['tls', 'ssl', 'none']),
  autoReply: z.boolean().default(false),
  autoReplyTemplate: z.string().optional(),
  forwardUnread: z.boolean().default(false),
  forwardEmail: z.string().email('E-mail inválido').optional().or(z.literal('')),
})

type EmailFormValues = z.infer<typeof emailFormSchema>

export default function EmailIntegrationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { addChannel: createChannel } = useChannels()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('basic')

  const defaultValues: Partial<EmailFormValues> = {
    name: '',
    email: '',
    host: '',
    port: '',
    username: '',
    password: '',
    type: 'imap',
    encryption: 'tls',
    autoReply: false,
    autoReplyTemplate: '',
    forwardUnread: false,
    forwardEmail: ''
  }

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues,
  })

  async function onSubmit(data: EmailFormValues) {
    setIsLoading(true)
    
    try {
      // Cria um objeto de configuração de e-mail compatível com a interface e inclui metadados adicionais
      const emailConfig: EmailConfig = {
        smtpServer: data.host,
        port: parseInt(data.port, 10),
        username: data.username,
        password: data.password,
        fromEmail: data.email,
        fromName: data.name
      };
      
      // Adiciona os metadados adicionais que serão armazenados no JSONB mas não fazem parte da interface principal
      const configWithMetadata = {
        ...emailConfig,
        type: data.type,
        encryption: data.encryption,
        autoReply: data.autoReply,
        autoReplyTemplate: data.autoReplyTemplate || null,
        forwardUnread: data.forwardUnread,
        forwardEmail: data.forwardEmail || null
      };
      
      // Cria a entrada de canal com a configuração correta
      const channelInput: CreateChannelInput = {
        name: data.name,
        type: 'email',
        status: 'active',
        config: emailConfig
      };
      
      await createChannel(channelInput);
      
      toast({
        title: 'Canal de e-mail configurado com sucesso',
        description: 'Agora você pode receber e responder e-mails pelo sistema.',
      })
      
      router.push('/settings/channels')
    } catch (error) {
      console.error('Erro ao configurar canal de e-mail:', error)
      toast({
        variant: 'destructive',
        title: 'Erro ao configurar canal',
        description: 'Não foi possível conectar à conta de e-mail. Verifique suas credenciais.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para atualizar os dados do formulário com base no tipo de servidor de e-mail
  const updateFormData = (type: 'gmail' | 'outlook' | 'yahoo' | 'custom') => {
    switch (type) {
      case 'gmail':
        form.setValue('host', 'imap.gmail.com')
        form.setValue('port', '993')
        form.setValue('type', 'imap')
        form.setValue('encryption', 'ssl')
        break
      case 'outlook':
        form.setValue('host', 'outlook.office365.com')
        form.setValue('port', '993')
        form.setValue('type', 'imap')
        form.setValue('encryption', 'tls')
        break
      case 'yahoo':
        form.setValue('host', 'imap.mail.yahoo.com')
        form.setValue('port', '993')
        form.setValue('type', 'imap')
        form.setValue('encryption', 'ssl')
        break
      case 'custom':
        form.setValue('host', '')
        form.setValue('port', '')
        form.setValue('type', 'imap')
        form.setValue('encryption', 'tls')
        break
    }
  }

  return (
    <PageContainer>
      <div className="flex flex-col space-y-8 max-w-3xl mx-auto">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/settings/channels/new')}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Button>
          <h1 className="text-2xl font-bold">Conectar E-mail</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuração do E-mail</CardTitle>
            <CardDescription>
              Configure uma conta de e-mail para receber e responder mensagens diretamente da plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                    <TabsTrigger value="server">Servidor</TabsTrigger>
                    <TabsTrigger value="advanced">Avançado</TabsTrigger>
                  </TabsList>
                  
                  {/* Configurações Básicas */}
                  <TabsContent value="basic" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do canal</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Suporte Técnico" {...field} />
                          </FormControl>
                          <FormDescription>
                            Um nome para identificar esta conta de e-mail no sistema
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço de e-mail</FormLabel>
                          <FormControl>
                            <Input placeholder="nome@empresa.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            O endereço de e-mail que você deseja conectar
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usuário</FormLabel>
                          <FormControl>
                            <Input placeholder="nome@empresa.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Geralmente é o endereço de e-mail completo
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Sua senha" {...field} />
                          </FormControl>
                          <FormDescription>
                            Para contas Gmail, use uma senha de aplicativo
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        onClick={() => setActiveTab('server')}
                      >
                        Próximo
                      </Button>
                    </div>
                  </TabsContent>
                  
                  {/* Configurações do Servidor */}
                  <TabsContent value="server" className="space-y-6">
                    <div className="mb-6">
                      <Label htmlFor="emailProvider">Provedor de e-mail</Label>
                      <Select 
                        onValueChange={(value) => updateFormData(value as any)}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Selecione o provedor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gmail">Gmail</SelectItem>
                          <SelectItem value="outlook">Outlook</SelectItem>
                          <SelectItem value="yahoo">Yahoo Mail</SelectItem>
                          <SelectItem value="custom">Personalizado</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-1">
                        Selecione seu provedor para preencher automaticamente as configurações do servidor
                      </p>
                    </div>

                    <div className="grid gap-4 grid-cols-2">
                      <FormField
                        control={form.control}
                        name="host"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Servidor IMAP/POP3</FormLabel>
                            <FormControl>
                              <Input placeholder="imap.example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="port"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Porta</FormLabel>
                            <FormControl>
                              <Input placeholder="993" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 grid-cols-2">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="imap">IMAP</SelectItem>
                                <SelectItem value="pop3">POP3</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Recomendamos IMAP para sincronização completa
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="encryption"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Criptografia</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a criptografia" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="tls">TLS</SelectItem>
                                <SelectItem value="ssl">SSL</SelectItem>
                                <SelectItem value="none">Nenhuma</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              A maioria dos serviços usa TLS
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab('basic')}
                      >
                        Voltar
                      </Button>
                      <Button 
                        type="button"
                        onClick={() => setActiveTab('advanced')}
                      >
                        Próximo
                      </Button>
                    </div>
                  </TabsContent>
                  
                  {/* Configurações Avançadas */}
                  <TabsContent value="advanced" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="autoReply"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Resposta automática</FormLabel>
                            <FormDescription>
                              Enviar uma resposta automática para novos e-mails
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch('autoReply') && (
                      <FormField
                        control={form.control}
                        name="autoReplyTemplate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Modelo de resposta automática</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Obrigado pelo seu e-mail. Entraremos em contato em breve." 
                                {...field} 
                                className="min-h-[100px]"
                              />
                            </FormControl>
                            <FormDescription>
                              Esta mensagem será enviada automaticamente
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="forwardUnread"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Encaminhar e-mails não lidos</FormLabel>
                            <FormDescription>
                              Encaminhar e-mails não lidos para outro endereço
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch('forwardUnread') && (
                      <FormField
                        control={form.control}
                        name="forwardEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail para encaminhamento</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="encaminhar@empresa.com" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              E-mails não lidos serão encaminhados para este endereço
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="flex justify-between">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab('server')}
                      >
                        Voltar
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Conectando...
                          </>
                        ) : (
                          <>
                            <Mail className="mr-2 h-4 w-4" />
                            Conectar E-mail
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2 text-blue-500" />
              Dicas para configuração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Gmail</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Para contas do Gmail, você precisará criar uma "Senha de App" nas configurações de segurança da sua conta Google. A autenticação de dois fatores precisa estar ativada.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium">Outlook</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Para contas do Outlook/Office 365, você pode precisar criar um aplicativo no Azure AD para obter permissões de acesso IMAP.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium">Configurações comuns</h3>
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-2 text-sm">
                  <span className="font-medium">Gmail (IMAP):</span>
                  <span>imap.gmail.com:993 (SSL)</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="font-medium">Outlook (IMAP):</span>
                  <span>outlook.office365.com:993 (TLS)</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="font-medium">Yahoo (IMAP):</span>
                  <span>imap.mail.yahoo.com:993 (SSL)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
} 