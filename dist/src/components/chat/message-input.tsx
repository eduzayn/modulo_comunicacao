'use client';

import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon, PaperclipIcon, MicIcon, SmileIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  onSendAudio?: (blob: Blob) => Promise<void>;
  onUploadFiles?: (files: File[]) => Promise<string[]>;
  isLoading?: boolean;
  currentUser?: User;
  teammates?: User[];
  className?: string;
  quickResponses?: string[];
  containerClassName?: string;
  placeholderText?: string;
}

// Dynamic imports for heavy components
const EmojiPicker = dynamic(() => import('@/components/ui/emoji-picker').then(mod => mod.EmojiPicker), {
  ssr: false,
  loading: () => <Button variant="ghost" size="icon"><SmileIcon className="h-4 w-4" /></Button>
});

const FileUploader = dynamic(() => import('@/components/ui/file-uploader').then(mod => mod.FileUploader), {
  ssr: false
});

const VoiceRecorder = dynamic(() => import('@/components/ui/voice-recorder').then(mod => mod.VoiceRecorder), {
  ssr: false
});

const MentionPicker = dynamic(() => import('@/components/ui/mention-picker').then(mod => mod.MentionPicker), {
  ssr: false
});

export function MessageInput({ 
  onSendMessage, 
  onSendAudio,
  onUploadFiles,
  isLoading = false,
  currentUser,
  teammates,
  className,
  quickResponses = [
    "Olá! Como posso ajudar?",
    "Entendi sua situação, deixe-me verificar isso.",
    "Obrigado pelo contato!",
    "Vou encaminhar essa informação para a equipe responsável.",
    "Poderia fornecer mais detalhes?",
  ],
  containerClassName,
  placeholderText = "Digite sua mensagem..."
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight > 180 ? '180px' : `${scrollHeight}px`;
    }
  }, [message]);
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && !isUploading) return;
    
    try {
      await onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      textareaRef.current?.focus();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };
  
  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    textareaRef.current?.focus();
  };
  
  // Handle quick response selection
  const handleQuickResponseSelect = (phrase: string) => {
    setMessage(phrase);
    textareaRef.current?.focus();
    setIsExpanded(false);
  };
  
  // Handle user mention
  const handleMentionSelect = (user: User) => {
    setMessage(prev => `${prev}@${user.name} `);
    textareaRef.current?.focus();
  };
  
  // Handle audio recording
  const handleSendAudio = async (blob: Blob) => {
    if (!onSendAudio) return;
    
    try {
      await onSendAudio(blob);
    } catch (error) {
      console.error('Erro ao enviar áudio:', error);
    }
  };
  
  // Handle file upload
  const handleFilesSelected = async (files: File[]) => {
    if (!onUploadFiles) return;
    
    setIsUploading(true);
    try {
      const urls = await onUploadFiles(files);
      // Add file references to message
      const fileNames = files.map(f => f.name).join(', ');
      setMessage(prev => `${prev} ${fileNames} `);
    } catch (error) {
      console.error('Erro ao enviar arquivos:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };
  
  return (
    <div className={cn(
      "px-3 pt-2 pb-3 border-t flex flex-col relative",
      containerClassName
    )}>
      {isExpanded && currentUser?.name && (
        <div className="px-2 py-1 text-xs text-muted-foreground">
          <Badge variant="outline" className="mr-2 text-[10px]">
            Escrevendo como: {currentUser.name}
          </Badge>
        </div>
      )}

      {quickResponses?.length > 0 && (
        <div className="mb-2 px-0.5 overflow-x-auto flex gap-1.5 px-1 py-1 scrollbar-thin">
          {quickResponses.map((response, index) => (
            <Badge 
              key={index}
              variant="outline"
              className="cursor-pointer whitespace-nowrap px-2 py-1 text-xs"
              onClick={() => handleQuickResponseSelect(response)}
            >
              {response.length > 30 ? response.substring(0, 27) + '...' : response}
            </Badge>
          ))}
        </div>
      )}

      <form 
        onSubmit={handleSubmit} 
        className={cn(
          "flex items-end gap-1.5 bg-background rounded-md relative",
          isExpanded ? "border shadow-sm" : "",
          className
        )}
      >
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            className={cn(
              "min-h-[40px] max-h-[180px] py-2.5 pr-8 rounded-md border-0 resize-none",
              "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              isExpanded ? "pl-10" : "pl-3"
            )}
            disabled={isLoading || isUploading}
          />
          
          {isExpanded && (
            <div className="absolute left-2 bottom-2.5 flex gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-6 w-6 text-muted-foreground hover:text-foreground"
                  >
                    <PaperclipIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" align="start" className="w-auto p-2">
                  {onUploadFiles && (
                    <FileUploader 
                      onFilesSelected={handleFilesSelected} 
                      maxFiles={5}
                      maxSizeMB={10}
                    />
                  )}
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="absolute right-1 bottom-1 flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  variant="default"
                  size="icon"
                  disabled={isLoading || isUploading || !message.trim()}
                  className="rounded-full h-7 w-7"
                >
                  <SendIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Enviar mensagem</TooltipContent>
            </Tooltip>
            
            {onSendAudio && !message.trim() && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-7 w-7 text-muted-foreground hover:text-foreground"
                  >
                    <MicIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" align="end" className="w-auto p-2">
                  <VoiceRecorder onRecordingComplete={handleSendAudio} />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </form>
    </div>
  );
} 