"use client";

import React from 'react';
import { SentimentType } from '../types';
import { FiSmile, FiMeh, FiFrown } from 'react-icons/fi';

interface SentimentAverageDisplayProps {
  averageScore: number;
  dominantSentiment: SentimentType;
  confidence: number;
  label?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Componente para exibir a média de sentimento de várias mensagens
 */
export function SentimentAverageDisplay({
  averageScore,
  dominantSentiment,
  confidence,
  label = true,
  size = 'md',
  className = ''
}: SentimentAverageDisplayProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const percentageScore = Math.round(Math.abs(averageScore) * 100);
  
  const config = {
    [SentimentType.POSITIVE]: {
      icon: <FiSmile className={`${sizeClasses[size]} text-green-500`} />,
      label: 'Positivo',
      color: 'text-green-500'
    },
    [SentimentType.NEUTRAL]: {
      icon: <FiMeh className={`${sizeClasses[size]} text-gray-500`} />,
      label: 'Neutro',
      color: 'text-gray-500'
    },
    [SentimentType.NEGATIVE]: {
      icon: <FiFrown className={`${sizeClasses[size]} text-red-500`} />,
      label: 'Negativo',
      color: 'text-red-500'
    }
  };
  
  const sentimentInfo = config[dominantSentiment];
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {sentimentInfo.icon}
      
      {label && (
        <div className="flex flex-col">
          <span className={`font-medium ${sentimentInfo.color}`}>
            {sentimentInfo.label} 
            <span className="ml-1 text-xs text-gray-500">
              {percentageScore}%
            </span>
          </span>
          
          {confidence > 0.5 && (
            <span className="text-xs text-gray-400">
              Confiança: {Math.round(confidence * 100)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
} 