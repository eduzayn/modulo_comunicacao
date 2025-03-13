/**
 * Loading state components for a better user experience
 */

'use client';

import React from 'react';
import { Skeleton } from './skeleton';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

/**
 * Table skeleton for loading state
 */
export function TableSkeleton({ 
  rows = 5, 
  columns = 4,
  className = ''
}: { 
  rows?: number; 
  columns?: number;
  className?: string;
}) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="border rounded-md">
        <div className={`grid grid-cols-${columns} gap-4 p-4 border-b`}>
          {Array(columns).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-6" />
          ))}
        </div>
        {Array(rows).fill(0).map((_, i) => (
          <div key={i} className={`grid grid-cols-${columns} gap-4 p-4 border-b`}>
            {Array(columns).fill(0).map((_, j) => (
              <Skeleton key={j} className="h-6" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Card skeleton for loading state
 */
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}

/**
 * Form skeleton for loading state
 */
export function FormSkeleton({ 
  fields = 4,
  className = ''
}: { 
  fields?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array(fields).fill(0).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-32 mt-6" />
    </div>
  );
}

/**
 * List skeleton for loading state
 */
export function ListSkeleton({ 
  items = 5,
  className = ''
}: { 
  items?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array(items).fill(0).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-3 border rounded-md">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Dashboard skeleton for loading state
 */
export function DashboardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <ListSkeleton items={3} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <TableSkeleton rows={3} columns={2} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Loading spinner component
 */
export function LoadingSpinner({ 
  size = 'default',
  className = ''
}: { 
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${sizeClasses[size]}`}></div>
    </div>
  );
}

/**
 * Loading overlay component
 */
export function LoadingOverlay({ 
  message = 'Loading...',
  className = ''
}: { 
  message?: string;
  className?: string;
}) {
  return (
    <div className={`fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 ${className}`}>
      <LoadingSpinner size="lg" />
      {message && (
        <p className="mt-4 text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
