import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type LytexPaymentMethod = 'credit_card' | 'boleto' | 'pix' | 'bank_transfer'

interface LytexCreditCardPaymentDetails {
  cardNumber: string
  holderName: string
  expirationMonth: string
  expirationYear: string
  cvv: string
}

interface LytexBoletoPaymentDetails {
  customerName: string
  customerDocument: string // CPF ou CNPJ
  customerEmail: string
  customerPhone: string
  customerAddress: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
  dueDate?: string // Data de vencimento (opcional)
}

interface LytexPixPaymentDetails {
  customerName: string
  customerDocument: string // CPF ou CNPJ
  customerEmail: string
}

interface LytexPaymentResponse {
  success: boolean
  transactionId?: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  paymentUrl?: string // URL para pagamento (boleto/pix)
  qrCodeData?: string // Dados do QR Code para PIX
  barCode?: string // Código de barras para boleto
  message?: string
  errorCode?: string
  gatewayResponse: Record<string, any>
}

// Classe para gerenciar operações com o gateway de pagamento Lytex
export class LytexGateway {
  private apiKey: string
  private apiSecret: string
  private apiBaseUrl: string
  private isSandbox: boolean

  constructor() {
    // Em produção, estas variáveis viriam do .env
    this.apiKey = process.env.NEXT_PUBLIC_LYTEX_API_KEY || 'sandbox_api_key'
    this.apiSecret = process.env.LYTEX_API_SECRET || 'sandbox_api_secret'
    this.isSandbox = process.env.NODE_ENV !== 'production'
    this.apiBaseUrl = this.isSandbox 
      ? 'https://sandbox.lytex.com.br/api/v1'
      : 'https://api.lytex.com.br/api/v1'
  }

  // Headers padrão para requisições à API
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'X-API-Secret': this.apiSecret
    }
  }

  // Processar pagamento com cartão de crédito
  async processCreditCardPayment(
    amount: number,
    description: string,
    paymentDetails: LytexCreditCardPaymentDetails,
    installments: number = 1,
    metadata?: Record<string, any>
  ): Promise<LytexPaymentResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/payments/credit-card`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          amount: amount * 100, // Convertendo para centavos
          description,
          card: {
            number: paymentDetails.cardNumber.replace(/\s/g, ''),
            holder_name: paymentDetails.holderName,
            expiration_month: paymentDetails.expirationMonth,
            expiration_year: paymentDetails.expirationYear,
            cvv: paymentDetails.cvv
          },
          installments,
          metadata
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Erro ao processar pagamento com cartão:', data)
        return {
          success: false,
          status: 'failed',
          message: data.message || 'Falha ao processar o pagamento com cartão',
          errorCode: data.error_code,
          gatewayResponse: data
        }
      }

      // Salvar no histórico de pagamentos
      await this.savePaymentToDatabase({
        paymentMethod: 'credit_card',
        amount,
        transactionId: data.transaction_id,
        status: data.status === 'approved' ? 'completed' : 'pending',
        gatewayResponse: data
      })

      return {
        success: true,
        transactionId: data.transaction_id,
        status: data.status === 'approved' ? 'completed' : 'pending',
        gatewayResponse: data
      }
    } catch (error) {
      console.error('Erro ao processar pagamento com cartão:', error)
      return {
        success: false,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Erro desconhecido ao processar pagamento',
        gatewayResponse: { error: String(error) }
      }
    }
  }

  // Gerar boleto para pagamento
  async generateBoleto(
    amount: number,
    description: string,
    paymentDetails: LytexBoletoPaymentDetails,
    metadata?: Record<string, any>
  ): Promise<LytexPaymentResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/payments/boleto`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          amount: amount * 100, // Convertendo para centavos
          description,
          customer: {
            name: paymentDetails.customerName,
            document: paymentDetails.customerDocument.replace(/\D/g, ''),
            email: paymentDetails.customerEmail,
            phone: paymentDetails.customerPhone,
            address: paymentDetails.customerAddress
          },
          due_date: paymentDetails.dueDate,
          metadata
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Erro ao gerar boleto:', data)
        return {
          success: false,
          status: 'failed',
          message: data.message || 'Falha ao gerar boleto',
          errorCode: data.error_code,
          gatewayResponse: data
        }
      }

      // Salvar no histórico de pagamentos
      await this.savePaymentToDatabase({
        paymentMethod: 'boleto',
        amount,
        transactionId: data.transaction_id,
        status: 'pending',
        gatewayResponse: data
      })

      return {
        success: true,
        transactionId: data.transaction_id,
        status: 'pending',
        paymentUrl: data.pdf_url,
        barCode: data.barcode,
        gatewayResponse: data
      }
    } catch (error) {
      console.error('Erro ao gerar boleto:', error)
      return {
        success: false,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Erro desconhecido ao gerar boleto',
        gatewayResponse: { error: String(error) }
      }
    }
  }

  // Gerar PIX para pagamento
  async generatePix(
    amount: number,
    description: string,
    paymentDetails: LytexPixPaymentDetails,
    expiresIn: number = 3600, // Tempo de expiração em segundos (padrão: 1 hora)
    metadata?: Record<string, any>
  ): Promise<LytexPaymentResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/payments/pix`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          amount: amount * 100, // Convertendo para centavos
          description,
          customer: {
            name: paymentDetails.customerName,
            document: paymentDetails.customerDocument.replace(/\D/g, ''),
            email: paymentDetails.customerEmail
          },
          expires_in: expiresIn,
          metadata
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Erro ao gerar PIX:', data)
        return {
          success: false,
          status: 'failed',
          message: data.message || 'Falha ao gerar PIX',
          errorCode: data.error_code,
          gatewayResponse: data
        }
      }

      // Salvar no histórico de pagamentos
      await this.savePaymentToDatabase({
        paymentMethod: 'pix',
        amount,
        transactionId: data.transaction_id,
        status: 'pending',
        gatewayResponse: data
      })

      return {
        success: true,
        transactionId: data.transaction_id,
        status: 'pending',
        paymentUrl: data.payment_url,
        qrCodeData: data.qr_code_data,
        gatewayResponse: data
      }
    } catch (error) {
      console.error('Erro ao gerar PIX:', error)
      return {
        success: false,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Erro desconhecido ao gerar PIX',
        gatewayResponse: { error: String(error) }
      }
    }
  }

  // Consultar status de uma transação
  async checkTransactionStatus(transactionId: string): Promise<{
    status: 'completed' | 'pending' | 'failed' | 'refunded',
    gatewayResponse: Record<string, any>
  }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/transactions/${transactionId}`, {
        method: 'GET',
        headers: this.getHeaders()
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Erro ao consultar status da transação:', data)
        return {
          status: 'failed',
          gatewayResponse: data
        }
      }

      // Mapear status do gateway para nosso formato
      let status: 'completed' | 'pending' | 'failed' | 'refunded' = 'pending'
      
      switch (data.status) {
        case 'approved':
          status = 'completed'
          break
        case 'pending':
        case 'processing':
          status = 'pending'
          break
        case 'failed':
        case 'declined':
          status = 'failed'
          break
        case 'refunded':
        case 'partially_refunded':
          status = 'refunded'
          break
      }

      // Atualizar status no banco de dados
      await this.updatePaymentStatus(transactionId, status, data)

      return {
        status,
        gatewayResponse: data
      }
    } catch (error) {
      console.error('Erro ao consultar status da transação:', error)
      return {
        status: 'failed',
        gatewayResponse: { error: String(error) }
      }
    }
  }

  // Solicitar reembolso total ou parcial
  async requestRefund(
    transactionId: string, 
    amount?: number, // Se não for informado, fará reembolso total
    reason?: string
  ): Promise<{
    success: boolean,
    message?: string,
    gatewayResponse: Record<string, any>
  }> {
    try {
      const payload: Record<string, any> = { reason: reason || 'Cliente solicitou reembolso' }
      
      // Se o valor foi especificado, é um reembolso parcial
      if (amount) {
        payload.amount = amount * 100 // Convertendo para centavos
      }

      const response = await fetch(`${this.apiBaseUrl}/transactions/${transactionId}/refund`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Erro ao solicitar reembolso:', data)
        return {
          success: false,
          message: data.message || 'Falha ao processar reembolso',
          gatewayResponse: data
        }
      }

      // Atualizar status no banco de dados
      await this.updatePaymentStatus(transactionId, 'refunded', data, reason)

      return {
        success: true,
        gatewayResponse: data
      }
    } catch (error) {
      console.error('Erro ao solicitar reembolso:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido ao processar reembolso',
        gatewayResponse: { error: String(error) }
      }
    }
  }

  // Webhook para receber notificações do gateway
  // Esta função seria chamada por um endpoint Next.js que recebe callbacks do Lytex
  async handleWebhook(payload: any): Promise<void> {
    try {
      // Verificar autenticidade do webhook (normalmente usando um header com uma assinatura)
      // if (!this.verifyWebhookSignature(payload, signature)) {
      //   throw new Error('Assinatura do webhook inválida')
      // }

      const { transaction_id, status, event_type } = payload

      if (event_type === 'payment.status_changed') {
        // Mapear status do gateway para nosso formato
        let mappedStatus: 'completed' | 'pending' | 'failed' | 'refunded' = 'pending'
        
        switch (status) {
          case 'approved':
            mappedStatus = 'completed'
            break
          case 'pending':
          case 'processing':
            mappedStatus = 'pending'
            break
          case 'failed':
          case 'declined':
            mappedStatus = 'failed'
            break
          case 'refunded':
          case 'partially_refunded':
            mappedStatus = 'refunded'
            break
        }

        // Atualizar status no banco de dados
        await this.updatePaymentStatus(transaction_id, mappedStatus, payload)
      }
    } catch (error) {
      console.error('Erro ao processar webhook:', error)
    }
  }

  // Salvar informações de pagamento no banco de dados
  private async savePaymentToDatabase({
    paymentMethod,
    amount,
    transactionId,
    status,
    gatewayResponse
  }: {
    paymentMethod: LytexPaymentMethod,
    amount: number,
    transactionId: string,
    status: 'completed' | 'pending' | 'failed' | 'refunded',
    gatewayResponse: Record<string, any>
  }) {
    try {
      const supabase = createClientComponentClient()
      
      // Recuperar o método de pagamento associado ao cliente
      // Isso deveria ser parametrizado em uma implementação real
      const { data: paymentMethods } = await supabase
        .from('payment_methods')
        .select('id')
        .eq('is_default', true)
        .limit(1)
      
      if (!paymentMethods || paymentMethods.length === 0) {
        console.error('Método de pagamento não encontrado para salvar histórico')
        return
      }

      // Recuperar a fatura não paga mais recente
      // Isso deveria ser parametrizado em uma implementação real
      const { data: invoices } = await supabase
        .from('invoices')
        .select('id')
        .eq('status', 'open')
        .order('due_date', { ascending: true })
        .limit(1)
      
      if (!invoices || invoices.length === 0) {
        console.error('Fatura não encontrada para associar ao pagamento')
        return
      }

      // Salvar no histórico de pagamentos
      const { error } = await supabase
        .from('payment_history')
        .insert([{
          invoice_id: invoices[0].id,
          payment_method_id: paymentMethods[0].id,
          transaction_id: transactionId,
          amount,
          status,
          payment_date: status === 'completed' ? new Date().toISOString() : null,
          gateway_response: gatewayResponse
        }])
      
      if (error) {
        console.error('Erro ao salvar histórico de pagamento:', error)
      }

      // Se o pagamento foi concluído, atualizar a fatura
      if (status === 'completed') {
        await supabase
          .from('invoices')
          .update({
            status: 'paid',
            amount_paid: amount,
            amount_remaining: 0,
            paid_at: new Date().toISOString()
          })
          .eq('id', invoices[0].id)
      }
    } catch (error) {
      console.error('Erro ao salvar no banco de dados:', error)
    }
  }

  // Atualizar status de pagamento no banco de dados
  private async updatePaymentStatus(
    transactionId: string,
    status: 'completed' | 'pending' | 'failed' | 'refunded',
    gatewayResponse: Record<string, any>,
    refundReason?: string
  ) {
    try {
      const supabase = createClientComponentClient()
      
      // Buscar o registro do pagamento
      const { data: payments, error: fetchError } = await supabase
        .from('payment_history')
        .select('id, invoice_id, amount')
        .eq('transaction_id', transactionId)
        .limit(1)
      
      if (fetchError || !payments || payments.length === 0) {
        console.error('Pagamento não encontrado para atualização de status:', fetchError)
        return
      }

      const payment = payments[0]
      const updateData: Record<string, any> = {
        status,
        gateway_response: gatewayResponse
      }

      // Adicionar campos específicos conforme o status
      if (status === 'completed') {
        updateData.payment_date = new Date().toISOString()
      } else if (status === 'refunded') {
        updateData.refunded_at = new Date().toISOString()
        updateData.refund_reason = refundReason
      }

      // Atualizar o registro de pagamento
      const { error: updateError } = await supabase
        .from('payment_history')
        .update(updateData)
        .eq('id', payment.id)
      
      if (updateError) {
        console.error('Erro ao atualizar status do pagamento:', updateError)
        return
      }

      // Atualizar status da fatura se necessário
      if (status === 'completed') {
        await supabase
          .from('invoices')
          .update({
            status: 'paid',
            amount_paid: payment.amount,
            amount_remaining: 0,
            paid_at: new Date().toISOString()
          })
          .eq('id', payment.invoice_id)
      } else if (status === 'refunded') {
        await supabase
          .from('invoices')
          .update({
            status: 'void'
          })
          .eq('id', payment.invoice_id)
      }
    } catch (error) {
      console.error('Erro ao atualizar status do pagamento:', error)
    }
  }
}

// Exportar uma instância única do gateway para uso em toda a aplicação
export const lytexGateway = new LytexGateway() 