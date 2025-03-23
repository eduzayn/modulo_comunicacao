'use client';

import React from 'react';
import { Message } from '@/services/conversation';

export function ConversationMessages({ messages }: { messages: Message[] }) {
  return (
    <div className="flex flex-col space-y-4 p-4">
      {messages.map((message, index) => (
        <div 
          key={message.id || index} 
          className={`p-3 rounded-lg ${message.sender.id === 'user-1' ? 'bg-gray-100 self-start' : 'bg-primary/10 self-end'}`}
        >
          <p>{message.text}</p>
          <span className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
} 