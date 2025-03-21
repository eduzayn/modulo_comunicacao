'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'

export function AccessibilityExamples() {
  const [activeTab, setActiveTab] = useState('keyboard')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4 w-full justify-start">
        <TabsTrigger value="keyboard">Navegação por Teclado</TabsTrigger>
        <TabsTrigger value="contrast">Contraste</TabsTrigger>
        <TabsTrigger value="semantic">Estrutura Semântica</TabsTrigger>
      </TabsList>
      
      <TabsContent value="keyboard" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Navegação por Teclado</CardTitle>
            <CardDescription>
              Exemplos de elementos navegáveis por teclado e seus comportamentos esperados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Links e Botões</h3>
              <div className="flex flex-wrap gap-4">
                <Button>Botão Padrão (Tab + Enter)</Button>
                <Button variant="outline">Botão Outline</Button>
                <a 
                  href="#" 
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => e.preventDefault()}
                  onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                >
                  Link como Botão
                </a>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Foco Visível</h3>
              <p>
                Pressione Tab para navegar entre os elementos abaixo e observe o indicador de foco.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['Elemento 1', 'Elemento 2', 'Elemento 3'].map((item, i) => (
                  <div 
                    key={i}
                    tabIndex={0}
                    className="p-4 border rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="contrast" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Contraste</CardTitle>
            <CardDescription>
              Exemplos de combinações de cores e níveis de contraste
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Texto em Fundos Diversos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-primary text-primary-foreground rounded-md">
                  <p className="font-medium">Alto Contraste Primário</p>
                  <p className="text-sm opacity-90">Texto em fundo primário (WCAG AA)</p>
                </div>
                <div className="p-4 bg-secondary text-secondary-foreground rounded-md">
                  <p className="font-medium">Contraste Secundário</p>
                  <p className="text-sm opacity-90">Texto em fundo secundário</p>
                </div>
                <div className="p-4 bg-muted text-muted-foreground rounded-md">
                  <p className="font-medium">Contraste Reduzido</p>
                  <p className="text-sm">Texto em fundo muted</p>
                </div>
                <div className="p-4 bg-black text-white rounded-md">
                  <p className="font-medium">Máximo Contraste</p>
                  <p className="text-sm opacity-90">Texto branco em fundo preto</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="semantic" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Estrutura Semântica</CardTitle>
            <CardDescription>
              Exemplos de uso correto de estruturas semânticas HTML
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <article>
                <header>
                  <h2 className="text-xl font-semibold">Artigo de Exemplo</h2>
                  <p className="text-sm text-muted-foreground">Publicado em: 30 de março de 2024</p>
                </header>
                <section className="my-4">
                  <h3 className="text-lg font-medium mb-2">Seção 1: Marcação Correta</h3>
                  <p>
                    Este exemplo demonstra o uso correto de elementos semânticos como
                    <code className="px-1 bg-muted rounded mx-1">header</code>,
                    <code className="px-1 bg-muted rounded mx-1">section</code>,
                    <code className="px-1 bg-muted rounded mx-1">article</code>, e
                    <code className="px-1 bg-muted rounded mx-1">footer</code>.
                  </p>
                </section>
                <section className="my-4">
                  <h3 className="text-lg font-medium mb-2">Seção 2: Listas</h3>
                  <p className="mb-2">Um exemplo de lista não ordenada:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Item 1 da lista</li>
                    <li>Item 2 da lista</li>
                    <li>Item 3 da lista</li>
                  </ul>
                </section>
                <footer className="mt-4 pt-2 border-t text-sm text-muted-foreground">
                  Exemplo de rodapé de artigo com informações adicionais.
                </footer>
              </article>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
} 