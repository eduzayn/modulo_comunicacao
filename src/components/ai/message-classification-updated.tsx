'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Message } from '@/types/conversations';

interface MessageClassificationProps {
  message: Message;
  categories: string[];
  onClassify?: (category: string, confidence: number) => void;
}

export function MessageClassification({ message, categories, onClassify }: MessageClassificationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [classification, setClassification] = useState<{ category: string; confidence: number } | null>(null);
  
  const handleClassify = async () => {
    if (!message.content) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/communication/ai/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: message.content,
          categories
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        setClassification(result);
        
        if (onClassify) {
          onClassify(result.category, result.confidence);
        }
      }
    } catch (error) {
      console.error('Error classifying message:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Classificação de Mensagem</CardTitle>
        <CardDescription>
          Classifica a mensagem em categorias predefinidas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-md p-3 bg-gray-50">
            <p className="text-sm font-medium mb-1">Mensagem:</p>
            <p className="text-sm">{message.content}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Categorias disponíveis:</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Badge key={index} variant="outline">{category}</Badge>
              ))}
            </div>
          </div>
          
          {classification ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Resultado da classificação:</p>
              <div className={`p-3 rounded-md ${getConfidenceColor(classification.confidence)}`}>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{classification.category}</span>
                  <span>{Math.round(classification.confidence * 100)}% de confiança</span>
                </div>
              </div>
            </div>
          ) : (
            <Button 
              onClick={handleClassify} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Classificando...
                </>
              ) : (
                'Classificar Mensagem'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
