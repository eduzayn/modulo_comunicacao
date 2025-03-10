'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Message } from '@/types';

interface ResponseSuggestionsProps {
  messages: Message[];
  onSelectSuggestion: (suggestion: string) => void;
  isLoading?: boolean;
}

// This is a mock implementation - in a real app, this would call an AI service
const generateSuggestions = (messages: Message[]): string[] => {
  if (messages.length === 0) return [];
  
  const lastMessage = messages[messages.length - 1];
  
  // Simple rule-based suggestions for demo purposes
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

export function ResponseSuggestions({ messages, onSelectSuggestion, isLoading = false }: ResponseSuggestionsProps) {
  const suggestions = generateSuggestions(messages);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sugestões de Resposta</CardTitle>
          <CardDescription>Gerando sugestões...</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (messages.length === 0 || suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sugestões de Resposta</CardTitle>
          <CardDescription>Nenhuma sugestão disponível</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sugestões de Resposta</CardTitle>
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
