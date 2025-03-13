import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  };
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  action, 
  className 
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8 flex flex-col md:flex-row md:items-center md:justify-between', className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
      {action && (
        <div className="mt-4 md:mt-0">
          <Button 
            onClick={action.onClick} 
            variant={action.variant || 'default'}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
