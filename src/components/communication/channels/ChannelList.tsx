'use client';

import React from 'react';
import { useChannels } from '@/hooks/use-channels';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Channel } from '@/types/channels';
import { useRouter } from 'next/navigation';

interface ChannelListProps {
  onSelectChannel?: (channel: Channel) => void;
  showActions?: boolean;
}

export function ChannelList({ onSelectChannel, showActions = true }: ChannelListProps) {
  const { channels, isLoading, isError, refetch } = useChannels();
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
        <p>Failed to load channels</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  if (!channels || channels.length === 0) {
    return (
      <div className="p-4 border border-gray-200 bg-gray-50 rounded-md text-gray-500">
        <p>No channels found</p>
        {showActions && (
          <Button 
            onClick={() => router.push('/channels/new')} 
            className="mt-2"
          >
            Create Channel
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {channels.map((channel) => (
        <Card key={channel.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{channel.name}</CardTitle>
              <Badge variant={channel.status === 'active' ? 'default' : 'secondary'}>
                {channel.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              <p>Type: {channel.type}</p>
            </div>
            {showActions && (
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onSelectChannel?.(channel)}
                >
                  View Details
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => router.push(`/channels/${channel.id}`)}
                >
                  Manage
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
