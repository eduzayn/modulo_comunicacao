'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, Facebook } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/ui/page-container'
import { Input } from '@/components/ui/input'
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
import { useToast } from '@/components/ui/use-toast'
import { useChannels } from '@/hooks/use-channels'
import { FacebookConfig, CreateChannelInput } from '@/types/channels'

const facebookFormSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  pageId: z.string().min(1, 'O ID da página é obrigatório'),
  pageAccessToken: z.string().min(1, 'O token de acesso é obrigatório'),
  enableCommentReplies: z.boolean().default(true),
  enableMessageReplies: z.boolean().default(true),
  notifyOnNewComment: z.boolean().default(true),
  notifyOnNewMessage: z.boolean().default(true),
})

type FacebookFormValues = z.infer<typeof facebookFormSchema>

export default function FacebookIntegrationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { createChannel } = useChannels()
  const [isLoading, setIsLoading] = useState(false)

  const defaultValues: Partial<FacebookFormValues> = {
    name: '',
    pageId: '',
    pageAccessToken: '',
    enableCommentReplies: true,
    enableMessageReplies: true,
    notifyOnNewComment: true,
    notifyOnNewMessage: true,
  }

  const form = useForm<FacebookFormValues>({
    resolver: zodResolver(facebookFormSchema),
    defaultValues,
  })

  async function onSubmit(data: FacebookFormValues) {
    setIsLoading(true)
    
    try {
      // Criar a configuração usando a interface FacebookConfig
      const facebookConfig: FacebookConfig = {
        pageId: data.pageId,
        pageAccessToken: data.pageAccessToken,
        enableCommentReplies: data.enableCommentReplies,
        enableMessageReplies: data.enableMessageReplies,
        notifyOnNewComment: data.notifyOnNewComment,
        notifyOnNewMessage: data.notifyOnNewMessage,
      };
      
      // Criar o objeto de entrada do canal
      const channelInput: CreateChannelInput = {
        name: data.name,
        type: 'facebook',
        status: 'active',
        config: facebookConfig
      };
      
      await createChannel(channelInput);
      
      toast({
        title: 'Canal Facebook configurado com sucesso',
        description: 'Agora você pode responder comentários e mensagens pelo sistema.',
      })
      
      router.push('/settings/channels')
    } catch (error) {
      console.error('Erro ao configurar canal do Facebook:', error)
      toast({
        variant: 'destructive',
        title: 'Erro ao configurar canal',
        description: 'Não foi possível conectar ao Facebook. Verifique suas credenciais.',
      })
    } finally {
      setIsLoading(false)
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
          <h1 className="text-2xl font-bold">Conectar Facebook</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuração do Facebook</CardTitle>
            <CardDescription>
              Configure sua página do Facebook para interagir com mensagens e comentários diretamente da plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da integração</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Facebook Marketing" {...field} />
                      </FormControl>
                      <FormDescription>
                        Um nome para identificar esta conexão com o Facebook
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pageId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID da página</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 123456789012345" {...field} />
                      </FormControl>
                      <FormDescription>
                        O ID da sua página do Facebook. Você pode encontrá-lo nas Configurações da Página &gt; Sobre.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pageAccessToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token de acesso da página</FormLabel>
                      <FormControl>
                        <Input placeholder="Token de acesso" type="password" {...field} />
                      </FormControl>
                      <FormDescription>
                        O token de acesso da sua página do Facebook. Para obtê-lo, acesse o Facebook for Developers.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4 border rounded-md p-4">
                  <h3 className="text-sm font-medium">Configurações de comentários</h3>
                  
                  <FormField
                    control={form.control}
                    name="enableCommentReplies"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Ativar respostas a comentários</FormLabel>
                          <FormDescription>
                            Permita responder a comentários de posts do Facebook diretamente pelo sistema
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notifyOnNewComment"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Notificar sobre novos comentários</FormLabel>
                          <FormDescription>
                            Receba notificações quando novos comentários forem feitos em suas publicações
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 border rounded-md p-4">
                  <h3 className="text-sm font-medium">Configurações de mensagens</h3>
                  
                  <FormField
                    control={form.control}
                    name="enableMessageReplies"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Ativar respostas a mensagens</FormLabel>
                          <FormDescription>
                            Permita responder a mensagens diretas do Facebook pelo sistema
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notifyOnNewMessage"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Notificar sobre novas mensagens</FormLabel>
                          <FormDescription>
                            Receba notificações quando novas mensagens forem recebidas
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <CardFooter className="px-0 pt-6 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/settings/channels/new')}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      <>
                        <Facebook className="mr-2 h-4 w-4" />
                        Conectar ao Facebook
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Como responder a comentários do Facebook</CardTitle>
            <CardDescription>
              Após conectar sua página do Facebook, você poderá responder aos comentários diretamente pela plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col">
                <h3 className="text-sm font-medium">1. Veja todos os comentários em um único lugar</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Todos os comentários das suas publicações aparecerão automaticamente no painel de conversas.
                </p>
              </div>
              
              <div className="flex flex-col">
                <h3 className="text-sm font-medium">2. Responda diretamente pela plataforma</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Escreva suas respostas no sistema e elas serão automaticamente publicadas no Facebook.
                </p>
              </div>
              
              <div className="flex flex-col">
                <h3 className="text-sm font-medium">3. Acompanhe todas as interações</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Mantenha um histórico completo de todas as interações com seus seguidores do Facebook.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
} 