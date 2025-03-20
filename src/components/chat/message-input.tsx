'use client';

import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon, PaperclipIcon, MicIcon, SmileIcon, UserPlusIcon, ListIcon, XCircleIcon } from 'lucide-react';
import { EmojiPicker } from '@/components/ui/emoji-picker';
import { VoiceRecorder } from '@/components/ui/voice-recorder';
import { FileUploader } from '@/components/ui/file-uploader';
import { QuickPhrases } from '@/components/ui/quick-phrases';
import { MentionPicker, User } from '@/components/ui/mention-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Lazy loaded components
import dynamic from 'next/dynamic';

// Type imports
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
const EmojiPickerComponent = dynamic(() => import('@/components/ui/emoji-picker').then(mod => mod.EmojiPicker), {
  ssr: false,
  loading: () => <Button variant="ghost" size="icon"><SmileIcon className="h-4 w-4" /></Button>
});

const FileUploaderComponent = dynamic(() => import('@/components/ui/file-uploader').then(mod => mod.FileUploader), {
  ssr: false
});

const VoiceRecorderComponent = dynamic(() => import('@/components/ui/voice-recorder').then(mod => mod.VoiceRecorder), {
  ssr: false
});

const MentionPickerComponent = dynamic(() => import('@/components/ui/mention-picker').then(mod => mod.MentionPicker), {
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
  const [showFileUploader, setShowFileUploader] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
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
      setShowFileUploader(false);
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
      {// Typing indicators or context
      isExpanded && (
        <div className="px-2 py-1 text-xs text-muted-foreground">
          {currentUser?.name && (
            <Badge variant="outline" className="mr-2 text-[10px]">
              Escrevendo como: {currentUser.name}
            </Badge>
          )}
        </div>
      )}

      {// Quick responses
      quickResponses?.length > 0 && (
        <div className="mb-2 px-0.5 overflow-x-auto flex gap-1.5 -mx-1 px-1 py-1 scrollbar-thin">
          {quickResponses.map((response, index) => (
            <Badge 
              key={index}
              variant="subtle-secondary"
              className="cursor-pointer whitespace-nowrap px-2 py-1 text-xs"
              onClick={() => handleQuickResponseSelect(response)}
            >
              {response.length > 30 ? response.substring(0, 27) + '...' : response}
            </Badge>
          ))}
        </div>
      )}

      {// Main input area
      <form 
        onSubmit={handleSubmit} 
        className={cn(
          "flex items-end gap-1.5 bg-background rounded-md relative",
          isExpanded ? "border shadow-sm" : "",
          className
        )}
      >
        {// Message input
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setIsExpanded(true);
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            className={cn(
              "min-h-[40px] max-h-[180px] py-2.5 pr-8 rounded-md border-0 resize-none",
              "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              isExpanded ? "pl-10" : "pl-3"
            )}
            disabled={isLoading || isUploading}
          />
          
          {// Left side actions (only when expanded)
          isExpanded && (
            <div className="absolute left-2 bottom-2.5 flex gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button" 
                    variant="ghost" 
                    size="icon-sm" 
                    className="rounded-full h-6 w-6 text-muted-foreground hover:text-foreground"
                  >
                    <PaperclipIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" align="start" className="w-auto p-2">
                  {onUploadFiles && (
                    <FileUploaderComponent 
                      onFilesSelected={handleFilesSelected} 
                      maxFiles={5}
                      maxSizeMB={10}
                    />
                  )}
                </PopoverContent>
              </Popover>
            </div>
          )}

          {// Right side toolbar (emoticons, etc)
          <div className={cn(
            "absolute right-1 bottom-2.5",
            message.length > 0 ? "right-10" : "right-1"
          )}>
            <div className="flex gap-1">
              {// Emoji picker
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button" 
                    variant="ghost" 
                    size="icon-sm" 
                    className="rounded-full h-6 w-6 text-muted-foreground hover:text-foreground"
                  >
                    <SmileIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" align="end" className="w-auto p-2">
                  <EmojiPickerComponent onEmojiSelect={handleEmojiSelect} />
                </PopoverContent>
              </Popover>

              {// Voice recorder (if enabled)
              onSendAudio && !isExpanded && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button" 
                      variant="ghost" 
                      size="icon-sm" 
                      className="rounded-full h-6 w-6 text-muted-foreground hover:text-foreground"
                    >
                      <MicIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="top" align="end" className="w-auto p-2">
                    <VoiceRecorderComponent onRecordingComplete={handleSendAudio} />
                  </PopoverContent>
                </Popover>
              )}

              {// Quick responses (when not expanded)
              quickResponses?.length > 0 && !isExpanded && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button" 
                      variant="ghost" 
                      size="icon-sm" 
                      className="rounded-full h-6 w-6 text-muted-foreground hover:text-foreground"
                    >
                      <ListIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="top" align="end" className="w-60 p-2">
                    <div className="flex flex-col gap-1">
                      {quickResponses.map((response, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="text-left justify-start px-2 py-1 h-auto"
                          onClick={() => handleQuickResponseSelect(response)}
                        >
                          {response}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </div>

        {// Send button
        <Button
          type="submit"
          size={isExpanded ? "default" : "icon-sm"} 
          variant={message.trim() ? "primary" : "ghost"}
          disabled={isLoading || isUploading || !message.trim()}
          className={cn(
            "text-white",
            isExpanded ? "px-4" : "h-6 w-6 rounded-full",
            !message.trim() && "text-muted-foreground"
          )}
        >
          {isLoading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <>
              {isExpanded && message.trim() ? "Enviar" : null}
              <SendIcon className={cn("h-4 w-4", isExpanded && message.trim() && "ml-2")} />
            </>
          )}
        </Button>
      </form>

      {// Additional tools when expanded
      isExpanded && (
        <div className="mt-2 flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {onSendAudio && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="h-7 w-7 rounded-full">
                      <MicIcon className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Enviar áudio</TooltipContent>
                </Tooltip>
                <Separator orientation="vertical" className="h-4" />
              </>
            )}
            
            {// User mentions (if teammates available)
            teammates && teammates.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => {
                  setMessage(prev => prev + "@");
                  textareaRef.current?.focus();
                }}
              >
                @Mencionar
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setIsExpanded(false)}
            >
              <XCircleIcon className="h-3.5 w-3.5 mr-1" />
              Minimizar
            </Button>
          </div>
        </div>
      )}
      
      {// File uploader overlay
      showFileUploader && onUploadFiles && (
        <div className="absolute inset-0 bg-background/90 flex items-center justify-center z-10">
          <div className="w-full max-w-md p-4">
            <FileUploaderComponent 
              onFilesSelected={handleFilesSelected} 
              onCancel={() => setShowFileUploader(false)}
              maxFiles={5}
              maxSizeMB={10}
            />
          </div>
        </div>
      )}
    </div>
  );
}
