import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  };
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({
  title,
  description,
  action,
  children,
  className,
}: PageLayoutProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <PageHeader title={title} description={description} action={action} />
      <div className="space-y-6">{children}</div>
    </div>
  );
}
