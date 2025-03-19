'use client';

import React from 'react';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { Card } from '@/components/ui/card';
import { Message } from '@/types/conversations';

interface ChatProps {
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string, mediaUrl?: string) => Promise<void>;
  isLoading?: boolean;
  headerContent?: React.ReactNode;
}

export function Chat({
  messages,
  currentUserId,
  onSendMessage,
  isLoading = false,
  headerContent,
}: ChatProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-sm">
      {headerContent && (
        <div className="border-b border-gray-200 px-4 py-3 bg-white">
          {headerContent}
        </div>
      )}
      
      <MessageList 
        messages={messages} 
        currentUserId={currentUserId}
      />
      
      <MessageInput 
        onSendMessage={onSendMessage}
        isLoading={isLoading}
      />
    </Card>
  );
}
