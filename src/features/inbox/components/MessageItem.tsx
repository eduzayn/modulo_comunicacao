"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageSentimentIndicator } from './MessageSentimentIndicator';

interface MessageItemProps {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  timestamp: string | Date;
  isCurrentUser: boolean;
  showSentiment?: boolean;
}

export function MessageItem({
  id,
  content,
  sender,
  timestamp,
  isCurrentUser,
  showSentiment = false
}: MessageItemProps) {
  const formattedTime = typeof timestamp === 'string' 
    ? format(new Date(timestamp), 'HH:mm', { locale: ptBR })
    : format(timestamp, 'HH:mm', { locale: ptBR });

  const initials = sender.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={`flex w-full mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={sender.avatar_url} alt={sender.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col max-w-[80%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        <Card className={`px-3 py-2 ${
          isCurrentUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        </Card>
        
        <div className="flex items-center text-xs text-muted-foreground mt-1 space-x-2">
          <span>{formattedTime}</span>
          
          {showSentiment && (
            <MessageSentimentIndicator 
              messageText={content} 
              size="sm" 
              className="ml-2"
            />
          )}
        </div>
      </div>

      {isCurrentUser && (
        <Avatar className="h-8 w-8 ml-2">
          <AvatarImage src={sender.avatar_url} alt={sender.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
} 