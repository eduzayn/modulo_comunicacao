"use client";

import React, { useEffect, useRef } from 'react';
import { MessageItem } from './MessageItem';
import { useSentimentAnalysis } from '../../ai/hooks';
import { Skeleton } from '../../../components/ui/skeleton';

export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  created_at: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isLoading?: boolean;
  showSentiment?: boolean;
}

export function MessageList({
  messages,
  currentUserId,
  isLoading = false,
  showSentiment = false
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getAverageSentiment } = useSentimentAnalysis();

  // Rolar para a última mensagem quando novas mensagens forem adicionadas
  useEffect(() => {
    if (messages?.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Calculando o sentimento médio das últimas 5 mensagens
  const recentMessageContents = messages
    .slice(-5)
    .map(msg => msg.content);
    
  const averageSentiment = getAverageSentiment(recentMessageContents);

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6">
        <p className="text-muted-foreground text-center">
          Nenhuma mensagem encontrada. Inicie uma nova conversa.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 overflow-y-auto">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          id={message.id}
          content={message.content}
          sender={message.sender}
          timestamp={message.created_at}
          isCurrentUser={message.sender.id === currentUserId}
          showSentiment={showSentiment}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
} 