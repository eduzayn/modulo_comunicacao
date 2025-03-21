'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, MessageSquare, Info } from 'lucide-react'
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
import { SMSConfig, ChannelConfigJson, CreateChannelInput } from '@/types/channels'

const smsFormSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  provider: z.enum(['twilio', 'zenvia', 'infobip', 'custom']),
  apiKey: z.string().min(1, 'A chave de API é obrigatória'),
  apiSecret: z.string().optional(),
  senderId: z.string().min(1, 'O ID do remetente é obrigatório'),
  webhookUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  testNumber: z.string().optional().or(z.literal('')),
  defaultMessage: z.string().optional(),
  autoReply: z.boolean().default(false),
  autoReplyTemplate: z.string().optional(),
})

type SMSFormValues = z.infer<typeof smsFormSchema>

// Interface estendida para SMS que inclui campos adicionais
interface ExtendedSMSConfig extends SMSConfig {
  provider?: string;
  apiSecret?: string;
  defaultMessage?: string;
  autoReply?: boolean;
  autoReplyTemplate?: string;
}

export default function SMSIntegrationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { addChannel: createChannel } = useChannels()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('basic')
  const [testSending, setTestSending] = useState(false)

  const defaultValues: Partial<SMSFormValues> = {
    name: '',
    provider: 'twilio',
    apiKey: '',
    apiSecret: '',
    senderId: '',
    webhookUrl: '',
    testNumber: '',
    defaultMessage: '',
    autoReply: false,
    autoReplyTemplate: '',
  }

  const form = useForm<SMSFormValues>({
    resolver: zodResolver(smsFormSchema),
    defaultValues,
  })

  async function onSubmit(data: SMSFormValues) {
    setIsLoading(true)
    
    try {
      // Cria um objeto de configuração de SMS compatível com a interface
      const smsConfig: SMSConfig = {
        apiKey: data.apiKey,
        senderId: data.senderId,
        webhookUrl: data.webhookUrl || ''
      };
      
      // Adiciona os metadados adicionais que serão armazenados no JSONB
      const configWithMetadata = {
        ...smsConfig,
        provider: data.provider,
        apiSecret: data.apiSecret || '',
        defaultMessage: data.defaultMessage || '',
        autoReply: data.autoReply,
        autoReplyTemplate: data.autoReplyTemplate || ''
      };
      
      // Cria a entrada de canal com a configuração correta
      const channelInput: CreateChannelInput = {
        name: data.name,
        type: 'sms',
        status: 'active',
        config: smsConfig
      };
      
      await createChannel(channelInput);
      
      toast({
        title: 'Canal de SMS configurado com sucesso',
        description: 'Agora você pode enviar e receber SMS pelo sistema.',
      })
      
      router.push('/settings/channels')
    } catch (error) {
      console.error('Erro ao configurar canal de SMS:', error)
      toast({
        variant: 'destructive',
        title: 'Erro ao configurar canal',
        description: 'Não foi possível conectar ao serviço de SMS. Verifique suas credenciais.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para enviar SMS de teste
  const sendTestSMS = async () => {
    const testNumber = form.getValues('testNumber')
    
    if (!testNumber) {
      toast({
        variant: 'destructive',
        title: 'Número de teste necessário',
        description: 'Por favor, preencha o número para enviar o SMS de teste.',
      })
      return
    }
    
    setTestSending(true)
    
    try {
      // Aqui seria a chamada para uma API de envio de SMS de teste
      // Simulando um atraso de resposta
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: 'SMS de teste enviado',
        description: `O SMS foi enviado com sucesso para ${testNumber}.`,
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar SMS',
        description: 'Não foi possível enviar o SMS de teste. Verifique as configurações.',
      })
    } finally {
      setTestSending(false)
    }
  }

  // Função para atualizar os dados do formulário com base no provedor de SMS
  const updateFormData = (provider: 'twilio' | 'zenvia' | 'infobip' | 'custom') => {
    switch (provider) {
      case 'twilio':
        form.setValue('webhookUrl', 'https://seu-dominio.com/api/webhooks/sms/twilio')
        break
      case 'zenvia':
        form.setValue('webhookUrl', 'https://seu-dominio.com/api/webhooks/sms/zenvia')
        break
      case 'infobip':
        form.setValue('webhookUrl', 'https://seu-dominio.com/api/webhooks/sms/infobip')
        break
      case 'custom':
        form.setValue('webhookUrl', '')
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
          <h1 className="text-2xl font-bold">Conectar SMS</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuração do SMS</CardTitle>
            <CardDescription>
              Configure um provedor de SMS para enviar e receber mensagens de texto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                    <TabsTrigger value="api">Configuração da API</TabsTrigger>
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
                            <Input placeholder="Ex: SMS Marketing" {...field} />
                          </FormControl>
                          <FormDescription>
                            Um nome para identificar este canal de SMS no sistema
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="provider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provedor de SMS</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value)
                              updateFormData(value as any)
                            }} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o provedor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="twilio">Twilio</SelectItem>
                              <SelectItem value="zenvia">Zenvia</SelectItem>
                              <SelectItem value="infobip">Infobip</SelectItem>
                              <SelectItem value="custom">Personalizado</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Escolha seu provedor de serviços de SMS
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="senderId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID do Remetente</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: EMPRESA" {...field} />
                          </FormControl>
                          <FormDescription>
                            O nome ou número que aparecerá como remetente do SMS
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        onClick={() => setActiveTab('api')}
                      >
                        Próximo
                      </Button>
                    </div>
                  </TabsContent>
                  
                  {/* Configurações da API */}
                  <TabsContent value="api" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave de API</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Sua chave de API" {...field} />
                          </FormControl>
                          <FormDescription>
                            Chave de autenticação fornecida pelo provedor de SMS
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="apiSecret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Segredo da API (se necessário)</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Seu segredo de API" {...field} />
                          </FormControl>
                          <FormDescription>
                            Alguns provedores exigem um segredo adicional
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="webhookUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL do Webhook</FormLabel>
                          <FormControl>
                            <Input placeholder="https://seu-dominio.com/api/webhooks/sms" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL para receber notificações de entrega e respostas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <Label htmlFor="testNumber">Enviar SMS de teste</Label>
                      <div className="flex items-end gap-4">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name="testNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input id="testNumber" placeholder="+5511999999999" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Número com código do país para enviar um SMS de teste
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button 
                          type="button" 
                          onClick={sendTestSMS}
                          disabled={testSending}
                          className="mb-6"
                        >
                          {testSending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            'Enviar Teste'
                          )}
                        </Button>
                      </div>
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
                      name="defaultMessage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensagem padrão</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Olá {nome}, obrigado por entrar em contato." 
                              {...field} 
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormDescription>
                            Template padrão para envio de SMS. Use {'{nome}'} para inserir o nome do destinatário.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                              Enviar uma resposta automática para novos SMS recebidos
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
                                placeholder="Obrigado pela sua mensagem. Entraremos em contato em breve." 
                                {...field} 
                                className="min-h-[100px]"
                              />
                            </FormControl>
                            <FormDescription>
                              Esta mensagem será enviada automaticamente quando um SMS for recebido
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
                        onClick={() => setActiveTab('api')}
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
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Ativar Canal de SMS
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
              Informações importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Preços</h3>
              <p className="text-sm text-muted-foreground mt-1">
                O envio de SMS geralmente é cobrado por mensagem. Verifique a política de preços do seu provedor para mais detalhes.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium">Limitações</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Mensagens SMS têm um limite de 160 caracteres. Mensagens mais longas podem ser divididas em várias partes e cobradas separadamente.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium">Webhooks</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Para receber respostas de SMS, você precisa configurar o webhook no painel do seu provedor apontando para a URL fornecida acima.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
} 