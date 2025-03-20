/**
 * Tipo base para todas as respostas das ações de servidor
 */
export interface ActionResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, any>
  }
}

/**
 * Resposta para ações relacionadas a pagamentos
 */
export interface PaymentActionResponse extends ActionResponse {
  data?: {
    transactionId?: string
    status?: 'completed' | 'pending' | 'failed' | 'refunded'
    paymentUrl?: string // Para boleto ou pix
    qrCodeData?: string // Para PIX
    barCode?: string // Para boleto
    redirectUrl?: string // URL para redirecionamento após pagamento
  }
}

/**
 * Resposta para ações relacionadas a assinaturas
 */
export interface SubscriptionActionResponse extends ActionResponse {
  data?: {
    subscriptionId?: string
    planId?: string
    status?: 'active' | 'inactive' | 'canceled' | 'past_due'
    currentPeriod?: {
      start: string
      end: string
    }
    isCanceled?: boolean
    cancelAtPeriodEnd?: boolean
  }
}

/**
 * Resposta para ações relacionadas a métodos de pagamento
 */
export interface PaymentMethodActionResponse extends ActionResponse {
  data?: {
    paymentMethodId?: string
    type?: 'credit_card' | 'boleto' | 'pix' | 'bank_transfer'
    isDefault?: boolean
    details?: {
      lastFour?: string
      brand?: string
      expiryMonth?: number
      expiryYear?: number
    }
  }
}

/**
 * Resposta para ações relacionadas a faturas
 */
export interface InvoiceActionResponse extends ActionResponse {
  data?: {
    invoiceId?: string
    invoiceNumber?: string
    amount?: number
    status?: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void'
    dueDate?: string
    isPaid?: boolean
    paidAt?: string
  }
}

/**
 * Códigos de erro padrão para as ações
 */
export const appErrors = {
  UNEXPECTED_ERROR: {
    code: 'UNEXPECTED_ERROR',
    message: 'Ocorreu um erro inesperado ao processar sua solicitação'
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Você não está autorizado a realizar esta ação'
  },
  INVALID_INPUT: {
    code: 'INVALID_INPUT',
    message: 'Os dados fornecidos são inválidos'
  },
  RESOURCE_NOT_FOUND: {
    code: 'RESOURCE_NOT_FOUND',
    message: 'O recurso solicitado não foi encontrado'
  },
  // Erros específicos para pagamentos
  PAYMENT_FAILED: {
    code: 'PAYMENT_FAILED',
    message: 'Não foi possível processar o pagamento'
  },
  PAYMENT_METHOD_INVALID: {
    code: 'PAYMENT_METHOD_INVALID',
    message: 'O método de pagamento é inválido ou expirou'
  },
  SUBSCRIPTION_CHANGE_FAILED: {
    code: 'SUBSCRIPTION_CHANGE_FAILED',
    message: 'Não foi possível atualizar a assinatura'
  },
  CARD_DECLINED: {
    code: 'CARD_DECLINED',
    message: 'O cartão foi recusado pela operadora'
  },
  INSUFFICIENT_FUNDS: {
    code: 'INSUFFICIENT_FUNDS',
    message: 'Fundos insuficientes para concluir a transação'
  }
} 