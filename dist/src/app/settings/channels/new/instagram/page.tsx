'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, Instagram } from 'lucide-react'
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
import { InstagramConfig, CreateChannelInput } from '@/types/channels'

const instagramFormSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  username: z.string().min(1, 'O nome de usuário é obrigatório'),
  accessToken: z.string().min(1, 'O token de acesso é obrigatório'),
  businessAccountId: z.string().min(1, 'O ID da conta business é obrigatório'),
  enableCommentReplies: z.boolean().default(true),
  enableDirectMessages: z.boolean().default(true),
  notifyOnNewComment: z.boolean().default(true),
  notifyOnNewMessage: z.boolean().default(true),
})

type InstagramFormValues = z.infer<typeof instagramFormSchema>

export default function InstagramIntegrationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { createChannel } = useChannels()
  const [isLoading, setIsLoading] = useState(false)

  const defaultValues: Partial<InstagramFormValues> = {
    name: '',
    username: '',
    accessToken: '',
    businessAccountId: '',
    enableCommentReplies: true,
    enableDirectMessages: true,
    notifyOnNewComment: true,
    notifyOnNewMessage: true,
  }

  const form = useForm<InstagramFormValues>({
    resolver: zodResolver(instagramFormSchema),
    defaultValues,
  })

  async function onSubmit(data: InstagramFormValues) {
    setIsLoading(true)
    
    try {
      // Criar a configuração usando a interface InstagramConfig
      const instagramConfig: InstagramConfig = {
        username: data.username,
        accessToken: data.accessToken,
        businessAccountId: data.businessAccountId,
        enableCommentReplies: data.enableCommentReplies,
        enableDirectMessages: data.enableDirectMessages,
        notifyOnNewComment: data.notifyOnNewComment,
        notifyOnNewMessage: data.notifyOnNewMessage,
      };
      
      // Criar o objeto de entrada do canal
      const channelInput: CreateChannelInput = {
        name: data.name,
        type: 'instagram',
        status: 'active',
        config: instagramConfig
      };
      
      await createChannel(channelInput);
      
      toast({
        title: 'Canal Instagram configurado com sucesso',
        description: 'Agora você pode responder comentários e mensagens pelo sistema.',
      })
      
      router.push('/settings/channels')
    } catch (error) {
      console.error('Erro ao configurar canal do Instagram:', error)
      toast({
        variant: 'destructive',
        title: 'Erro ao configurar canal',
        description: 'Não foi possível conectar ao Instagram. Verifique suas credenciais.',
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
          <h1 className="text-2xl font-bold">Conectar Instagram</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuração do Instagram</CardTitle>
            <CardDescription>
              Configure sua conta do Instagram para interagir com comentários e mensagens diretas diretamente da plataforma.
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
                        <Input placeholder="Ex: Instagram Marketing" {...field} />
                      </FormControl>
                      <FormDescription>
                        Um nome para identificar esta conexão com o Instagram
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
                      <FormLabel>Nome de usuário</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: minha_empresa" {...field} />
                      </FormControl>
                      <FormDescription>
                        O nome de usuário da sua conta do Instagram (@nome)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID da conta business</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 123456789012345" {...field} />
                      </FormControl>
                      <FormDescription>
                        O ID da sua conta business do Instagram. É necessário ter uma conta business para essa integração.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accessToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token de acesso</FormLabel>
                      <FormControl>
                        <Input placeholder="Token de acesso" type="password" {...field} />
                      </FormControl>
                      <FormDescription>
                        O token de acesso da API do Instagram. Pode ser obtido através do Facebook for Developers.
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
                            Permita responder a comentários de posts do Instagram diretamente pelo sistema
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
                  <h3 className="text-sm font-medium">Configurações de mensagens diretas</h3>
                  
                  <FormField
                    control={form.control}
                    name="enableDirectMessages"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Ativar mensagens diretas</FormLabel>
                          <FormDescription>
                            Permita responder a mensagens diretas do Instagram pelo sistema
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
                            Receba notificações quando novas mensagens diretas forem recebidas
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
                        <Instagram className="mr-2 h-4 w-4" />
                        Conectar ao Instagram
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
            <CardTitle>Requisitos para integração com Instagram</CardTitle>
            <CardDescription>
              Antes de configurar a integração, certifique-se de ter os seguintes requisitos:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col">
                <h3 className="text-sm font-medium">1. Conta business do Instagram</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  É necessário ter uma conta business do Instagram para acessar a API.
                </p>
              </div>
              
              <div className="flex flex-col">
                <h3 className="text-sm font-medium">2. Página do Facebook conectada</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Sua conta do Instagram precisa estar conectada a uma página do Facebook.
                </p>
              </div>
              
              <div className="flex flex-col">
                <h3 className="text-sm font-medium">3. App no Facebook for Developers</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  É necessário criar um aplicativo no Facebook for Developers e configurar as permissões necessárias.
                </p>
              </div>
              
              <div className="flex flex-col mt-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Nota:</span> A partir do Instagram Graph API, é possível responder a comentários diretamente pela API, tornando possível a integração com o sistema.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
} 