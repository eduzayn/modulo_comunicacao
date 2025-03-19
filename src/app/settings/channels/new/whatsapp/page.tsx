'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/ui/page-container'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'

// Esquema de validação para o formulário
const formSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  phoneNumber: z.string().min(10, 'O número de telefone deve ter pelo menos 10 dígitos'),
  warningAcknowledged: z.boolean().refine(val => val === true, {
    message: "Você precisa reconhecer o aviso sobre o WhatsApp"
  })
})

type FormValues = z.infer<typeof formSchema>

export default function WhatsappPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      warningAcknowledged: false
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    setError(null)

    try {
      // Aqui você implementaria a lógica para salvar o canal
      // Exemplo: await createChannel({ ...data, type: 'whatsapp' })
      
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
          <h1 className="text-2xl font-bold">WhatsApp App</h1>
        </div>
        
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Importante: Evite usar um número novo</AlertTitle>
          <AlertDescription className="text-amber-700">
            <p className="mb-2">Não conecte uma conta nova (número novo) ao WhatsApp Web ou ao Kinbox. Caso o número seja novo, o WhatsApp pode bloquear o acesso.</p>
            <p>Recomendamos "aquecer" o número trocando mensagens diariamente com contatos conhecidos por pelo menos uma semana antes de conectá-lo.</p>
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardHeader>
            <CardTitle>Configurar WhatsApp App</CardTitle>
            <CardDescription>
              Conecte-se ao WhatsApp usando a integração padrão. Esta opção é ideal para volumes pequenos e médios de mensagens.
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
                          placeholder="Ex: WhatsApp Suporte" 
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
                        O número de telefone que será usado para o WhatsApp
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warningAcknowledged"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Eu entendo que devo usar um número que já tem histórico de uso no WhatsApp
                        </FormLabel>
                        <FormDescription>
                          Números novos podem ser bloqueados pelo WhatsApp se usados com integrações
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                    Continuar
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