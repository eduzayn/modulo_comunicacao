'use client';

import React, { useEffect, useRef } from 'react';
import { Message } from '@/types/conversations';
import { MessageItem } from './message-item';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Nenhuma mensagem ainda. Comece a conversa!</p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageItem 
            key={message.id} 
            message={message} 
            isCurrentUser={message.senderId === currentUserId}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
