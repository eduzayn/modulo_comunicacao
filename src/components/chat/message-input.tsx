'use client';

import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon, PaperclipIcon, MicIcon } from 'lucide-react';
import { EmojiPicker } from '@/components/ui/emoji-picker';

interface MessageInputProps {
  onSendMessage: (content: string, mediaUrl?: string) => Promise<void>;
  isLoading?: boolean;
}

export function MessageInput({ onSendMessage, isLoading = false }: MessageInputProps) {
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    try {
      await onSendMessage(message);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };
  
  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
      <div className="flex items-end gap-2">
        <Button 
          type="button" 
          size="icon" 
          variant="ghost"
          className="rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <PaperclipIcon className="h-5 w-5" />
          <span className="sr-only">Anexar arquivo</span>
        </Button>
        
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="min-h-10 flex-1 resize-none border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        
        <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        
        <Button 
          type="button" 
          size="icon" 
          variant="ghost"
          className="rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <MicIcon className="h-5 w-5" />
          <span className="sr-only">Gravar áudio</span>
        </Button>
        
        <Button 
          type="submit" 
          size="icon" 
          disabled={!message.trim() || isLoading}
          className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <SendIcon className="h-5 w-5" />
          <span className="sr-only">Enviar mensagem</span>
        </Button>
      </div>
    </form>
  );
}
