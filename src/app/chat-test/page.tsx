'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '../../components/chat';
import { Button } from '../../components/ui/button';
import { Message } from '../../types/conversations';

export default function ChatTestPage() {
  const currentUserId = 'user-123';
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      conversationId: 'conv-1',
      senderId: 'agent-1',
      content: 'Olá! Como posso ajudar você hoje?',
      createdAt: new Date().toISOString(), // Serialize to string
      status: 'read',
      type: 'text'
    },
    {
      id: '2',
      conversationId: 'conv-1',
      senderId: currentUserId,
      content: 'Estou com uma dúvida sobre o módulo de comunicação.',
      createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // Serialize to string
      status: 'read',
      type: 'text'
    },
    {
      id: '3',
      conversationId: 'conv-1',
      senderId: 'agent-1',
      content: 'Claro, vou te ajudar com isso. Qual é a sua dúvida específica?',
      createdAt: new Date(Date.now() - 4 * 60000).toISOString(), // Serialize to string
      status: 'read',
      type: 'text'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string, mediaUrl?: string) => {
    if (!content.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Add user message
      const newMessage: Message = {
        id: Date.now().toString(),
        conversationId: 'conv-1',
        senderId: currentUserId,
        content,
        createdAt: new Date().toISOString(), // Serialize to string
        status: 'sent',
        type: mediaUrl ? 'image' : 'text',
        mediaUrl
      };

      setMessages(prev => [...prev, newMessage]);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simulate response
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        conversationId: 'conv-1',
        senderId: 'agent-1',
        content: 'Recebi sua mensagem. Obrigado pelo contato!',
        createdAt: new Date().toISOString(), // Serialize to string
        status: 'sent',
        type: 'text'
      };

      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Teste do Módulo de Chat</h1>
      
      <div className="flex-1 overflow-hidden border rounded-xl shadow-lg">
        <Chat
          messages={messages}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          headerContent={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  A
                </div>
                <div>
                  <h3 className="font-medium">Atendente</h3>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>
              <div>
                <Button variant="ghost" size="sm">
                  Opções
                </Button>
              </div>
            </div>
          }
        />
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}
