import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { 
  SentimentAnalysis, 
  SentimentType, 
  AIServiceResponse 
} from '../types';

// Esquema de validação
const textSchema = z.object({
  text: z.string().min(1, "Texto é obrigatório"),
});

const actionClient = createSafeActionClient();

/**
 * Versão mockada do serviço de análise de sentimento
 * Em produção, isso seria substituído por um serviço real como OpenAI
 */
export const sentimentService = {
  /**
   * Analisa o sentimento de um texto
   * @param text O texto a ser analisado
   * @returns Análise de sentimento com pontuação e confiança
   */
  analyzeText: actionClient
    .schema(textSchema)
    .action(async ({ parsedInput }): Promise<AIServiceResponse<SentimentAnalysis>> => {
      try {
        // Esta é uma implementação mockada para fins de desenvolvimento
        // Em produção, seria substituída por uma chamada a um serviço de IA real
        const text = parsedInput.text;
        
        // Implementação básica que usa contagem de palavras positivas e negativas
        const positiveWords = [
          'bom', 'excelente', 'ótimo', 'maravilhoso', 'satisfeito',
          'gosto', 'feliz', 'agradável', 'perfeito', 'incrível',
          'fantástico', 'adorei', 'sensacional', 'impressionante'
        ];
        
        const negativeWords = [
          'ruim', 'péssimo', 'terrível', 'horrível', 'insatisfeito',
          'não gosto', 'infeliz', 'desagradável', 'falha', 'decepcionado',
          'problema', 'decepciona', 'decepção', 'dificuldade', 'lento'
        ];
        
        // Análise simples baseada em palavras-chave
        const textLower = text.toLowerCase();
        let positiveCount = 0;
        let negativeCount = 0;
        
        // Contar ocorrências de palavras positivas
        positiveWords.forEach(word => {
          const regex = new RegExp(`\\b${word}\\b`, 'gi');
          const matches = textLower.match(regex);
          if (matches) {
            positiveCount += matches.length;
          }
        });
        
        // Contar ocorrências de palavras negativas
        negativeWords.forEach(word => {
          const regex = new RegExp(`\\b${word}\\b`, 'gi');
          const matches = textLower.match(regex);
          if (matches) {
            negativeCount += matches.length;
          }
        });
        
        // Calcular pontuação (-1.0 a 1.0)
        let score = 0;
        if (positiveCount > 0 || negativeCount > 0) {
          score = (positiveCount - negativeCount) / (positiveCount + negativeCount);
        }
        
        // Determinar o sentimento baseado na pontuação
        let sentiment: SentimentType;
        if (score > 0.2) {
          sentiment = SentimentType.POSITIVE;
        } else if (score < -0.2) {
          sentiment = SentimentType.NEGATIVE;
        } else {
          sentiment = SentimentType.NEUTRAL;
        }
        
        // Calcular confiança
        const totalKeywords = positiveCount + negativeCount;
        const confidence = Math.min(1.0, totalKeywords / 10);  // 10 palavras-chave = confiança máxima
        
        return {
          success: true,
          data: {
            text,
            sentiment,
            score,
            confidence
          }
        };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'SENTIMENT_ANALYSIS_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao analisar sentimento'
          }
        };
      }
    }),
    
  /**
   * Versão simplificada para uso direto sem action
   */
  analyzeSentiment(text: string): SentimentAnalysis {
    // Implementação simplificada para uso interno
    const positiveWords = ['bom', 'excelente', 'ótimo', 'gosto', 'feliz'];
    const negativeWords = ['ruim', 'péssimo', 'problema', 'difícil', 'não gosto'];
    
    const textLower = text.toLowerCase();
    
    let positiveCount = positiveWords.filter(word => textLower.includes(word)).length;
    let negativeCount = negativeWords.filter(word => textLower.includes(word)).length;
    
    // Calcular pontuação
    let score = 0;
    if (positiveCount > 0 || negativeCount > 0) {
      score = (positiveCount - negativeCount) / (positiveCount + negativeCount);
    }
    
    // Determinar o sentimento
    let sentiment: SentimentType;
    if (score > 0.2) {
      sentiment = SentimentType.POSITIVE;
    } else if (score < -0.2) {
      sentiment = SentimentType.NEGATIVE;
    } else {
      sentiment = SentimentType.NEUTRAL;
    }
    
    return {
      text,
      sentiment,
      score,
      confidence: Math.min(1.0, (positiveCount + negativeCount) / 5)
    };
  }
}; 