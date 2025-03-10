'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Message } from '@/types';

interface ResponseSuggestionsProps {
  messages: Message[];
  onSelectSuggestion: (suggestion: string) => void;
  isLoading?: boolean;
}

// Simple rule-based suggestions for demo purposes
const generateSuggestions = (messages: Message[]): string[] => {
  if (messages.length === 0) return [];
  
  const lastMessage = messages[messages.length - 1];
  
  if (lastMessage.content.toLowerCase().includes('preço') || 
      lastMessage.content.toLowerCase().includes('valor') ||
      lastMessage.content.toLowerCase().includes('custo')) {
    return [
      "Temos várias opções de preço disponíveis. Posso detalhar cada plano para você.",
      "Nossos preços variam de acordo com o pacote escolhido. Qual opção você gostaria de conhecer?",
      "Você pode conferir nossa tabela de preços completa em nosso site. Posso enviar o link."
    ];
  }
  
  if (lastMessage.content.toLowerCase().includes('dúvida') || 
      lastMessage.content.toLowerCase().includes('ajuda') ||
      lastMessage.content.toLowerCase().includes('como')) {
    return [
      "Estou aqui para ajudar! Pode me detalhar melhor sua dúvida?",
      "Claro, posso te ajudar com isso. Você poderia fornecer mais detalhes?",
      "Vou fazer o possível para esclarecer sua dúvida. Tem alguma informação adicional?"
    ];
  }
  
  if (lastMessage.content.toLowerCase().includes('obrigado') || 
      lastMessage.content.toLowerCase().includes('agradeço')) {
    return [
      "Por nada! Estou sempre à disposição para ajudar.",
      "Fico feliz em poder ajudar! Tem mais alguma coisa que eu possa fazer?",
      "Disponha! Se precisar de mais alguma coisa, é só me avisar."
    ];
  }
  
  // Default suggestions
  return [
    "Entendi. Como posso ajudar com isso?",
    "Obrigado pelo contato. Em que mais posso ajudar?",
    "Compreendo sua situação. Vamos resolver isso juntos."
  ];
};

export function ResponseSuggestions({ messages, onSelectSuggestion, isLoading: externalLoading = false }: ResponseSuggestionsProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  useEffect(() => {
    if (messages.length === 0) return;
    
    setInternalLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const generatedSuggestions = generateSuggestions(messages);
      setSuggestions(generatedSuggestions);
      setInternalLoading(false);
    }, 500);
  }, [messages]);
  
  const isLoading = externalLoading || internalLoading;
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sugestões de Resposta (Local)</CardTitle>
          <CardDescription>Gerando sugestões...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="ml-2">Gerando sugestões...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (messages.length === 0 || suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sugestões de Resposta (Local)</CardTitle>
          <CardDescription>Nenhuma sugestão disponível</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sugestões de Resposta (Local)</CardTitle>
        <CardDescription>
          Clique em uma sugestão para usá-la
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start text-left h-auto py-2"
              onClick={() => onSelectSuggestion(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
