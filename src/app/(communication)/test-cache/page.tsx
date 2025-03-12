'use client';

import React, { useEffect, useState } from 'react';
import { useConversations } from '@/hooks/use-conversations';
import { useMessages } from '@/hooks/use-messages';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function TestCachePage() {
  const { conversations, isLoading } = useConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<string>('');
  const [cacheStatus, setCacheStatus] = useState<string>('');
  
  // Select first conversation when loaded
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);
  
  const { 
    messages, 
    sendMessage, 
    prefetchMessages 
  } = useMessages(selectedConversationId);
  
  // Check localStorage for cache
  useEffect(() => {
    const checkCache = () => {
      if (typeof window !== 'undefined') {
        const cache = localStorage.getItem('edunexia-communication-cache');
        setCacheStatus(cache ? 'Cache found in localStorage' : 'No cache found');
      }
    };
    
    checkCache();
    
    // Set up interval to check cache
    const interval = setInterval(checkCache, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSendTestMessage = () => {
    if (selectedConversationId) {
      sendMessage({
        content: `Test message at ${new Date().toISOString()}`,
        type: 'text'
      });
    }
  };
  
  const handlePrefetchMessages = (conversationId: string) => {
    prefetchMessages(conversationId);
    setSelectedConversationId(conversationId);
  };
  
  if (isLoading) {
    return <div>Loading conversations...</div>;
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cache Testing Page</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cache Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{cacheStatus}</p>
          <Button 
            onClick={() => {
              localStorage.clear();
              setCacheStatus('Cache cleared');
              window.location.reload();
            }}
            variant="destructive"
            className="mt-2"
          >
            Clear Cache &amp; Reload
          </Button>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            {conversations.length === 0 ? (
              <p>No conversations found</p>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <Button
                    key={conversation.id}
                    variant={selectedConversationId === conversation.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handlePrefetchMessages(conversation.id)}
                  >
                    Conversation {conversation.id.substring(0, 8)}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedConversationId ? (
              <p>Select a conversation</p>
            ) : (
              <>
                <div className="h-60 overflow-y-auto border rounded p-3 mb-3">
                  {messages.length === 0 ? (
                    <p>No messages found</p>
                  ) : (
                    <div className="space-y-2">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`p-2 rounded ${
                            message.senderId === 'current-user' 
                              ? 'bg-blue-100 ml-auto max-w-[80%]' 
                              : 'bg-gray-100 mr-auto max-w-[80%]'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs text-gray-500">
                            {message.status} - {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button onClick={handleSendTestMessage} className="w-full">
                  Send Test Message
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
