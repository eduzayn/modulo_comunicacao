'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/ui/page-container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Download, CreditCard, Check, Calendar, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Dados de exemplo do histórico de pagamentos
const paymentHistory = [
  {
    id: '001',
    date: '2025-03-14',
    amount: 1838.40,
    status: 'completed',
    method: 'credit_card',
    invoiceNumber: 'INV-2025-001',
    paymentId: 'PAY-2025-00124'
  },
  {
    id: '002',
    date: '2025-02-14',
    amount: 1838.40,
    status: 'completed',
    method: 'credit_card',
    invoiceNumber: 'INV-2025-002',
    paymentId: 'PAY-2025-00092'
  },
  {
    id: '003',
    date: '2025-01-14',
    amount: 1609.60,
    status: 'completed',
    method: 'boleto',
    invoiceNumber: 'INV-2025-003',
    paymentId: 'PAY-2025-00068'
  },
  {
    id: '004',
    date: '2024-12-14',
    amount: 1609.60,
    status: 'completed',
    method: 'boleto',
    invoiceNumber: 'INV-2024-012',
    paymentId: 'PAY-2024-00289'
  },
  {
    id: '005',
    date: '2024-11-14',
    amount: 1609.60,
    status: 'completed',
    method: 'credit_card',
    invoiceNumber: 'INV-2024-011',
    paymentId: 'PAY-2024-00254'
  },
  {
    id: '006',
    date: '2024-10-14',
    amount: 1609.60,
    status: 'refunded',
    method: 'credit_card',
    invoiceNumber: 'INV-2024-010',
    paymentId: 'PAY-2024-00231'
  }
];

export default function PaymentHistoryPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  
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
  
  // Filtra os pagamentos com base nos critérios de busca e filtros
  const filteredPayments = paymentHistory.filter(payment => {
    // Filtro de busca por ID ou número de fatura
    const searchMatches = searchQuery === '' || 
      payment.paymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtro por data (ano e mês)
    const dateMatches = dateFilter === '' || payment.date.includes(dateFilter);
    
    // Filtro por status
    const statusMatches = statusFilter === '' || payment.status === statusFilter;
    
    return searchMatches && dateMatches && statusMatches;
  });

  return (
    <PageContainer>
      <div className="flex flex-col space-y-8">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/settings/billing')}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Button>
          <h1 className="text-2xl font-bold">Histórico de Pagamentos</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center relative">
                <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por ID ou número da fatura..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os períodos</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025-03">Março 2025</SelectItem>
                  <SelectItem value="2025-02">Fevereiro 2025</SelectItem>
                  <SelectItem value="2025-01">Janeiro 2025</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="failed">Falhou</SelectItem>
                  <SelectItem value="refunded">Reembolsado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Histórico de Pagamentos</span>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">Data</th>
                    <th className="text-left py-3 px-2 font-medium">ID do Pagamento</th>
                    <th className="text-left py-3 px-2 font-medium">Fatura</th>
                    <th className="text-left py-3 px-2 font-medium">Valor</th>
                    <th className="text-left py-3 px-2 font-medium">Método</th>
                    <th className="text-left py-3 px-2 font-medium">Status</th>
                    <th className="text-right py-3 px-2 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhum pagamento encontrado com os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2">{formatDate(payment.date)}</td>
                        <td className="py-3 px-2 font-medium">{payment.paymentId}</td>
                        <td className="py-3 px-2">{payment.invoiceNumber}</td>
                        <td className="py-3 px-2 font-medium">{formatPrice(payment.amount)}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center">
                            {payment.method === 'credit_card' ? (
                              <>
                                <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
                                <span>Cartão de Crédito</span>
                              </>
                            ) : (
                              <>
                                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                <span>Boleto</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          {payment.status === 'completed' ? (
                            <Badge className="bg-green-500">Concluído</Badge>
                          ) : payment.status === 'pending' ? (
                            <Badge className="bg-yellow-500">Pendente</Badge>
                          ) : payment.status === 'failed' ? (
                            <Badge className="bg-red-500">Falhou</Badge>
                          ) : (
                            <Badge className="bg-blue-500">Reembolsado</Badge>
                          )}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Download className="h-4 w-4 mr-1" />
                            Recibo
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
} 