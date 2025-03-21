export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  interval: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  isRecommended: boolean;
  maxUsers: number;
  maxChannels: {
    whatsapp?: number;
    email?: number;
    sms?: number;
    chat?: number;
    push?: number;
    instagram?: number;
    facebook?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionItem {
  description: string;
  quantity: number;
  price: number;
}

export interface SubscriptionDiscount {
  percentage: number;
  value: number;
}

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  plan: {
    name: string;
    expiryDate: string;
    isActive: boolean;
  };
  status: 'active' | 'inactive' | 'canceled' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  items: SubscriptionItem[];
  discount: SubscriptionDiscount;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  invoiceNumber: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  amountDue: number;
  amountPaid: number;
  amountRemaining: number;
  dueDate: string;
  periodStart: string;
  periodEnd: string;
  paymentMethod?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  customerId: string;
  type: 'credit_card' | 'boleto' | 'pix' | 'bank_transfer';
  details: {
    lastFour?: string; // Para cartões: últimos 4 dígitos
    brand?: string;    // Para cartões: bandeira
    expiryMonth?: number; // Para cartões
    expiryYear?: number;  // Para cartões
    holderName?: string;
    [key: string]: any; // Outros detalhes específicos do método
  };
  isDefault: boolean;
  expiresAt?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentHistory {
  id: string;
  invoiceId: string;
  paymentMethodId: string;
  transactionId?: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentDate?: string;
  refundedAt?: string;
  refundReason?: string;
  gatewayResponse?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerBalance {
  id: string;
  customerId: string;
  balance: number;
  lastTopupAmount?: number;
  lastTopupDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillingSettings {
  id: string;
  customerId: string;
  autoBilling: boolean;
  sendInvoiceEmails: boolean;
  paymentNotifications: boolean;
  taxId?: string; // CPF/CNPJ
  billingAddress?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Interface para os dados que são exibidos na página de faturamento
export interface SubscriptionData {
  plan: {
    name: string;
    expiryDate: string;
    isActive: boolean;
  };
  items: SubscriptionItem[];
  discount: SubscriptionDiscount;
  total: number;
  balance: number;
  invoices: {
    id: string;
    total: number;
    status: 'paid' | 'pending';
    startDate: string;
    endDate: string;
    paymentMethod: string;
  }[];
}

// Interfaces para o histórico de pagamentos
export interface PaymentHistoryItem {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  method: 'credit_card' | 'boleto' | 'pix' | 'bank_transfer';
  invoiceNumber: string;
  paymentId: string;
}

// Interface para os ciclos de cobrança disponíveis
export interface BillingCycle {
  id: 'monthly' | 'quarterly' | 'yearly';
  name: string;
  description: string;
  multiplier: number;
  discount: number;
} 