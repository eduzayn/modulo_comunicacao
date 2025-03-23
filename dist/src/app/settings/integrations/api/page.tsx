'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Copy, RefreshCw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export default function ApiTokensPage() {
  const router = useRouter()
  const [showSecret, setShowSecret] = useState(false)
  const [showToken, setShowToken] = useState(false)
  const [showTokenV3, setShowTokenV3] = useState(false)
  
  // Simulando tokens armazenados
  const [secretToken, setSecretToken] = useState('••••••••••••••••••••••••••••••••••••••••••••••')
  const [accessToken, setAccessToken] = useState('••••••••••••••••••••••••••••••••••••••••••••••')
  const [tokenV3, setTokenV3] = useState('••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••')
  
  // Função para copiar token para a área de transferência
  const copyToClipboard = (text: string, tokenType: string) => {
    navigator.clipboard.writeText(text)
    alert(`O ${tokenType} foi copiado para a área de transferência.`)
  }
  
  // Função para gerar novo token
  const regenerateToken = (tokenType: string) => {
    // Simulando a geração de um novo token
    const newToken = `new_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    
    if (tokenType === 'secret') {
      setSecretToken(newToken)
    } else if (tokenType === 'token') {
      setAccessToken(newToken)
    } else if (tokenType === 'tokenV3') {
      setTokenV3(newToken)
    }
    
    alert(`Um novo ${tokenType} foi gerado com sucesso.`)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">API Tokens</h1>
      </div>
      
      <Tabs defaultValue="api" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="apps">Apps</TabsTrigger>
          <TabsTrigger value="plugins">Plugins</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center mb-8">
                <h2 className="text-2xl font-semibold mb-2">Tokens de acesso</h2>
                <p className="text-muted-foreground">Use seus tokens abaixo para usar a API do sistema</p>
              </div>
              
              <div className="space-y-8">
                {/* Secret Token */}
                <div className="space-y-2">
                  <h3 className="font-medium">Secret</h3>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input 
                        type={showSecret ? "text" : "password"} 
                        value={secretToken} 
                        readOnly 
                        className="pr-10"
                      />
                      <button 
                        onClick={() => setShowSecret(!showSecret)} 
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(secretToken, 'Secret')} title="Copiar">
                      <Copy size={18} />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => regenerateToken('secret')} title="Regenerar">
                      <RefreshCw size={18} />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Esse API Secret é usado para assinar seus tokens assim como as requisições enviadas para suas URLs de webhook.
                  </p>
                </div>
                
                {/* Token */}
                <div className="space-y-2">
                  <h3 className="font-medium">Token</h3>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input 
                        type={showToken ? "text" : "password"} 
                        value={accessToken} 
                        readOnly 
                        className="pr-10"
                      />
                      <button 
                        onClick={() => setShowToken(!showToken)} 
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(accessToken, 'Token')} title="Copiar">
                      <Copy size={18} />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => regenerateToken('token')} title="Regenerar">
                      <RefreshCw size={18} />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Token para permitir terceiros acesso às suas informações do sistema.
                  </p>
                </div>
                
                {/* Token v3 */}
                <div className="space-y-2">
                  <h3 className="font-medium">Token v3</h3>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input 
                        type={showTokenV3 ? "text" : "password"} 
                        value={tokenV3} 
                        readOnly 
                        className="pr-10"
                      />
                      <button 
                        onClick={() => setShowTokenV3(!showTokenV3)} 
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showTokenV3 ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(tokenV3, 'Token v3')} title="Copiar">
                      <Copy size={18} />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => regenerateToken('tokenV3')} title="Regenerar">
                      <RefreshCw size={18} />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Esse token é usado para autenticar suas requisições para a API v3 e está ligado ao operador que está acessando.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Documentação da API</CardTitle>
              <CardDescription>
                Consulte nossa documentação para aprender como integrar com nossa API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Guia de início rápido</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Aprenda o básico de autenticação e uso da API para começar rapidamente.
                    </p>
                    <Button variant="outline" className="w-full">Acessar guia</Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Referência completa</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Documentação detalhada com todos os endpoints, parâmetros e exemplos.
                    </p>
                    <Button variant="outline" className="w-full">Ver documentação</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">SDKs e bibliotecas</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Utilize nossas bibliotecas oficiais para facilitar a integração em diferentes linguagens.
                  </p>
                  <div className="grid gap-2 md:grid-cols-3">
                    <Button variant="outline" size="sm">JavaScript</Button>
                    <Button variant="outline" size="sm">PHP</Button>
                    <Button variant="outline" size="sm">Python</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plugins">
          <Card>
            <CardHeader>
              <CardTitle>Plugins</CardTitle>
              <CardDescription>
                Gerencie os plugins disponíveis para integração com o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Esta funcionalidade estará disponível em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="apps">
          <Card>
            <CardHeader>
              <CardTitle>Apps</CardTitle>
              <CardDescription>
                Gerencie os aplicativos conectados ao seu sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Esta funcionalidade estará disponível em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 