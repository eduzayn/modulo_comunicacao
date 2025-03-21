'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Message } from '../../types/index';

interface ResponseSuggestionsProps {
  messages: Message[];
  onSelectSuggestion: (suggestion: string) => void;
}

export function ResponseSuggestionsOpenAI({ messages, onSelectSuggestion }: ResponseSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const generateSuggestions = async () => {
      if (messages.length === 0) return;
      
      setIsLoading(true);
      
      try {
        // Convert messages to the format expected by the API
        const conversationHistory = messages.map(msg => ({
          role: msg.senderId === 'current-user' ? 'user' : 'assistant',
          content: msg.content
        }));
        
        const response = await fetch('/api/communication/ai/suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            conversationHistory,
            maxSuggestions: 3
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
        }
      } catch (error) {
        console.error('Error generating suggestions:', error);
        // Fallback suggestions
        setSuggestions([
          "Como posso ajudar você hoje?",
          "Precisa de mais alguma informação?",
          "Estou à disposição para esclarecer qualquer dúvida."
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    generateSuggestions();
  }, [messages]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sugestões de Resposta (OpenAI)</CardTitle>
        <CardDescription>
          Geradas por inteligência artificial
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="ml-2">Gerando sugestões...</span>
          </div>
        ) : suggestions.length === 0 ? (
          <p className="text-center text-gray-500">Nenhuma sugestão disponível</p>
        ) : (
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="w-full justify-start text-left h-auto py-2 px-3"
                onClick={() => onSelectSuggestion(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
