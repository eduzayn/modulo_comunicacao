"use client";

/**
 * page.tsx
 * 
 * Description: Test cache page
 * 
 * @module app/(communication)/test-cache
 * @author Devin AI
 * @created 2025-03-14
 */
import React from 'react';
import { QueryProvider } from '@/providers/QueryProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

/**
 * TestCachePage component
 * 
 * @returns Test cache page component
 */
export default function TestCachePage() {
  return (
    <QueryProvider>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Test Cache</h1>
        
        <Card className="p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Cache Testing</h2>
          <p className="mb-4">This page is used to test caching functionality.</p>
          
          <div className="flex space-x-2">
            <Button variant="default">Clear Cache</Button>
            <Button variant="outline">Refresh Data</Button>
          </div>
        </Card>
        
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">Cache Status</h2>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify({ status: 'active', items: 5, lastUpdated: new Date().toISOString() }, null, 2)}
          </pre>
        </Card>
      </div>
    </QueryProvider>
  );
}
