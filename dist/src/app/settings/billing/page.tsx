'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/ui/page-container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, MoreVertical, CreditCard, AlertCircle, Download, Calendar } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

// Dados de exemplo para a página
const subscriptionData = {
  plan: {
    name: 'PRO',
    expiryDate: '29 de Março de 2025',
    isActive: true,
  },
  items: [
    { description: 'Licenças de usuário', quantity: 19, price: 1501.00 },
    { description: 'Canais de WhatsApp', quantity: 3, price: 747.00 },
    { description: 'Canais de Instagram', quantity: 1, price: 50.00 },
    { description: 'Canais de Facebook', quantity: 1, price: 50.00 },
    { description: 'Canais de SMS', quantity: 1, price: 40.00 },
    { description: 'Canais de Email', quantity: 1, price: 30.00 },
  ],
  discount: {
    percentage: 20,
    value: 459.60
  },
  total: 1838.40,
  balance: 27.74,
  invoices: [
    { 
      id: '001',
      total: 1648.80, 
      status: 'pending', 
      startDate: '2025-03-27', 
      endDate: '2025-04-26', 
      paymentMethod: 'boleto' 
    },
    { 
      id: '002',
      total: 1386.40, 
      status: 'paid', 
      startDate: '2025-02-25', 
      endDate: '2025-03-24', 
      paymentMethod: 'boleto' 
    }
  ]
};

export default function BillingPage() {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState('subscription')
  
  // Formatar preço em formato brasileiro
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price).replace('R$', 'R$ ');
  }
  
  // Formatar data em formato brasileiro
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  return (
    <PageContainer>
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Assinatura e Faturamento</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie sua assinatura, fatura e forma de pagamento
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => router.push('/settings/billing/history')}>
              <Calendar className="mr-2 h-4 w-4" />
              Histórico de pagamentos
            </Button>
            <Button onClick={() => router.push('/settings/billing/upgrade')}>
              <Plus className="mr-2 h-4 w-4" />
              Atualizar plano
            </Button>
          </div>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="subscription">Assinatura</TabsTrigger>
            <TabsTrigger value="invoices">Faturas</TabsTrigger>
            <TabsTrigger value="payment-methods">Formas de Pagamento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="subscription">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    Assinatura
                    {subscriptionData.plan.isActive ? (
                      <Badge className="ml-2 bg-green-500" variant="secondary">Ativo</Badge>
                    ) : (
                      <Badge className="ml-2 bg-red-500" variant="secondary">Cancelado</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <span className="text-yellow-400 text-2xl">★</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{subscriptionData.plan.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Seu plano (Expira em {subscriptionData.plan.expiryDate})
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {subscriptionData.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2">
                        <span>
                          {item.quantity} {item.description}
                        </span>
                        <span className="font-medium">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    ))}
                    
                    <div className="flex justify-between items-center py-2 text-green-600">
                      <span>{subscriptionData.discount.percentage}% de desconto</span>
                      <span>- {formatPrice(subscriptionData.discount.value)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-t-2 pt-4">
                      <span className="font-bold">Total por mês</span>
                      <span className="font-bold text-xl">
                        {formatPrice(subscriptionData.total)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline" className="flex-1">
                      Alterar plano
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      Cancelar assinatura
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Saldo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded">
                    <p className="text-sm text-blue-700">
                      Adicione saldo para usar o assistente Kin
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Saldo disponível</span>
                    <span className="font-bold text-green-600">
                      {formatPrice(subscriptionData.balance)}
                    </span>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full">
                      Adicionar saldo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="invoices">
            {!subscriptionData.plan.isActive && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Sua assinatura foi cancelada. Atualize seu plano para voltar a usar o sistema.
                </AlertDescription>
              </Alert>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Faturas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-4 font-medium">Total</th>
                        <th className="text-left py-4 font-medium">Status</th>
                        <th className="text-left py-4 font-medium">Período</th>
                        <th className="text-left py-4 font-medium">Método de pagamento</th>
                        <th className="text-left py-4 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptionData.invoices.map((invoice, index) => (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="py-4">{formatPrice(invoice.total)}</td>
                          <td className="py-4">
                            {invoice.status === 'paid' ? (
                              <Badge className="bg-green-500">Pago</Badge>
                            ) : (
                              <Badge className="bg-yellow-500">Não pago</Badge>
                            )}
                          </td>
                          <td className="py-4">
                            {formatDate(invoice.startDate)} - {formatDate(invoice.endDate)}
                          </td>
                          <td className="py-4 capitalize">
                            <div className="flex items-center">
                              <CreditCard className="h-4 w-4 mr-2" />
                              {invoice.paymentMethod}
                            </div>
                          </td>
                          <td className="py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="cursor-pointer">
                                  <Download className="h-4 w-4 mr-2" />
                                  Baixar fatura
                                </DropdownMenuItem>
                                {invoice.status === 'pending' && (
                                  <DropdownMenuItem className="cursor-pointer">
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Pagar agora
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment-methods">
            <Card>
              <CardHeader>
                <CardTitle>Formas de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-2 border-blue-500">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <CreditCard className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Cartão de Crédito</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            •••• •••• •••• 4242
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expira em 12/2025
                          </p>
                          <Badge className="mt-2 bg-blue-500">Padrão</Badge>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="ghost" size="sm">Remover</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-dashed flex items-center justify-center h-[180px]">
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar novo método de pagamento
                    </Button>
                  </Card>
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium mb-4">Configurações de faturamento</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">Faturamento automático</p>
                        <p className="text-sm text-muted-foreground">
                          Débito automático no dia do vencimento
                        </p>
                      </div>
                      <div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Ativado
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">Receber faturas por email</p>
                        <p className="text-sm text-muted-foreground">
                          Email enviado no fechamento do ciclo de faturamento
                        </p>
                      </div>
                      <div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Ativado
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">Notificações de pagamento</p>
                        <p className="text-sm text-muted-foreground">
                          Lembretes de fatura e confirmações de pagamento
                        </p>
                      </div>
                      <div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Ativado
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
} 