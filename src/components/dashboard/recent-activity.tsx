'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Message } from '../../types/index';

interface RecentActivityProps {
  messages: Message[];
  maxItems?: number;
}

export function RecentActivity({ messages, maxItems = 5 }: RecentActivityProps) {
  const recentMessages = messages.slice(0, maxItems);
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d atrás`;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma atividade recente</p>
          ) : (
            recentMessages.map((message) => (
              <div key={message.id} className="flex items-start space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{message.senderId.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {message.senderId}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {message.content}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
