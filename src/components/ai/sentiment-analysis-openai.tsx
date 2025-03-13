'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Message } from '../../types/index';

interface SentimentAnalysisProps {
  messages: Message[];
}

interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

export function SentimentAnalysisOpenAI({ messages }: SentimentAnalysisProps) {
  const [sentimentResults, setSentimentResults] = useState<Record<string, SentimentResult>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => { // Include sentimentResults in dependencies  // Include sentimentResults in dependencies
    // Only analyze the last 5 messages to avoid excessive API calls
    const messagesToAnalyze = messages.slice(-5);
    
    const analyzeMessages = async () => {
      if (messagesToAnalyze.length === 0) return;
      
      setIsLoading(true);
      
      try {
        const results: Record<string, SentimentResult> = {};
        
        // Analyze each message
        for (const message of messagesToAnalyze) {
          if (!sentimentResults[message.id]) {
            const response = await fetch('/api/communication/ai/sentiment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ text: message.content }),
            });
            
            if (response.ok) {
              const result = await response.json();
              results[message.id] = result;
            }
          }
        }
        
        setSentimentResults(prev => ({ ...prev, ...results }));
      } catch (error) {
        console.error('Error analyzing sentiment:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    analyzeMessages();
  }, [messages]);
  
  // Count sentiments
  const analyzedMessages = messages.filter(message => sentimentResults[message.id]);
  const sentiments = analyzedMessages.reduce((acc, message) => {
    const result = sentimentResults[message.id];
    if (result) {
      acc[result.sentiment] = (acc[result.sentiment] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const totalAnalyzedMessages = analyzedMessages.length;
  const positivePercentage = Math.round(((sentiments.positive || 0) / totalAnalyzedMessages) * 100) || 0;
  const negativePercentage = Math.round(((sentiments.negative || 0) / totalAnalyzedMessages) * 100) || 0;
  const neutralPercentage = Math.round(((sentiments.neutral || 0) / totalAnalyzedMessages) * 100) || 0;
  
  // Determine overall sentiment
  let overallSentiment = 'neutral';
  let sentimentColor = 'bg-gray-200';
  
  if (positivePercentage > negativePercentage && positivePercentage > neutralPercentage) {
    overallSentiment = 'positivo';
    sentimentColor = 'bg-green-200';
  } else if (negativePercentage > positivePercentage && negativePercentage > neutralPercentage) {
    overallSentiment = 'negativo';
    sentimentColor = 'bg-red-200';
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Sentimento (OpenAI)</CardTitle>
        <CardDescription>
          Análise em tempo real com IA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              <span className="ml-2">Analisando...</span>
            </div>
          ) : totalAnalyzedMessages === 0 ? (
            <p className="text-center text-gray-500">Nenhuma mensagem para analisar</p>
          ) : (
            <>
              <div className={`p-3 rounded-md ${sentimentColor}`}>
                <p className="font-medium">Sentimento geral: {overallSentiment}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Positivo</span>
                  <span>{positivePercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${positivePercentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Neutro</span>
                  <span>{neutralPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gray-500 h-2.5 rounded-full" 
                    style={{ width: `${neutralPercentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Negativo</span>
                  <span>{negativePercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-red-500 h-2.5 rounded-full" 
                    style={{ width: `${negativePercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Mensagens analisadas:</h4>
                <div className="space-y-2">
                  {analyzedMessages.map((message) => (
                    <div key={message.id} className="flex items-center justify-between text-sm">
                      <span className="truncate max-w-[70%]">{message.content.substring(0, 30)}...</span>
                      <Badge 
                        variant={
                          sentimentResults[message.id]?.sentiment === 'positive' ? 'default' : 
                          sentimentResults[message.id]?.sentiment === 'negative' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {sentimentResults[message.id]?.sentiment === 'positive' ? 'Positivo' : 
                         sentimentResults[message.id]?.sentiment === 'negative' ? 'Negativo' : 
                         'Neutro'} ({Math.round(sentimentResults[message.id]?.confidence * 100)}%)
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
