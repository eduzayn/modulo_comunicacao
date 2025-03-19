'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/ui/page-container'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

// Esquema de validação para o formulário
const formSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  phoneNumber: z.string().min(10, 'O número de telefone deve ter pelo menos 10 dígitos'),
  businessAccountId: z.string().min(5, 'O ID da conta comercial é obrigatório'),
  token: z.string().min(10, 'O token de acesso é obrigatório'),
  webhookVerifyToken: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function WhatsappCloudApiPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      businessAccountId: '',
      token: '',
      webhookVerifyToken: '',
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    setError(null)

    try {
      // Aqui você implementaria a lógica para salvar o canal
      // Exemplo: await createChannel({ ...data, type: 'whatsapp-cloud-api' })
      
      // Simula uma espera pela resposta da API
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      router.push('/settings/channels')
    } catch (err) {
      setError('Ocorreu um erro ao salvar o canal. Por favor, tente novamente.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageContainer>
      <div className="flex flex-col space-y-8 max-w-2xl mx-auto">
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
          <h1 className="text-2xl font-bold">WhatsApp Cloud API</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Configurar WhatsApp Cloud API</CardTitle>
            <CardDescription>
              A API oficial da Meta para WhatsApp Business permite que empresas de qualquer tamanho se conectem com clientes.
              <a 
                href="https://developers.facebook.com/docs/whatsapp/cloud-api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium ml-1 hover:underline"
              >
                Saiba mais
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do canal</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: WhatsApp Marketing" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Uma descrição para identificar este canal
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de telefone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: +5511999998888" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        O número de telefone associado à sua conta do WhatsApp Business
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
                      <FormLabel>ID da conta de negócios</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="ID da sua WhatsApp Business Account" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        O ID da sua conta de negócios do WhatsApp do Meta Business Suite
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token de acesso permanente</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="Seu token de acesso" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        O token permanente gerado no Meta Developers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="webhookVerifyToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token de verificação do webhook (opcional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Token de verificação personalizado" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Um token personalizado para verificar webhooks
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center pt-2 space-x-4">
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">URL do Webhook</div>
                    <code className="bg-muted px-3 py-1 rounded text-xs block overflow-x-auto">
                      https://api.kinbox.com.br/api/wba-hook/cloud
                    </code>
                    <p className="text-xs text-muted-foreground mt-1">
                      Configure este URL no console do Meta Developers para receber mensagens
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.push('/settings/channels/new')}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Salvar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
} 