import React from 'react';
import { Message } from '@/types/conversations';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

export function MessageItem({ message, isCurrentUser }: MessageItemProps) {
  const initials = message.senderId.substring(0, 2).toUpperCase();
  
  return (
    <div className={cn(
      "flex items-start gap-3 py-2",
      isCurrentUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className={cn(
        "h-8 w-8 border",
        isCurrentUser ? "border-blue-100" : "border-gray-200"
      )}>
        <AvatarFallback className={cn(
          isCurrentUser ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
        )}>
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "flex flex-col max-w-[80%]",
        isCurrentUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-2.5 rounded-lg shadow-sm",
          isCurrentUser 
            ? "bg-blue-50 text-gray-800 border border-blue-100" 
            : "bg-white text-gray-800 border border-gray-200"
        )}>
          <p className="text-sm leading-relaxed">{message.content}</p>
          {message.type !== 'text' && message.type !== 'document' && (
            <div className="mt-2">
              {message.type === 'image' && (
                <img 
                  src={message.mediaUrl || ''} 
                  alt="Image" 
                  width={300}
                  height={200}
                  className="max-w-full rounded-md border border-gray-200"
                  style={{ objectFit: 'contain' }}
                />
              )}
              {message.type === 'audio' && (
                <audio controls className="max-w-full rounded-md border border-gray-200 bg-white p-1">
                  <source src={message.mediaUrl || ''} />
                </audio>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center mt-1 text-xs text-gray-500">
          <span>
            {format(typeof message.createdAt === 'string' ? new Date(message.createdAt) : message.createdAt, 'HH:mm')}
          </span>
          {message.status && (
            <span className={cn(
              "ml-2",
              isCurrentUser && message.status === 'read' ? "text-blue-500" : "text-gray-400"
            )}>
              {message.status === 'sent' && '✓'}
              {message.status === 'delivered' && '✓✓'}
              {message.status === 'read' && '✓✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
