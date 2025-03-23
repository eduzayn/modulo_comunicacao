'use server'

import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { lytexGateway } from '@/lib/lytex-gateway'
import { appErrors } from '@/types/actions'
import type { PaymentActionResponse, InvoiceActionResponse } from '@/types/actions'

// Cliente seguro para ações
const action = createSafeActionClient()

// Esquema para pagamento com cartão de crédito
const creditCardSchema = z.object({
  invoiceId: z.string().uuid(),
  cardNumber: z.string().regex(/^\d{16}$/, { message: 'Número de cartão inválido' }),
  holderName: z.string().min(3, { message: 'Nome do titular é obrigatório' }),
  expirationMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, { message: 'Mês de expiração inválido' }),
  expirationYear: z.string().regex(/^\d{4}$/, { message: 'Ano de expiração inválido' }),
  cvv: z.string().regex(/^\d{3,4}$/, { message: 'CVV inválido' }),
  installments: z.number().int().min(1).max(12).default(1),
  saveCard: z.boolean().default(false)
})

// Esquema para pagamento com boleto
const boletoSchema = z.object({
  invoiceId: z.string().uuid(),
  customerName: z.string().min(3, { message: 'Nome completo é obrigatório' }),
  customerDocument: z.string().min(11, { message: 'CPF/CNPJ é obrigatório' }),
  customerEmail: z.string().email({ message: 'Email inválido' }),
  customerPhone: z.string().min(10, { message: 'Telefone inválido' }),
  address: z.object({
    street: z.string().min(3, { message: 'Rua é obrigatória' }),
    number: z.string().min(1, { message: 'Número é obrigatório' }),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, { message: 'Bairro é obrigatório' }),
    city: z.string().min(2, { message: 'Cidade é obrigatória' }),
    state: z.string().length(2, { message: 'Estado inválido' }),
    zipCode: z.string().regex(/^\d{8}$/, { message: 'CEP inválido' })
  })
})

// Esquema para pagamento com PIX
const pixSchema = z.object({
  invoiceId: z.string().uuid(),
  customerName: z.string().min(3, { message: 'Nome completo é obrigatório' }),
  customerDocument: z.string().min(11, { message: 'CPF/CNPJ é obrigatório' }),
  customerEmail: z.string().email({ message: 'Email inválido' })
})

/**
 * Action para processar pagamento com cartão de crédito
 */
export const processCardPayment = action
  .schema(creditCardSchema)
  .action(async (input): Promise<PaymentActionResponse> => {
    try {
      const supabase = createServerComponentClient({ cookies })
      
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        return { 
          success: false, 
          error: appErrors.UNAUTHORIZED
        }
      }

      // Buscar informações da fatura
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .select('*, subscription:subscriptions(customer_id)')
        .eq('id', input.invoiceId)
        .single()

      if (invoiceError || !invoice) {
        return {
          success: false,
          error: appErrors.RESOURCE_NOT_FOUND
        }
      }

      // Verificar se o usuário tem permissão para pagar esta fatura
      // @ts-ignore - subscription é um objeto com customer_id
      if (invoice.subscription.customer_id !== session.user.id) {
        return {
          success: false,
          error: appErrors.UNAUTHORIZED
        }
      }

      // Processar o pagamento
      const paymentResult = await lytexGateway.processCreditCardPayment(
        invoice.amount_due,
        `Fatura #${invoice.invoice_number}`,
        {
          cardNumber: input.cardNumber,
          holderName: input.holderName,
          expirationMonth: input.expirationMonth,
          expirationYear: input.expirationYear,
          cvv: input.cvv
        },
        input.installments,
        { invoiceId: input.invoiceId }
      )

      if (!paymentResult.success) {
        // Mapear erros específicos do gateway
        const errorCode = paymentResult.errorCode || 'PAYMENT_FAILED'
        const errorMessage = paymentResult.message || appErrors.PAYMENT_FAILED.message
        
        return {
          success: false,
          error: {
            code: errorCode,
            message: errorMessage,
            details: paymentResult.gatewayResponse
          }
        }
      }

      // Se a opção de salvar cartão estiver ativada, salvar como método de pagamento
      if (input.saveCard) {
        await supabase.from('payment_methods').insert([
          {
            customer_id: session.user.id,
            type: 'credit_card',
            details: {
              lastFour: input.cardNumber.slice(-4),
              brand: detectCardBrand(input.cardNumber),
              expiryMonth: parseInt(input.expirationMonth),
              expiryYear: parseInt(input.expirationYear),
              holderName: input.holderName
            },
            is_default: false, // Definir como padrão apenas se for o primeiro cartão
            status: 'active'
          }
        ])
      }

      return {
        success: true,
        data: {
          transactionId: paymentResult.transactionId,
          status: paymentResult.status
        }
      }
    } catch (error) {
      console.error('Erro ao processar pagamento com cartão:', error)
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR
      }
    }
  })

/**
 * Action para gerar boleto
 */
export const generateBoleto = action
  .schema(boletoSchema)
  .action(async (input): Promise<PaymentActionResponse> => {
    try {
      const supabase = createServerComponentClient({ cookies })
      
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        return { 
          success: false, 
          error: appErrors.UNAUTHORIZED
        }
      }

      // Buscar informações da fatura
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .select('*, subscription:subscriptions(customer_id)')
        .eq('id', input.invoiceId)
        .single()

      if (invoiceError || !invoice) {
        return {
          success: false,
          error: appErrors.RESOURCE_NOT_FOUND
        }
      }

      // Verificar se o usuário tem permissão para pagar esta fatura
      // @ts-ignore - subscription é um objeto com customer_id
      if (invoice.subscription.customer_id !== session.user.id) {
        return {
          success: false,
          error: appErrors.UNAUTHORIZED
        }
      }

      // Calcular data de vencimento (3 dias a partir de hoje)
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 3)
      const dueDateStr = dueDate.toISOString().split('T')[0]

      // Gerar boleto
      const boletoResult = await lytexGateway.generateBoleto(
        invoice.amount_due,
        `Fatura #${invoice.invoice_number}`,
        {
          customerName: input.customerName,
          customerDocument: input.customerDocument,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          customerAddress: {
            street: input.address.street,
            number: input.address.number,
            complement: input.address.complement,
            neighborhood: input.address.neighborhood,
            city: input.address.city,
            state: input.address.state,
            zipCode: input.address.zipCode
          },
          dueDate: dueDateStr
        },
        { invoiceId: input.invoiceId }
      )

      if (!boletoResult.success) {
        return {
          success: false,
          error: {
            code: boletoResult.errorCode || 'PAYMENT_FAILED',
            message: boletoResult.message || appErrors.PAYMENT_FAILED.message,
            details: boletoResult.gatewayResponse
          }
        }
      }

      return {
        success: true,
        data: {
          transactionId: boletoResult.transactionId,
          status: boletoResult.status,
          paymentUrl: boletoResult.paymentUrl,
          barCode: boletoResult.barCode
        }
      }
    } catch (error) {
      console.error('Erro ao gerar boleto:', error)
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR
      }
    }
  })

/**
 * Action para gerar pagamento PIX
 */
export const generatePix = action
  .schema(pixSchema)
  .action(async (input): Promise<PaymentActionResponse> => {
    try {
      const supabase = createServerComponentClient({ cookies })
      
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        return { 
          success: false, 
          error: appErrors.UNAUTHORIZED
        }
      }

      // Buscar informações da fatura
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .select('*, subscription:subscriptions(customer_id)')
        .eq('id', input.invoiceId)
        .single()

      if (invoiceError || !invoice) {
        return {
          success: false,
          error: appErrors.RESOURCE_NOT_FOUND
        }
      }

      // Verificar se o usuário tem permissão para pagar esta fatura
      // @ts-ignore - subscription é um objeto com customer_id
      if (invoice.subscription.customer_id !== session.user.id) {
        return {
          success: false,
          error: appErrors.UNAUTHORIZED
        }
      }

      // Gerar PIX (válido por 24 horas)
      const pixResult = await lytexGateway.generatePix(
        invoice.amount_due,
        `Fatura #${invoice.invoice_number}`,
        {
          customerName: input.customerName,
          customerDocument: input.customerDocument,
          customerEmail: input.customerEmail
        },
        86400, // 24 horas em segundos
        { invoiceId: input.invoiceId }
      )

      if (!pixResult.success) {
        return {
          success: false,
          error: {
            code: pixResult.errorCode || 'PAYMENT_FAILED',
            message: pixResult.message || appErrors.PAYMENT_FAILED.message,
            details: pixResult.gatewayResponse
          }
        }
      }

      return {
        success: true,
        data: {
          transactionId: pixResult.transactionId,
          status: pixResult.status,
          paymentUrl: pixResult.paymentUrl,
          qrCodeData: pixResult.qrCodeData
        }
      }
    } catch (error) {
      console.error('Erro ao gerar PIX:', error)
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR
      }
    }
  })

/**
 * Action para verificar o status de uma transação
 */
export const checkPaymentStatus = action
  .schema(z.object({ transactionId: z.string() }))
  .action(async (input): Promise<PaymentActionResponse> => {
    try {
      const { status, gatewayResponse } = await lytexGateway.checkTransactionStatus(input.transactionId)
      
      return {
        success: true,
        data: {
          transactionId: input.transactionId,
          status
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error)
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR
      }
    }
  })

/**
 * Action para solicitar reembolso de uma transação
 */
export const requestRefund = action
  .schema(z.object({ 
    transactionId: z.string(),
    amount: z.number().optional(),
    reason: z.string().optional()
  }))
  .action(async (input): Promise<PaymentActionResponse> => {
    try {
      const supabase = createServerComponentClient({ cookies })
      
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        return { 
          success: false, 
          error: appErrors.UNAUTHORIZED
        }
      }

      // Verificar se o usuário tem permissão para solicitar reembolso
      // Aqui você pode adicionar lógica para verificar se o usuário é admin ou dono da transação

      // Solicitar reembolso
      const refundResult = await lytexGateway.requestRefund(
        input.transactionId,
        input.amount,
        input.reason
      )

      if (!refundResult.success) {
        return {
          success: false,
          error: {
            code: 'REFUND_FAILED',
            message: refundResult.message || 'Não foi possível processar o reembolso',
            details: refundResult.gatewayResponse
          }
        }
      }

      return {
        success: true,
        data: {
          transactionId: input.transactionId,
          status: 'refunded'
        }
      }
    } catch (error) {
      console.error('Erro ao solicitar reembolso:', error)
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR
      }
    }
  })

/**
 * Função auxiliar para detectar a bandeira do cartão com base no número
 */
function detectCardBrand(cardNumber: string): string {
  // Remover espaços
  const number = cardNumber.replace(/\s/g, '')
  
  // Verificar bandeira com base no prefixo
  if (/^4/.test(number)) return 'visa'
  if (/^5[1-5]/.test(number)) return 'mastercard'
  if (/^3[47]/.test(number)) return 'amex'
  if (/^6(?:011|5)/.test(number)) return 'discover'
  if (/^(?:2131|1800|35)/.test(number)) return 'jcb'
  if (/^3(?:0[0-5]|[68])/.test(number)) return 'diners'
  if (/^(5[06789]|6)/.test(number)) return 'elo'
  if (/^(606282|637095|637568|637599|637609|637612)/.test(number)) return 'hipercard'
  
  return 'unknown'
} 