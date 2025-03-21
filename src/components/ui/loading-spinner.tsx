/**
 * loading-spinner.tsx
 * 
 * Componente de spinner de carregamento reutilizável
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'ghost';
  text?: string;
}

export function LoadingSpinner({
  size = 'md',
  className,
  variant = 'default',
  text,
}: LoadingSpinnerProps) {
  // Mapear tamanho para classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  // Mapear variante para cores
  const variantClasses = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    secondary: 'text-secondary',
    ghost: 'text-gray-300 dark:text-gray-600',
  };

  return (
    <div className={cn('flex items-center justify-center flex-col gap-2', className)}>
      <Loader2
        className={cn(
          'animate-spin',
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
} 