import { useState } from 'react';
import { 
  MessageClassification, 
  MessageIntent, 
  EntityType, 
  NamedEntity 
} from '../types';
import { messageClassificationService } from '../services/message-classification-service';

interface UseMessageClassificationResult {
  classifyMessage: (messageId: string, text: string) => Promise<MessageClassification>;
  classifyMultipleMessages: (messages: { id: string, text: string }[]) => Promise<MessageClassification[]>;
  getIntentDistribution: (messages: MessageClassification[]) => Record<MessageIntent, number>;
  getEntitiesByType: (messages: MessageClassification[], entityType: EntityType) => NamedEntity[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook para facilitar a classificação de mensagens
 */
export function useMessageClassification(): UseMessageClassificationResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Classifica uma mensagem
   */
  const classifyMessage = async (messageId: string, text: string): Promise<MessageClassification> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Usando a versão direta do serviço para evitar complexidade adicional
      return messageClassificationService.classify(messageId, text);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao classificar mensagem';
      setError(errorMessage);
      
      // Retorna uma classificação padrão em caso de erro
      return {
        messageId,
        text,
        intent: MessageIntent.OTHER,
        confidence: 0
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Classifica múltiplas mensagens
   */
  const classifyMultipleMessages = async (messages: { id: string, text: string }[]): Promise<MessageClassification[]> => {
    try {
      setIsLoading(true);
      setError(null);
      
      return Promise.all(
        messages.map(message => messageClassificationService.classify(message.id, message.text))
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao classificar mensagens';
      setError(errorMessage);
      
      // Retorna classificações padrão em caso de erro
      return messages.map(message => ({
        messageId: message.id,
        text: message.text,
        intent: MessageIntent.OTHER,
        confidence: 0
      }));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Calcula a distribuição de intenções em um conjunto de mensagens
   */
  const getIntentDistribution = (messages: MessageClassification[]): Record<MessageIntent, number> => {
    // Inicializa o objeto de distribuição com zeros
    const distribution: Record<MessageIntent, number> = {
      [MessageIntent.QUESTION]: 0,
      [MessageIntent.COMPLAINT]: 0,
      [MessageIntent.FEEDBACK]: 0,
      [MessageIntent.REQUEST]: 0,
      [MessageIntent.GREETING]: 0,
      [MessageIntent.GOODBYE]: 0,
      [MessageIntent.GRATITUDE]: 0,
      [MessageIntent.OTHER]: 0
    };
    
    // Conta as ocorrências de cada intenção
    messages.forEach(message => {
      distribution[message.intent]++;
    });
    
    return distribution;
  };

  /**
   * Extrai entidades de um tipo específico de múltiplas mensagens
   */
  const getEntitiesByType = (messages: MessageClassification[], entityType: EntityType): NamedEntity[] => {
    const entities: NamedEntity[] = [];
    
    messages.forEach(message => {
      if (message.entities) {
        const filteredEntities = message.entities.filter(entity => entity.type === entityType);
        entities.push(...filteredEntities);
      }
    });
    
    return entities;
  };

  return {
    classifyMessage,
    classifyMultipleMessages,
    getIntentDistribution,
    getEntitiesByType,
    isLoading,
    error
  };
} 