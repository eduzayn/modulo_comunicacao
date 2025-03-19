"use client";

/**
 * page.tsx
 * 
 * Description: Channel detail page
 * 
 * @module app/(communication)/channels/[id]
 * @author Devin AI
 * @created 2025-03-12
 */
import React from 'react';
import { useChannel } from '@/hooks/use-channel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Channel detail page component
 * 
 * @param params - Page parameters
 * @returns Channel detail page
 */
export default function ChannelDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { channel, isLoading, error, updateChannel, deleteChannel } = useChannel(id);

  if (isLoading) {
    return <div>Loading channel...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!channel) {
    return <div>Channel not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Channel Details</h1>
      
      <Card className="mb-4">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{channel.name}</h2>
          <p className="mb-2"><strong>Type:</strong> {channel.type}</p>
          <p className="mb-2"><strong>Status:</strong> {channel.status}</p>
          
          {channel.config && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Configuration</h3>
              <pre className="bg-gray-100 p-2 rounded">
                {JSON.stringify(channel.config, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="mt-4 flex space-x-2">
            <Button
              variant="default"
              onClick={() => {
                // Handle edit
              }}
            >
              Edit Channel
            </Button>
            
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm('Are you sure you want to delete this channel?')) {
                  deleteChannel();
                }
              }}
            >
              Delete Channel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
