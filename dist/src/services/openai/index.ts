import OpenAI from 'openai';

// Inicializar o cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Interfaces
interface ClassifyMessageProps {
  text: string;
  categories: string[];
}

interface ClassifyResult {
  category: string;
  confidence: number;
}

interface AnalyzeSentimentProps {
  text: string;
}

interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  explanation?: string;
}

/**
 * Classifica uma mensagem em uma das categorias fornecidas
 */
export async function classifyMessage({ text, categories }: ClassifyMessageProps): Promise<ClassifyResult> {
  try {
    const prompt = `
      Classifique o seguinte texto em uma das categorias fornecidas:
      
      Texto: "${text}"
      
      Categorias disponíveis: ${categories.join(', ')}
      
      Forneça apenas a categoria mais adequada e um valor de confiança entre 0 e 1.
      Responda no formato JSON: { "category": "nome_da_categoria", "confidence": valor_confianca }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Você é um assistente de IA especializado em classificação de texto." },
        { role: "user", content: prompt }
      ],
      temperature: 0,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("Resposta vazia da API OpenAI");
    }

    const result = JSON.parse(content) as ClassifyResult;
    return result;
  } catch (error) {
    console.error("Erro ao classificar mensagem:", error);
    return {
      category: categories[0], // Fallback para a primeira categoria
      confidence: 0.5
    };
  }
}

/**
 * Analisa o sentimento de um texto
 */
export async function analyzeSentiment({ text }: AnalyzeSentimentProps): Promise<SentimentResult> {
  try {
    const prompt = `
      Analise o sentimento do seguinte texto:
      
      Texto: "${text}"
      
      Determine se o sentimento é positivo, negativo ou neutro.
      Forneça uma pontuação de -1 (muito negativo) a 1 (muito positivo).
      Responda no formato JSON: { "sentiment": "positive|negative|neutral", "score": valor_entre_menos1_e_1, "explanation": "breve_explicacao" }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Você é um assistente de IA especializado em análise de sentimento." },
        { role: "user", content: prompt }
      ],
      temperature: 0,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("Resposta vazia da API OpenAI");
    }

    const result = JSON.parse(content) as SentimentResult;
    return result;
  } catch (error) {
    console.error("Erro ao analisar sentimento:", error);
    return {
      sentiment: "neutral",
      score: 0,
      explanation: "Não foi possível analisar o sentimento devido a um erro."
    };
  }
} 