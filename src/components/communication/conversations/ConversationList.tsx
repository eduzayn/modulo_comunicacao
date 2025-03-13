'use client';

import React from 'react';
import { useConversations } from '@/hooks/use-conversations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Conversation } from '@/types/conversations';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
  onSelectConversation?: (conversation: Conversation) => void;
  channelId?: string;
}

export function ConversationList({ onSelectConversation, channelId }: ConversationListProps) {
  const { conversations, isLoading, isError, refetch } = useConversations(channelId);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 bg-muted rounded-md animate-pulse" />
        <div className="h-24 bg-muted rounded-md animate-pulse" />
        <div className="h-24 bg-muted rounded-md animate-pulse" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
        <p>Failed to load conversations</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="p-4 border border-gray-200 bg-gray-50 rounded-md text-gray-500">
        <p>No conversations found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <Card 
          key={conversation.id} 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onSelectConversation?.(conversation)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{conversation.title}</CardTitle>
              <Badge variant={getStatusVariant(conversation.status)}>
                {conversation.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-2">
              {conversation.last_message && (
                <p className="truncate">{conversation.last_message}</p>
              )}
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>
                {conversation.last_message_at && 
                  formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/conversations/${conversation.id}`);
                }}
              >
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'active':
      return 'default';
    case 'closed':
      return 'secondary';
    case 'pending':
      return 'outline';
    default:
      return 'default';
  }
}
