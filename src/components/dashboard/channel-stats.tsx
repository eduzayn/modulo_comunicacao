'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Channel } from '../../types/index';

interface ChannelStatsProps {
  channels: Channel[];
}

export function ChannelStats({ channels }: ChannelStatsProps) {
  // Count channels by type
  const channelCounts = channels.reduce((acc, channel) => {
    acc[channel.type] = (acc[channel.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Count active vs inactive channels
  const activeChannels = channels.filter(channel => channel.status === 'active').length;
  const inactiveChannels = channels.length - activeChannels;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Canais de Comunicação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Ativos</span>
              <span className="text-2xl font-bold">{activeChannels}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Inativos</span>
              <span className="text-2xl font-bold">{inactiveChannels}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Distribuição por Tipo</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(channelCounts).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{type}</span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
