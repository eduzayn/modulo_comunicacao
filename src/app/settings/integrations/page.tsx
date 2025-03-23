'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, KeyRound, Globe, Webhook } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Puzzle } from 'lucide-react'

export default function IntegrationsPage() {
  const router = useRouter()
  
  const integrationOptions = [
    {
      title: 'API Tokens',
      description: 'Gerencie tokens de API para integrar sistemas externos com sua conta',
      icon: <KeyRound className="h-10 w-10 text-primary" />,
      href: '/settings/integrations/api',
    },
    {
      title: 'Webhooks',
      description: 'Configure webhooks para receber notificações em tempo real de eventos do sistema',
      icon: <Webhook className="h-10 w-10 text-primary" />,
      href: '/settings/integrations/webhooks',
      soon: true,
    },
    {
      title: 'Plugins',
      description: 'Estenda as funcionalidades do sistema com plugins personalizados',
      icon: <Puzzle className="h-10 w-10 text-primary" />,
      href: '/settings/integrations/plugins',
      soon: true,
    },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-2xl font-bold">Integrações</h1>
        <p className="text-muted-foreground">
          Configure integrações entre o sistema e serviços externos
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {integrationOptions.map((option) => (
          <Card key={option.title} className="border hover:shadow-md transition-all">
            <CardHeader>
              <div className="flex items-center gap-3">
                {option.icon}
                <div>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                  {option.soon && (
                    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                      Em breve
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">{option.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full justify-between" 
                onClick={() => option.soon ? null : router.push(option.href)}
                disabled={option.soon}
              >
                {option.soon ? 'Em desenvolvimento' : 'Configurar'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Recursos de integração</h2>
        <Separator className="mb-6" />
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Documentação de API</CardTitle>
              <CardDescription>
                Acesse nossa documentação detalhada com guias e referências para integração
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Nossa API RESTful permite integrar seu sistema com outras plataformas e serviços.
                Consulte a documentação completa para obter informações sobre endpoints,
                autenticação e exemplos de código.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Acessar documentação <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>SDKs e bibliotecas</CardTitle>
              <CardDescription>
                Use nossas bibliotecas oficiais para acelerar o desenvolvimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Disponibilizamos SDKs em diferentes linguagens para facilitar a integração
                com nossa plataforma. Escolha a biblioteca que melhor se adapta ao seu ambiente
                de desenvolvimento.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">JavaScript</Button>
                <Button variant="outline" size="sm">PHP</Button>
                <Button variant="outline" size="sm">Python</Button>
                <Button variant="outline" size="sm">Ruby</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Ver todos os SDKs <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
} 