/**
 * Tipos para recurso de análise de sentimento
 */
export enum SentimentType {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative'
}

export interface SentimentAnalysis {
  text: string;
  sentiment: SentimentType;
  score: number; // valor entre -1.0 e 1.0
  confidence: number; // valor entre 0.0 e 1.0
}

/**
 * Tipos para classificação automática
 */
export enum MessageIntent {
  QUESTION = 'question',
  COMPLAINT = 'complaint',
  FEEDBACK = 'feedback',
  REQUEST = 'request',
  GREETING = 'greeting',
  GOODBYE = 'goodbye',
  GRATITUDE = 'gratitude',
  OTHER = 'other'
}

export interface MessageClassification {
  messageId: string;
  text: string;
  intent: MessageIntent;
  confidence: number;
  entities?: NamedEntity[];
}

/**
 * Tipos para extração de entidades
 */
export enum EntityType {
  PERSON = 'person',
  ORGANIZATION = 'organization',
  LOCATION = 'location',
  PRODUCT = 'product',
  DATE = 'date',
  EMAIL = 'email',
  PHONE = 'phone',
  URL = 'url',
  OTHER = 'other'
}

export interface NamedEntity {
  text: string;
  type: EntityType;
  start: number;
  end: number;
  score: number;
}

/**
 * Tipos para resumo de conversação
 */
export interface ConversationSummary {
  conversationId: string;
  text: string;
  keyPoints: string[];
  topics: string[];
  actionItems?: string[];
}

/**
 * Tipo de resposta genérica para serviços de IA
 */
export interface AIServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
} 