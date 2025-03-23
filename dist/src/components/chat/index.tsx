'use client';

import React, { useState } from 'react';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { Card } from '@/components/ui/card';
import { Message } from '@/types/conversations';
import { InternalNote } from './internal-note';
import { User } from '@/components/ui/mention-picker';

interface ChatProps {
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string, mediaUrl?: string, type?: string) => Promise<void>;
  onSendAudio?: (blob: Blob) => Promise<void>;
  onUploadFiles?: (files: File[]) => Promise<string[]>;
  onAddNote?: (note: string, conversationId: string) => Promise<void>;
  isLoading?: boolean;
  headerContent?: React.ReactNode;
  assistantName?: string;
  conversationId: string;
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  teammates?: User[];
  showInternalNotes?: boolean;
}

export function Chat({
  messages,
  currentUserId,
  onSendMessage,
  onSendAudio,
  onUploadFiles,
  onAddNote,
  isLoading = false,
  headerContent,
  assistantName = "Prof Ana",
  conversationId,
  currentUser,
  teammates,
  showInternalNotes = true,
}: ChatProps) {
  // Avatar do assistente (Prof Ana)
  const assistantAvatar = {
    url: "/images/prof-ana-avatar.png", // Caminho para o avatar da Prof Ana (se disponível)
    fallback: "PA", // Iniciais para usar como fallback
  };
  
  return (
    <Card className="overflow-hidden flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-sm">
      {headerContent ? (
        <div className="border-b border-gray-200 px-4 py-3 bg-white">
          {headerContent}
        </div>
      ) : (
        <div className="border-b border-gray-200 px-4 py-3 bg-white flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-sm font-medium">
            {assistantAvatar.fallback}
          </div>
          <div>
            <h3 className="text-sm font-medium">{assistantName}</h3>
            <p className="text-xs text-gray-500">Assistente virtual</p>
          </div>
        </div>
      )}
      
      <MessageList 
        messages={messages} 
        currentUserId={currentUserId}
        assistantName={assistantName}
        assistantAvatar={assistantAvatar}
      />
      
      {showInternalNotes && currentUser && onAddNote && (
        <InternalNote 
          conversationId={conversationId}
          currentUser={currentUser}
          onAddNote={onAddNote}
        />
      )}
      
      <MessageInput 
        onSendMessage={onSendMessage}
        onSendAudio={onSendAudio}
        onUploadFiles={onUploadFiles}
        isLoading={isLoading}
        currentUser={currentUser}
        teammates={teammates}
      />
    </Card>
  );
}
