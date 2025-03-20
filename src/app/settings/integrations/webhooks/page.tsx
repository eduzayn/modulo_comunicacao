'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function WebhooksPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Webhooks</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Configuração de Webhooks</CardTitle>
          <CardDescription>
            Configure notificações em tempo real para eventos do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Funcionalidade em desenvolvimento</AlertTitle>
            <AlertDescription>
              A configuração de webhooks estará disponível em breve. Este recurso permitirá
              que você receba notificações em tempo real de eventos do sistema, como novas
              mensagens, atualizações de contatos e mudanças de status.
            </AlertDescription>
          </Alert>
          
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-medium mb-2">Aguarde as novidades!</h3>
            <p className="text-muted-foreground mb-4">
              Estamos trabalhando para disponibilizar este recurso o mais breve possível.
              Você poderá configurar endpoints para receber notificações de:
            </p>
            <ul className="list-disc text-left space-y-2 mb-4">
              <li>Novas mensagens recebidas</li>
              <li>Atualizações de status de conversas</li>
              <li>Mudanças em contatos</li>
              <li>Eventos de automação</li>
              <li>E muito mais...</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 