import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { 
  MessageClassification, 
  MessageIntent, 
  EntityType,
  NamedEntity,
  AIServiceResponse 
} from '../types';

// Esquema de validação
const messageSchema = z.object({
  messageId: z.string().min(1, "ID da mensagem é obrigatório"),
  text: z.string().min(1, "Texto é obrigatório"),
});

const actionClient = createSafeActionClient();

/**
 * Serviço de classificação de mensagens
 * Versão inicial com implementação mock
 */
export const messageClassificationService = {
  /**
   * Classifica uma mensagem para identificar a intenção e entidades
   */
  classifyMessage: actionClient
    .schema(messageSchema)
    .action(async ({ parsedInput }): Promise<AIServiceResponse<MessageClassification>> => {
      try {
        const { messageId, text } = parsedInput;
        
        // Mock de classificação baseada em regras simples
        // Em produção, isso seria substituído por modelos de ML
        
        const textLower = text.toLowerCase();
        let intent = MessageIntent.OTHER;
        let confidence = 0.7; // Valor padrão
        
        // Regras básicas para classificação
        if (textLower.includes('?') || 
            textLower.startsWith('como') || 
            textLower.startsWith('o que') || 
            textLower.startsWith('quando') || 
            textLower.startsWith('onde') || 
            textLower.startsWith('por que')) {
          intent = MessageIntent.QUESTION;
          confidence = 0.9;
        } 
        else if (textLower.includes('problema') || 
                textLower.includes('reclamação') || 
                textLower.includes('insatisfeito') || 
                textLower.includes('não funciona') || 
                textLower.includes('defeito')) {
          intent = MessageIntent.COMPLAINT;
          confidence = 0.85;
        }
        else if (textLower.includes('sugestão') || 
                textLower.includes('feedback') || 
                textLower.includes('opinião') || 
                textLower.includes('avaliação')) {
          intent = MessageIntent.FEEDBACK;
          confidence = 0.8;
        }
        else if (textLower.includes('preciso') || 
                textLower.includes('solicito') || 
                textLower.includes('gostaria de') || 
                textLower.includes('pode me') || 
                textLower.includes('quero')) {
          intent = MessageIntent.REQUEST;
          confidence = 0.7;
        }
        else if (textLower.includes('olá') || 
                textLower.includes('oi') || 
                textLower.includes('bom dia') || 
                textLower.includes('boa tarde') || 
                textLower.includes('boa noite')) {
          intent = MessageIntent.GREETING;
          confidence = 0.95;
        }
        else if (textLower.includes('tchau') || 
                textLower.includes('até logo') || 
                textLower.includes('até mais') || 
                textLower.includes('adeus')) {
          intent = MessageIntent.GOODBYE;
          confidence = 0.95;
        }
        else if (textLower.includes('obrigado') || 
                textLower.includes('obrigada') || 
                textLower.includes('agradeço') || 
                textLower.includes('grato')) {
          intent = MessageIntent.GRATITUDE;
          confidence = 0.9;
        }
        
        // Extração básica de entidades
        const entities: NamedEntity[] = [];
        
        // Extração de e-mails
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        let match;
        while ((match = emailRegex.exec(text)) !== null) {
          entities.push({
            text: match[0],
            type: EntityType.EMAIL,
            start: match.index,
            end: match.index + match[0].length,
            score: 0.99
          });
        }
        
        // Extração de telefones
        const phoneRegex = /(\+\d{1,3}\s?)?(\(\d{2,3}\))?\s?\d{4,5}[-\s]?\d{4}/g;
        while ((match = phoneRegex.exec(text)) !== null) {
          entities.push({
            text: match[0],
            type: EntityType.PHONE,
            start: match.index,
            end: match.index + match[0].length,
            score: 0.95
          });
        }
        
        // Extração de URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        while ((match = urlRegex.exec(text)) !== null) {
          entities.push({
            text: match[0],
            type: EntityType.URL,
            start: match.index,
            end: match.index + match[0].length,
            score: 0.98
          });
        }
        
        // Extração de datas (formato simples)
        const dateRegex = /\d{1,2}\/\d{1,2}\/\d{2,4}/g;
        while ((match = dateRegex.exec(text)) !== null) {
          entities.push({
            text: match[0],
            type: EntityType.DATE,
            start: match.index,
            end: match.index + match[0].length,
            score: 0.9
          });
        }
        
        return {
          success: true,
          data: {
            messageId,
            text,
            intent,
            confidence,
            entities: entities.length > 0 ? entities : undefined
          }
        };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'MESSAGE_CLASSIFICATION_ERROR',
            message: error instanceof Error ? error.message : 'Falha ao classificar mensagem'
          }
        };
      }
    }),
  
  /**
   * Versão simplificada para uso direto sem action
   */
  classify(messageId: string, text: string): MessageClassification {
    const textLower = text.toLowerCase();
    
    // Lógica simplificada para classificação direta
    let intent = MessageIntent.OTHER;
    
    if (textLower.includes('?')) {
      intent = MessageIntent.QUESTION;
    } else if (textLower.includes('problema')) {
      intent = MessageIntent.COMPLAINT;
    } else if (textLower.includes('sugestão')) {
      intent = MessageIntent.FEEDBACK;
    } else if (textLower.includes('preciso')) {
      intent = MessageIntent.REQUEST;
    } else if (textLower.includes('olá') || textLower.includes('oi')) {
      intent = MessageIntent.GREETING;
    } else if (textLower.includes('tchau')) {
      intent = MessageIntent.GOODBYE;
    } else if (textLower.includes('obrigado')) {
      intent = MessageIntent.GRATITUDE;
    }
    
    return {
      messageId,
      text,
      intent,
      confidence: 0.7
    };
  }
}; 