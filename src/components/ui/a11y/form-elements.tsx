'use client';

import React from 'react';
import { Input as BaseInput, InputProps } from '@/components/ui/input';
import { Label as BaseLabel } from '@/components/ui/label';
import { Checkbox as BaseCheckbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

/**
 * Enhanced Input component with improved accessibility
 */
export function Input({ className, ...props }: InputProps) {
  return (
    <BaseInput
      className={cn(
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
        className
      )}
      {...props}
    />
  );
}

/**
 * Enhanced Label component with improved accessibility
 */
interface LabelProps extends React.ComponentPropsWithoutRef<typeof BaseLabel> {
  required?: boolean;
}

export function Label({ children, required, className, ...props }: LabelProps) {
  return (
    <BaseLabel
      className={cn('flex items-center gap-1', className)}
      {...props}
    >
      {children}
      {required && (
        <span className="text-destructive" aria-hidden="true">
          *
        </span>
      )}
      {required && (
        <span className="sr-only"> (obrigatório)</span>
      )}
    </BaseLabel>
  );
}

/**
 * Enhanced Checkbox component with improved accessibility
 */
interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof BaseCheckbox> {
  label: string;
  description?: string;
}

export function Checkbox({ label, description, className, ...props }: CheckboxProps) {
  const id = React.useId();
  
  return (
    <div className="flex items-start space-x-2">
      <BaseCheckbox
        id={id}
        className={cn(
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
          className
        )}
        {...props}
      />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * FormGroup component for grouping form elements
 */
interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function FormGroup({ children, className }: FormGroupProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
    </div>
  );
}

/**
 * ErrorMessage component for displaying form errors
 */
interface ErrorMessageProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export function ErrorMessage({ children, id, className }: ErrorMessageProps) {
  if (!children) return null;
  
  return (
    <p
      id={id}
      className={cn('text-sm font-medium text-destructive', className)}
      role="alert"
    >
      {children}
    </p>
  );
}
