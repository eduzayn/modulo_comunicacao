import { AISettings } from './index';

export interface UpdateAISettingsInput {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  autoRespond?: boolean;
  sentimentAnalysis?: boolean;
  suggestResponses?: boolean;
}

export interface AIAnalysisResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  suggestedResponses?: string[];
  entities?: Record<string, any>;
  intent?: string;
}

export interface AIProcessingOptions {
  settings: AISettings;
  context?: Record<string, any>;
  history?: string[];
}
