"use client";

import React, { useState, useEffect } from 'react';
import { SentimentType, SentimentAnalysis } from '@/features/ai/types';
import { sentimentService } from '@/features/ai/services/sentiment-service';

interface MessageSentimentIndicatorProps {
  messageText: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function MessageSentimentIndicator({
  messageText,
  size = 'md',
  showLabel = false,
  className = ''
}: MessageSentimentIndicatorProps) {
  const [sentiment, setSentiment] = useState<SentimentAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Classes CSS baseadas no tamanho
  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-6 h-6 text-sm',
    lg: 'w-8 h-8 text-base'
  };

  useEffect(() => {
    if (!messageText) return;

    // Função assíncrona para analisar o sentimento
    const analyzeSentiment = async () => {
      try {
        setIsLoading(true);
        const analysis = sentimentService.analyzeSentiment(messageText);
        setSentiment(analysis);
      } catch (error) {
        console.error("Erro ao analisar sentimento:", error);
      } finally {
        setIsLoading(false);
      }
    };

    analyzeSentiment();
  }, [messageText]);

  if (!sentiment || isLoading) {
    return (
      <div 
        className={`inline-flex items-center ${className}`}
      >
        <div className={`${sizeClasses[size]} rounded-full bg-gray-200 animate-pulse`}></div>
        {showLabel && (
          <span className="ml-1 text-gray-400">Analisando...</span>
        )}
      </div>
    );
  }

  // Configurações baseadas no tipo de sentimento
  const sentimentConfig = {
    [SentimentType.POSITIVE]: {
      color: 'bg-green-500',
      label: 'Positivo',
      tooltip: `Sentimento positivo (${Math.round(sentiment.score * 100)}%)`
    },
    [SentimentType.NEUTRAL]: {
      color: 'bg-gray-400',
      label: 'Neutro',
      tooltip: `Sentimento neutro (${Math.round(sentiment.score * 100)}%)`
    },
    [SentimentType.NEGATIVE]: {
      color: 'bg-red-500',
      label: 'Negativo',
      tooltip: `Sentimento negativo (${Math.round(Math.abs(sentiment.score) * 100)}%)`
    }
  };

  const config = sentimentConfig[sentiment.sentiment];

  return (
    <div 
      className={`inline-flex items-center ${className}`} 
      title={config.tooltip}
    >
      <div className={`${sizeClasses[size]} rounded-full ${config.color} flex-shrink-0`}></div>
      {showLabel && (
        <span className="ml-1 text-gray-600">{config.label}</span>
      )}
    </div>
  );
} 