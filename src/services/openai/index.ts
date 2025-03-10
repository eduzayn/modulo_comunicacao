import OpenAI from 'openai';

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface AnalyzeSentimentParams {
  text: string;
}

export interface GenerateResponseSuggestionsParams {
  conversationHistory: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  maxSuggestions?: number;
}

export interface ClassifyMessageParams {
  text: string;
  categories: string[];
}

/**
 * Analyzes the sentiment of a given text
 * @param params Text to analyze
 * @returns Sentiment analysis result (positive, negative, neutral) with confidence score
 */
export async function analyzeSentiment({ text }: AnalyzeSentimentParams) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a sentiment analysis assistant. Analyze the sentiment of the following text and respond with a JSON object containing "sentiment" (positive, negative, or neutral) and "confidence" (a number between 0 and 1).'
        },
        {
          role: 'user',
          content: text
        }
      ],
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content || '{"sentiment": "neutral", "confidence": 0.5}');
    return result;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return { sentiment: 'neutral', confidence: 0.5 };
  }
}

/**
 * Generates response suggestions based on conversation history
 * @param params Conversation history and max number of suggestions
 * @returns Array of suggested responses
 */
export async function generateResponseSuggestions({ 
  conversationHistory, 
  maxSuggestions = 3 
}: GenerateResponseSuggestionsParams) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an assistant helping to generate ${maxSuggestions} different response suggestions for a conversation. Provide the suggestions as a JSON array of strings. Keep responses concise, professional, and helpful.`
        },
        ...conversationHistory.map(msg => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content
        }))
      ],
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
    return result.suggestions || [];
  } catch (error) {
    console.error('Error generating response suggestions:', error);
    return [];
  }
}

/**
 * Classifies a message into predefined categories
 * @param params Text to classify and available categories
 * @returns The most likely category and confidence score
 */
export async function classifyMessage({ text, categories }: ClassifyMessageParams) {
  try {
    const categoriesStr = categories.join(', ');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a message classification assistant. Classify the following text into one of these categories: ${categoriesStr}. Respond with a JSON object containing "category" (one of the provided categories) and "confidence" (a number between 0 and 1).`
        },
        {
          role: 'user',
          content: text
        }
      ],
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content || '{"category": "", "confidence": 0}');
    return result;
  } catch (error) {
    console.error('Error classifying message:', error);
    return { category: categories[0] || '', confidence: 0 };
  }
}

/**
 * Generates an automated response based on a message
 * @param message The message to respond to
 * @returns Generated response
 */
export async function generateAutomatedResponse(message: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant for an educational platform. Provide a concise, professional, and helpful response to the user\'s message.'
        },
        {
          role: 'user',
          content: message
        }
      ]
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating automated response:', error);
    return '';
  }
}

export default {
  analyzeSentiment,
  generateResponseSuggestions,
  classifyMessage,
  generateAutomatedResponse
};
