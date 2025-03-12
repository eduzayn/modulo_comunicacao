'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Message } from '@/types';

interface SentimentAnalysisProps {
  messages: Message[];
  isLoading?: boolean;
}

type Sentiment = 'positive' | 'neutral' | 'negative';

interface SentimentData {
  sentiment: Sentiment;
  score: number;
  keywords: string[];
}

// Simple keyword-based sentiment analysis for demo purposes
const analyzeSentiment = (content: string): SentimentData => {
  const positiveWords = ['obrigado', 'excelente', 'ótimo', 'bom', 'gostei', 'ajudou'];
  const negativeWords = ['problema', 'ruim', 'péssimo', 'difícil', 'não funciona', 'erro'];
  
  const contentLower = content.toLowerCase();
  
  let positiveScore = 0;
  let negativeScore = 0;
  const keywords: string[] = [];
  
  positiveWords.forEach(word => {
    if (contentLower.includes(word)) {
      positiveScore += 1;
      keywords.push(word);
    }
  });
  
  negativeWords.forEach(word => {
    if (contentLower.includes(word)) {
      negativeScore += 1;
      keywords.push(word);
    }
  });
  
  const totalScore = positiveScore - negativeScore;
  let sentiment: Sentiment = 'neutral';
  
  if (totalScore > 0) sentiment = 'positive';
  else if (totalScore < 0) sentiment = 'negative';
  
  return {
    sentiment,
    score: Math.abs(totalScore),
    keywords: keywords.slice(0, 5) // Limit to top 5 keywords
  };
};

export function SentimentAnalysis({ messages, isLoading: externalLoading = false }: SentimentAnalysisProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const [sentimentData, setSentimentData] = useState<Array<{message: Message, analysis: SentimentData}>>([]);
  
  useEffect(() => {
    // Analyze sentiment of the last 5 messages
    const recentMessages = messages.slice(-5);
    
    setInternalLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const newSentimentData = recentMessages.map(message => ({
        message,
        analysis: analyzeSentiment(message.content)
      }));
      
      setSentimentData(newSentimentData);
      setInternalLoading(false);
    }, 500);
  }, [messages]);
  
  // Calculate overall sentiment
  const overallSentiment = sentimentData.reduce((acc, item) => {
    if (item.analysis.sentiment === 'positive') return acc + 1;
    if (item.analysis.sentiment === 'negative') return acc - 1;
    return acc;
  }, 0);
  
  let overallSentimentLabel: Sentiment = 'neutral';
  if (overallSentiment > 0) overallSentimentLabel = 'positive';
  else if (overallSentiment < 0) overallSentimentLabel = 'negative';
  
  const isLoading = externalLoading || internalLoading;
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise de Sentimento (Local)</CardTitle>
          <CardDescription>Carregando análise...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="ml-2">Analisando...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (messages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise de Sentimento (Local)</CardTitle>
          <CardDescription>Nenhuma mensagem para analisar</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Sentimento (Local)</CardTitle>
        <CardDescription>
          Baseado nas últimas {sentimentData.length} mensagens
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sentimento geral:</span>
            <Badge 
              variant={
                overallSentimentLabel === 'positive' ? 'default' : 
                overallSentimentLabel === 'negative' ? 'destructive' : 
                'secondary'
              }
            >
              {overallSentimentLabel === 'positive' ? 'Positivo' : 
               overallSentimentLabel === 'negative' ? 'Negativo' : 
               'Neutro'}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Palavras-chave detectadas:</h4>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(sentimentData.flatMap(item => item.analysis.keywords))).map((keyword, index) => (
                <Badge key={index} variant="outline">{keyword}</Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Mensagens recentes:</h4>
            <div className="space-y-2">
              {sentimentData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="truncate max-w-[70%]">{item.message.content.substring(0, 30)}...</span>
                  <Badge 
                    variant={
                      item.analysis.sentiment === 'positive' ? 'default' : 
                      item.analysis.sentiment === 'negative' ? 'destructive' : 
                      'secondary'
                    }
                  >
                    {item.analysis.sentiment === 'positive' ? 'Positivo' : 
                     item.analysis.sentiment === 'negative' ? 'Negativo' : 
                     'Neutro'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
