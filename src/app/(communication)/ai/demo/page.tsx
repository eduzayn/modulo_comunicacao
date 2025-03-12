'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { SentimentAnalysis } from '@/components/ai/sentiment-analysis';
import { ResponseSuggestions } from '@/components/ai/response-suggestions';
import { SentimentAnalysisOpenAI } from '@/components/ai/sentiment-analysis-openai';
import { ResponseSuggestionsOpenAI } from '@/components/ai/response-suggestions-openai';
import { MessageClassification } from '@/components/ai/message-classification-updated';
import { Message } from '@/types/conversations';

export default function AIDemoPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      conversationId: 'demo',
      senderId: 'user-123',
      content: 'Olá, estou com dúvidas sobre o curso de programação.',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      conversationId: 'demo',
      senderId: 'current-user',
      content: 'Olá! Claro, como posso ajudar com suas dúvidas sobre o curso de programação?',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 3500000),
    },
    {
      id: '3',
      conversationId: 'demo',
      senderId: 'user-123',
      content: 'Quais são os pré-requisitos para o curso avançado?',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 3400000),
    },
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'sentiment' | 'suggestions' | 'classification'>('sentiment');
  
  const handleAddMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      conversationId: 'demo',
      senderId: 'user-123',
      content: newMessage,
      type: 'text',
      status: 'read',
      createdAt: new Date(),
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };
  
  const handleSelectSuggestion = (suggestion: string) => {
    const responseMsg: Message = {
      id: Date.now().toString(),
      conversationId: 'demo',
      senderId: 'current-user',
      content: suggestion,
      type: 'text',
      status: 'sent',
      createdAt: new Date(),
    };
    
    setMessages([...messages, responseMsg]);
  };
  
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-semibold text-gray-900">Demonstração de IA</h1>
      <p className="mt-1 text-sm text-gray-500">
        Teste as funcionalidades de IA do módulo de comunicação
      </p>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversa de Teste</CardTitle>
            <CardDescription>
              Adicione mensagens para testar as funcionalidades de IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-4 h-80 overflow-y-auto">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`mb-4 flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs p-3 rounded-lg ${
                        message.senderId === 'current-user' 
                          ? 'bg-blue-100 text-blue-900' 
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs mt-1 text-gray-500">
                        {message.createdAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite uma mensagem..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAddMessage()}
                />
                <Button onClick={handleAddMessage}>Enviar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div>
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'sentiment' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('sentiment')}
            >
              Análise de Sentimento
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'suggestions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('suggestions')}
            >
              Sugestões de Resposta
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'classification' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('classification')}
            >
              Classificação
            </button>
          </div>
          
          {activeTab === 'sentiment' && (
            <div className="grid grid-cols-1 gap-4">
              <SentimentAnalysis messages={messages} />
              <SentimentAnalysisOpenAI messages={messages} />
            </div>
          )}
          
          {activeTab === 'suggestions' && (
            <div className="grid grid-cols-1 gap-4">
              <ResponseSuggestions 
                messages={messages} 
                onSelectSuggestion={handleSelectSuggestion} 
              />
              <ResponseSuggestionsOpenAI 
                messages={messages} 
                onSelectSuggestion={handleSelectSuggestion} 
              />
            </div>
          )}
          
          {activeTab === 'classification' && (
            <div className="grid grid-cols-1 gap-4">
              <MessageClassification 
                message={messages[messages.length - 1]} 
                categories={['Dúvida', 'Reclamação', 'Elogio', 'Solicitação', 'Informação']}
                onClassify={(category, confidence) => {
                  console.log(`Mensagem classificada como: ${category} (${confidence * 100}%)`);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
