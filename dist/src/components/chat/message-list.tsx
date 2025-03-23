'use client';

import React, { useRef, useEffect } from 'react';
import { MessageItem } from './message-item';
import { Message } from '@/types/conversations';
import { ChatMessage } from './chat-message';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  assistantName?: string;
  assistantAvatar?: {
    url: string;
    fallback: string;
  };
}

export function MessageList({ 
  messages, 
  currentUserId,
  assistantName = "Assistente",
  assistantAvatar = { url: "", fallback: "AI" }
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.map((message) => {
        const isCurrentUser = message.senderId === currentUserId;
        
        // Verificar se é uma mensagem do assistente de IA
        const isAssistant = message.senderId === 'assistant' || message.senderId === 'ai';
        
        if (isAssistant) {
          return (
            <ChatMessage 
              key={message.id} 
              message={{
                id: message.id,
                role: 'assistant',
                content: message.content,
                createdAt: typeof message.createdAt === 'string' 
                  ? new Date(message.createdAt) 
                  : message.createdAt
              }} 
              assistantName={assistantName}
              assistantAvatar={assistantAvatar}
            />
          );
        }
        
        return (
          <MessageItem 
            key={message.id} 
            message={message} 
            isCurrentUser={isCurrentUser} 
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
