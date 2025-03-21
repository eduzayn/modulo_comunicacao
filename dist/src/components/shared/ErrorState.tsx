import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Ocorreu um erro',
  message = 'Não foi possível carregar os dados. Por favor, tente novamente.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center',
        className
      )}
    >
      <AlertTriangle className="h-8 w-8 text-red-500" />
      <h3 className="mt-4 text-lg font-medium text-red-800">{title}</h3>
      <p className="mt-2 text-sm text-red-600">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-4">
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
