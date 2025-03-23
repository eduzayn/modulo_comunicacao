"use client";

import React from 'react';
import { MessageIntent } from '../types';

interface MessageIntentTagProps {
  intent: MessageIntent;
  confidence?: number;
  showConfidence?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Componente para exibir a intenção de uma mensagem como uma tag
 */
export function MessageIntentTag({
  intent,
  confidence = 0,
  showConfidence = false,
  size = 'md',
  className = ''
}: MessageIntentTagProps) {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  // Configurações para cada tipo de intenção
  const intentConfig = {
    [MessageIntent.QUESTION]: {
      label: 'Pergunta',
      color: 'bg-blue-100 text-blue-800'
    },
    [MessageIntent.COMPLAINT]: {
      label: 'Reclamação',
      color: 'bg-red-100 text-red-800'
    },
    [MessageIntent.FEEDBACK]: {
      label: 'Feedback',
      color: 'bg-purple-100 text-purple-800'
    },
    [MessageIntent.REQUEST]: {
      label: 'Solicitação',
      color: 'bg-orange-100 text-orange-800'
    },
    [MessageIntent.GREETING]: {
      label: 'Saudação',
      color: 'bg-green-100 text-green-800'
    },
    [MessageIntent.GOODBYE]: {
      label: 'Despedida',
      color: 'bg-indigo-100 text-indigo-800'
    },
    [MessageIntent.GRATITUDE]: {
      label: 'Agradecimento',
      color: 'bg-pink-100 text-pink-800'
    },
    [MessageIntent.OTHER]: {
      label: 'Outro',
      color: 'bg-gray-100 text-gray-800'
    }
  };

  const config = intentConfig[intent];
  
  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium ${config.color} ${sizeClasses[size]} ${className}`}
    >
      {config.label}
      
      {showConfidence && confidence > 0 && (
        <span className="ml-1 opacity-75">
          ({Math.round(confidence * 100)}%)
        </span>
      )}
    </span>
  );
} 