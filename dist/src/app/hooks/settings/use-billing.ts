'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { SubscriptionData, SubscriptionPlan, PaymentHistoryItem, PaymentMethod, BillingSettings } from '@/types/billing'
import { useToast } from '@/components/ui/use-toast'

// Cliente Supabase
const supabase = createClientComponentClient()

/**
 * Hook para gerenciar os dados da assinatura atual do cliente
 */
export function useSubscription() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  // Buscar dados da assinatura atual
  const {
    data: subscription,
    isLoading,
    error
  } = useQuery({
    queryKey: ['subscription'],
    queryFn: async (): Promise<SubscriptionData> => {
      try {
        // Na versão final, isso buscaria dados reais do banco
        // const { data, error } = await supabase
        //   .from('subscriptions')
        //   .select('*, plan:subscription_plans(*)')
        //   .single()
        
        // if (error) throw error
        
        // Por enquanto, retornaremos dados de exemplo
        return {
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
        }
      } catch (err) {
        console.error('Erro ao buscar dados da assinatura:', err)
        throw new Error('Não foi possível carregar os dados da assinatura. Tente novamente mais tarde.')
      }
    }
  })
  
  // Cancelar assinatura
  const { mutate: cancelSubscription, isPending: isCancelling } = useMutation({
    mutationFn: async () => {
      try {
        // Na versão final, isso enviaria a solicitação real para o banco
        // const { error } = await supabase
        //   .from('subscriptions')
        //   .update({ 
        //     status: 'canceled',
        //     cancel_at_period_end: true,
        //     canceled_at: new Date().toISOString()
        //   })
        //   .eq('id', subscription?.id)
        
        // if (error) throw error
        
        // Simulação de atraso
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        return true
      } catch (err) {
        console.error('Erro ao cancelar assinatura:', err)
        throw new Error('Não foi possível cancelar a assinatura. Tente novamente mais tarde.')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
      toast({
        title: 'Assinatura cancelada',
        description: 'Sua assinatura foi cancelada com sucesso e será válida até o final do período já pago.',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao cancelar assinatura',
        description: error.message,
      })
    }
  })
  
  // Adicionar saldo à conta
  const { mutate: addBalance, isPending: isAddingBalance } = useMutation({
    mutationFn: async (amount: number) => {
      try {
        // Na versão final, isso enviaria a solicitação real para o banco
        // const { error } = await supabase
        //   .from('customer_balance')
        //   .update({ 
        //     balance: subscription?.balance + amount,
        //     last_topup_amount: amount,
        //     last_topup_date: new Date().toISOString()
        //   })
        //   .eq('customer_id', customerId)
        
        // if (error) throw error
        
        // Simulação de atraso
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        return { amount }
      } catch (err) {
        console.error('Erro ao adicionar saldo:', err)
        throw new Error('Não foi possível adicionar saldo. Tente novamente mais tarde.')
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
      toast({
        title: 'Saldo adicionado',
        description: `R$ ${data.amount.toFixed(2)} foram adicionados ao seu saldo com sucesso.`,
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar saldo',
        description: error.message,
      })
    }
  })
  
  return {
    subscription,
    isLoading,
    error,
    cancelSubscription,
    isCancelling,
    addBalance,
    isAddingBalance
  }
}

/**
 * Hook para gerenciar os planos disponíveis
 */
export function useSubscriptionPlans() {
  const { toast } = useToast()
  
  // Buscar planos disponíveis
  const {
    data: plans,
    isLoading,
    error
  } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async (): Promise<SubscriptionPlan[]> => {
      try {
        // Na versão final, isso buscaria dados reais do banco
        // const { data, error } = await supabase
        //   .from('subscription_plans')
        //   .select('*')
        //   .order('price', { ascending: true })
        
        // if (error) throw error
        
        // Por enquanto, retornaremos dados de exemplo
        return [
          {
            id: 'basic',
            name: 'BÁSICO',
            description: 'Plano básico para equipes pequenas',
            price: 799.90,
            interval: 'monthly',
            features: [
              '5 usuários incluídos',
              '1 canal de WhatsApp',
              'Suporte por email',
              'Acesso ao painel de análises básico',
              'Automações limitadas'
            ],
            isRecommended: false,
            maxUsers: 5,
            maxChannels: {
              whatsapp: 1,
              email: 1,
              sms: 1
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'pro',
            name: 'PRO',
            description: 'Plano ideal para empresas em crescimento',
            price: 1599.90,
            discountPrice: 1279.90,
            discountPercentage: 20,
            interval: 'monthly',
            features: [
              '20 usuários incluídos',
              '3 canais de WhatsApp',
              '1 canal de Instagram',
              '1 canal de Facebook',
              'Suporte prioritário',
              'Acesso a todas as automações',
              'Assistente AI Kin ilimitado',
              'APIs para integrações'
            ],
            isRecommended: true,
            maxUsers: 20,
            maxChannels: {
              whatsapp: 3,
              email: 5,
              sms: 3,
              instagram: 1,
              facebook: 1
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'enterprise',
            name: 'ENTERPRISE',
            description: 'Plano completo para grandes empresas',
            price: 3299.90,
            interval: 'monthly',
            features: [
              'Usuários ilimitados',
              'Canais ilimitados',
              'Suporte VIP 24/7',
              'Gerente de conta dedicado',
              'Treinamento personalizado',
              'Customizações específicas',
              'SLA garantido',
              'Hospedagem dedicada'
            ],
            isRecommended: false,
            maxUsers: 999,
            maxChannels: {
              whatsapp: 99,
              email: 99,
              sms: 99,
              instagram: 99,
              facebook: 99
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
      } catch (err) {
        console.error('Erro ao buscar planos de assinatura:', err)
        throw new Error('Não foi possível carregar os planos disponíveis. Tente novamente mais tarde.')
      }
    }
  })
  
  return {
    plans,
    isLoading,
    error
  }
}

/**
 * Hook para gerenciar o histórico de pagamentos
 */
export function usePaymentHistory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  
  // Buscar histórico de pagamentos
  const {
    data: paymentHistory,
    isLoading,
    error
  } = useQuery({
    queryKey: ['payment-history'],
    queryFn: async (): Promise<PaymentHistoryItem[]> => {
      try {
        // Na versão final, isso buscaria dados reais do banco
        // const { data, error } = await supabase
        //   .from('payment_history')
        //   .select('*, invoice:invoices(*)')
        //   .order('payment_date', { ascending: false })
        
        // if (error) throw error
        
        // Por enquanto, retornaremos dados de exemplo
        return [
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
        ]
      } catch (err) {
        console.error('Erro ao buscar histórico de pagamentos:', err)
        throw new Error('Não foi possível carregar o histórico de pagamentos. Tente novamente mais tarde.')
      }
    }
  })
  
  // Filtra os pagamentos com base nos critérios
  const filteredPayments = paymentHistory?.filter(payment => {
    // Filtro de busca por ID ou número de fatura
    const searchMatches = !searchQuery || 
      payment.paymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtro por data (ano e mês)
    const dateMatches = !dateFilter || payment.date.includes(dateFilter);
    
    // Filtro por status
    const statusMatches = !statusFilter || payment.status === statusFilter;
    
    return searchMatches && dateMatches && statusMatches;
  }) || [];
  
  return {
    paymentHistory,
    filteredPayments,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    dateFilter,
    setDateFilter,
    statusFilter,
    setStatusFilter
  }
}

/**
 * Hook para gerenciar os métodos de pagamento
 */
export function usePaymentMethods() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  // Buscar métodos de pagamento
  const {
    data: paymentMethods,
    isLoading,
    error
  } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: async (): Promise<PaymentMethod[]> => {
      try {
        // Na versão final, isso buscaria dados reais do banco
        // const { data, error } = await supabase
        //   .from('payment_methods')
        //   .select('*')
        //   .order('is_default', { ascending: false })
        
        // if (error) throw error
        
        // Por enquanto, retornaremos dados de exemplo
        return [
          {
            id: '1',
            customerId: 'customer-123',
            type: 'credit_card',
            details: {
              lastFour: '4242',
              brand: 'visa',
              expiryMonth: 12,
              expiryYear: 2025,
              holderName: 'JOÃO SILVA'
            },
            isDefault: true,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
      } catch (err) {
        console.error('Erro ao buscar métodos de pagamento:', err)
        throw new Error('Não foi possível carregar os métodos de pagamento. Tente novamente mais tarde.')
      }
    }
  })
  
  // Adicionar novo método de pagamento
  const { mutate: addPaymentMethod, isPending: isAddingPaymentMethod } = useMutation({
    mutationFn: async (data: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        // Na versão final, isso enviaria a solicitação real para o banco
        // const { error } = await supabase
        //   .from('payment_methods')
        //   .insert([data])
        
        // if (error) throw error
        
        // Simulação de atraso
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        return true
      } catch (err) {
        console.error('Erro ao adicionar método de pagamento:', err)
        throw new Error('Não foi possível adicionar o método de pagamento. Tente novamente mais tarde.')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] })
      toast({
        title: 'Método de pagamento adicionado',
        description: 'Seu novo método de pagamento foi adicionado com sucesso.',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar método de pagamento',
        description: error.message,
      })
    }
  })
  
  // Remover método de pagamento
  const { mutate: removePaymentMethod, isPending: isRemovingPaymentMethod } = useMutation({
    mutationFn: async (id: string) => {
      try {
        // Na versão final, isso enviaria a solicitação real para o banco
        // const { error } = await supabase
        //   .from('payment_methods')
        //   .delete()
        //   .eq('id', id)
        
        // if (error) throw error
        
        // Simulação de atraso
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        return true
      } catch (err) {
        console.error('Erro ao remover método de pagamento:', err)
        throw new Error('Não foi possível remover o método de pagamento. Tente novamente mais tarde.')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] })
      toast({
        title: 'Método de pagamento removido',
        description: 'O método de pagamento foi removido com sucesso.',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover método de pagamento',
        description: error.message,
      })
    }
  })
  
  return {
    paymentMethods,
    isLoading,
    error,
    addPaymentMethod,
    isAddingPaymentMethod,
    removePaymentMethod,
    isRemovingPaymentMethod
  }
}

/**
 * Hook para gerenciar as configurações de faturamento
 */
export function useBillingSettings() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  // Buscar configurações de faturamento
  const {
    data: settings,
    isLoading,
    error
  } = useQuery({
    queryKey: ['billing-settings'],
    queryFn: async (): Promise<BillingSettings> => {
      try {
        // Na versão final, isso buscaria dados reais do banco
        // const { data, error } = await supabase
        //   .from('billing_settings')
        //   .select('*')
        //   .single()
        
        // if (error) throw error
        
        // Por enquanto, retornaremos dados de exemplo
        return {
          id: 'settings-1',
          customerId: 'customer-123',
          autoBilling: true,
          sendInvoiceEmails: true,
          paymentNotifications: true,
          taxId: '123.456.789-00',
          billingAddress: {
            street: 'Rua Exemplo',
            number: '1234',
            city: 'São Paulo',
            state: 'SP',
            postalCode: '01234-567',
            country: 'Brasil'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      } catch (err) {
        console.error('Erro ao buscar configurações de faturamento:', err)
        throw new Error('Não foi possível carregar as configurações de faturamento. Tente novamente mais tarde.')
      }
    }
  })
  
  // Atualizar configurações de faturamento
  const { mutate: updateSettings, isPending: isUpdating } = useMutation({
    mutationFn: async (data: Partial<BillingSettings>) => {
      try {
        // Na versão final, isso enviaria a solicitação real para o banco
        // const { error } = await supabase
        //   .from('billing_settings')
        //   .update(data)
        //   .eq('id', settings?.id)
        
        // if (error) throw error
        
        // Simulação de atraso
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        return { ...settings, ...data }
      } catch (err) {
        console.error('Erro ao atualizar configurações de faturamento:', err)
        throw new Error('Não foi possível atualizar as configurações de faturamento. Tente novamente mais tarde.')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-settings'] })
      toast({
        title: 'Configurações atualizadas',
        description: 'As configurações de faturamento foram atualizadas com sucesso.',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar configurações',
        description: error.message,
      })
    }
  })
  
  return {
    settings,
    isLoading,
    error,
    updateSettings,
    isUpdating
  }
} 