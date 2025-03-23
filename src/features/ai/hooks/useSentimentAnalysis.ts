import { useState } from 'react';
import { 
  SentimentAnalysis, 
  SentimentType 
} from '../types';
import { sentimentService } from '../services/sentiment-service';

interface UseSentimentAnalysisResult {
  analyzeSentiment: (text: string) => Promise<SentimentAnalysis>;
  analyzeTexts: (texts: string[]) => Promise<SentimentAnalysis[]>;
  getAverageSentiment: (texts: string[]) => Promise<{
    averageScore: number;
    dominantSentiment: SentimentType;
    confidence: number;
  }>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook para facilitar a análise de sentimento em mensagens
 */
export function useSentimentAnalysis(): UseSentimentAnalysisResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Analisa o sentimento de um texto
   */
  const analyzeSentiment = async (text: string): Promise<SentimentAnalysis> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Usando a versão direta do serviço para evitar complexidade adicional
      return sentimentService.analyzeSentiment(text);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao analisar sentimento';
      setError(errorMessage);
      
      // Retorna um resultado neutro em caso de erro
      return {
        text,
        sentiment: SentimentType.NEUTRAL,
        score: 0,
        confidence: 0
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Analisa o sentimento de múltiplos textos
   */
  const analyzeTexts = async (texts: string[]): Promise<SentimentAnalysis[]> => {
    try {
      setIsLoading(true);
      setError(null);
      
      return Promise.all(texts.map(text => sentimentService.analyzeSentiment(text)));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao analisar sentimentos';
      setError(errorMessage);
      
      // Retorna resultados neutros em caso de erro
      return texts.map(text => ({
        text,
        sentiment: SentimentType.NEUTRAL,
        score: 0,
        confidence: 0
      }));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Calcula o sentimento médio de múltiplos textos
   */
  const getAverageSentiment = async (texts: string[]) => {
    if (!texts.length) {
      return {
        averageScore: 0,
        dominantSentiment: SentimentType.NEUTRAL,
        confidence: 0
      };
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const sentiments = await analyzeTexts(texts);
      
      // Calcular pontuação média
      const totalScore = sentiments.reduce((sum, sentiment) => sum + sentiment.score, 0);
      const averageScore = totalScore / sentiments.length;
      
      // Calcular confiança média
      const totalConfidence = sentiments.reduce((sum, sentiment) => sum + sentiment.confidence, 0);
      const confidence = totalConfidence / sentiments.length;
      
      // Determinar o sentimento dominante
      let dominantSentiment: SentimentType;
      if (averageScore > 0.2) {
        dominantSentiment = SentimentType.POSITIVE;
      } else if (averageScore < -0.2) {
        dominantSentiment = SentimentType.NEGATIVE;
      } else {
        dominantSentiment = SentimentType.NEUTRAL;
      }
      
      return {
        averageScore,
        dominantSentiment,
        confidence
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao calcular sentimento médio';
      setError(errorMessage);
      
      return {
        averageScore: 0,
        dominantSentiment: SentimentType.NEUTRAL,
        confidence: 0
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analyzeSentiment,
    analyzeTexts,
    getAverageSentiment,
    isLoading,
    error
  };
} 