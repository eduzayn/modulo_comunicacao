'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, ExternalLink, Puzzle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function PluginsPage() {
  const [activeTab, setActiveTab] = useState('instalados')

  const placeholderPlugins = [
    {
      id: 1,
      name: 'Integração Mercado Pago',
      description: 'Processa pagamentos e gerencia assinaturas via Mercado Pago',
      status: 'ativo',
      author: 'Oficial',
      icon: '💳'
    },
    {
      id: 2,
      name: 'Conexão ERP',
      description: 'Sincroniza dados com os principais sistemas ERP do mercado',
      status: 'inativo',
      author: 'Parceiro',
      icon: '🔄'
    },
    {
      id: 3,
      name: 'Exportador de Relatórios',
      description: 'Exporta relatórios em diversos formatos como PDF, Excel e CSV',
      status: 'ativo',
      author: 'Oficial',
      icon: '📊'
    }
  ]

  const marketplacePlugins = [
    {
      id: 4,
      name: 'Integração com CRM',
      description: 'Conecte-se com os principais CRMs do mercado',
      author: 'Parceiro Premium',
      price: 'Grátis',
      icon: '👥'
    },
    {
      id: 5,
      name: 'Automação de Marketing',
      description: 'Automatize campanhas de marketing baseadas em comportamento',
      author: 'Oficial',
      price: 'Assinatura',
      icon: '📢'
    },
    {
      id: 6,
      name: 'Analytics Avançado',
      description: 'Relatórios e insights avançados sobre conversas e atendimentos',
      author: 'Parceiro',
      price: 'R$ 99/mês',
      icon: '📈'
    },
    {
      id: 7,
      name: 'Integração com E-commerce',
      description: 'Conecte-se com as principais plataformas de e-commerce',
      author: 'Parceiro Premium',
      price: 'R$ 149/mês',
      icon: '🛒'
    }
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Plugins</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Plugin
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="instalados">Instalados</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="desenvolvedor">Área do Desenvolvedor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="instalados" className="space-y-4">
          {placeholderPlugins.length > 0 ? (
            placeholderPlugins.map(plugin => (
              <Card key={plugin.id} className="overflow-hidden">
                <div className="flex">
                  <div className="flex items-center justify-center bg-muted w-16 h-16 text-2xl">
                    {plugin.icon}
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{plugin.name}</h3>
                        <p className="text-sm text-muted-foreground">{plugin.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        plugin.status === 'ativo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {plugin.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <div className="flex justify-between mt-4">
                      <span className="text-xs text-muted-foreground">Desenvolvido por: {plugin.author}</span>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">Configurar</Button>
                        <Button 
                          variant={plugin.status === 'ativo' ? 'destructive' : 'default'} 
                          size="sm"
                        >
                          {plugin.status === 'ativo' ? 'Desativar' : 'Ativar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Puzzle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum plugin instalado</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Você ainda não tem plugins instalados. Visite o marketplace para descobrir plugins
                  que podem ajudar sua empresa.
                </p>
                <Button onClick={() => setActiveTab('marketplace')}>
                  Explorar Marketplace
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="marketplace" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {marketplacePlugins.map(plugin => (
              <Card key={plugin.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center bg-muted w-10 h-10 rounded-md text-xl">
                        {plugin.icon}
                      </div>
                      <CardTitle className="text-lg">{plugin.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="text-sm mb-4">{plugin.description}</CardDescription>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Por: {plugin.author}</span>
                    <span>{plugin.price}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button className="w-full">Instalar</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            <Button variant="outline">
              Ver todos os plugins <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="desenvolvedor">
          <Card>
            <CardHeader>
              <CardTitle>Área do Desenvolvedor</CardTitle>
              <CardDescription>
                Desenvolva e publique seus próprios plugins para o ecossistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Crie seu Plugin</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Com nossa API e SDKs, você pode criar plugins personalizados para estender as funcionalidades do sistema.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline">Documentação de Desenvolvimento</Button>
                  <Button>Iniciar um Novo Plugin</Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Publique no Marketplace</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Depois de criar seu plugin, você pode publicá-lo no marketplace para compartilhar com outros usuários.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline">Critérios de Publicação</Button>
                  <Button>Enviar para Avaliação</Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Recursos para Desenvolvedores</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline">Comunidade de Desenvolvedores</Button>
                  <Button variant="outline">Exemplos de Código</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 