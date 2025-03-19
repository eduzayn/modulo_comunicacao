"use client";

/**
 * page.tsx
 * 
 * Description: Conversations list page
 * 
 * @module app/(communication)/conversations
 * @author Devin AI
 * @created 2025-03-14
 */
import React from 'react';
import { QueryProvider } from '@/providers/QueryProvider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * ConversationsPage component
 * 
 * @returns Conversations page component
 */
export default function ConversationsPage() {
  return (
    <QueryProvider>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Conversations</h1>
        
        <div className="mb-4 flex justify-between items-center">
          <div>
            <Button variant="default">New Conversation</Button>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Sort</Button>
          </div>
        </div>
        
        <div className="grid gap-4">
          {[1, 2, 3].map((id) => (
            <Card key={id} className="p-4">
              <h2 className="text-xl font-semibold mb-2">Conversation {id}</h2>
              <p className="text-gray-600 mb-2">Last updated: {new Date().toLocaleDateString()}</p>
              <div className="flex space-x-2 mt-2">
                <Button variant="outline" size="sm">View</Button>
                <Button variant="outline" size="sm">Archive</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </QueryProvider>
  );
}
