'use client';

import React, { useState, useRef, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon, PaperclipIcon, MicIcon, SmileIcon, UserPlusIcon } from 'lucide-react';
import { EmojiPicker } from '@/components/ui/emoji-picker';
import { VoiceRecorder } from '@/components/ui/voice-recorder';
import { FileUploader } from '@/components/ui/file-uploader';
import { QuickPhrases } from '@/components/ui/quick-phrases';
import { MentionPicker, User } from '@/components/ui/mention-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MessageInputProps {
  onSendMessage: (content: string, mediaUrl?: string, type?: string) => Promise<void>;
  onSendAudio?: (blob: Blob) => Promise<void>;
  onUploadFiles?: (files: File[]) => Promise<string[]>;
  isLoading?: boolean;
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  teammates?: User[];
  className?: string;
}

export function MessageInput({ 
  onSendMessage, 
  onSendAudio,
  onUploadFiles,
  isLoading = false,
  currentUser,
  teammates,
  className
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showFileUploader, setShowFileUploader] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && !isUploading) return;
    
    try {
      await onSendMessage(message);
      setMessage('');
      textareaRef.current?.focus();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };
  
  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    textareaRef.current?.focus();
  };
  
  const handlePhraseSelect = (phrase: string) => {
    setMessage(phrase);
    textareaRef.current?.focus();
  };
  
  const handleMentionSelect = (user: User) => {
    setMessage(prev => `${prev}@${user.name} `);
    textareaRef.current?.focus();
  };
  
  const handleSendAudio = async (blob: Blob) => {
    if (!onSendAudio) return;
    
    try {
      await onSendAudio(blob);
    } catch (error) {
      console.error('Erro ao enviar áudio:', error);
    }
  };
  
  const handleFilesSelected = async (files: File[]) => {
    if (!onUploadFiles || files.length === 0) return;
    
    try {
      setIsUploading(true);
      const mediaUrls = await onUploadFiles(files);
      
      // Enviar mensagem com anexos
      for (const url of mediaUrls) {
        const fileType = url.toLowerCase().endsWith('.jpg') || url.toLowerCase().endsWith('.png') || url.toLowerCase().endsWith('.jpeg')
          ? 'image'
          : 'file';
        await onSendMessage('', url, fileType);
      }
    } catch (error) {
      console.error('Erro ao fazer upload de arquivos:', error);
    } finally {
      setIsUploading(false);
      setShowFileUploader(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={`border-t border-gray-200 p-4 bg-white ${className}`}>
      {showFileUploader && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Anexar arquivos</h3>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowFileUploader(false)}
              className="h-6 w-6 p-0 rounded-full"
            >
              <span className="sr-only">Fechar</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </Button>
          </div>
          <FileUploader
            onFilesSelected={handleFilesSelected}
            accept={{
              'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
              'application/pdf': ['.pdf'],
              'application/msword': ['.doc'],
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
              'text/plain': ['.txt']
            }}
            maxFiles={5}
            disabled={isUploading}
          />
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <div className="flex gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                type="button" 
                size="icon" 
                variant="ghost"
                className="rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <PaperclipIcon className="h-5 w-5" />
                <span className="sr-only">Anexar arquivo</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" side="top" align="start">
              <div className="p-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowFileUploader(true)} 
                  className="w-full justify-start"
                >
                  <PaperclipIcon className="h-4 w-4 mr-2" />
                  Arquivos e imagens
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <QuickPhrases onPhraseSelect={handlePhraseSelect} />
          
          <MentionPicker onMentionSelect={handleMentionSelect} users={teammates} />
        </div>
        
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="min-h-10 pr-10 resize-none border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="absolute right-2 bottom-2">
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          </div>
        </div>
        
        {onSendAudio && (
          <VoiceRecorder onRecordingComplete={handleSendAudio} className="mx-1" />
        )}
        
        <Button 
          type="submit" 
          size="icon" 
          disabled={(!message.trim() && !isUploading) || isLoading}
          className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <SendIcon className="h-5 w-5" />
          <span className="sr-only">Enviar mensagem</span>
        </Button>
      </div>
    </form>
  );
}
