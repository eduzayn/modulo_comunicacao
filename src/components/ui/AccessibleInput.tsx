'use client';

import React, { forwardRef, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { useAccessibility } from '../providers/AccessibilityProvider';

const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: 'border-neutral-300 focus-visible:ring-primary-500',
        error: 'border-red-500 focus-visible:ring-red-500 text-red-900',
        success: 'border-green-500 focus-visible:ring-green-500',
      },
      size: {
        default: 'h-10 px-3 py-2 text-sm',
        sm: 'h-8 px-2 py-1 text-xs',
        lg: 'h-12 px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  hideLabel?: boolean;
}

const AccessibleInput = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    size, 
    label,
    helperText,
    errorMessage,
    fullWidth = false,
    startIcon,
    endIcon,
    hideLabel = false,
    id,
    required,
    disabled,
    type = 'text',
    ...props 
  }, ref) => {
    // const [isFocused, setIsFocused] = useState(false);
    const { announceToScreenReader } = useAccessibility();
    
    // Generate a unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;
    
    // Determine if we should show an error state
    const hasError = !!errorMessage;
    const inputVariant = hasError ? 'error' : variant;
    
    // Determine which description ID to use for aria-describedby
    const descriptionId = hasError ? errorId : helperText ? helperId : undefined;
    
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
      
      // Announce error to screen reader when input loses focus
      if (hasError) {
        announceToScreenReader(errorMessage, 'assertive');
      }
    };
    
    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "")}>
        {label && (
          <label 
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium text-neutral-900",
              hideLabel && "sr-only",
              hasError && "text-red-500"
            )}
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            )}
            {required && (
              <span className="sr-only"> (obrigatório)</span>
            )}
          </label>
        )}
        
        <div className={cn(
          "relative flex items-center",
          fullWidth && "w-full"
        )}>
          {startIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-neutral-500">
              {startIcon}
            </div>
          )}
          
          <input
            id={inputId}
            ref={ref}
            type={type}
            disabled={disabled}
            required={required}
            aria-invalid={hasError ? 'true' : undefined}
            aria-describedby={descriptionId}
            aria-required={required ? 'true' : undefined}
            className={cn(
              inputVariants({ variant: inputVariant, size }),
              startIcon && "pl-10",
              endIcon && "pr-10",
              fullWidth && "w-full",
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          
          {endIcon && (
            <div className="absolute right-3 flex items-center pointer-events-none text-neutral-500">
              {endIcon}
            </div>
          )}
        </div>
        
        {helperText && !hasError && (
          <p id={helperId} className="text-xs text-neutral-500">
            {helperText}
          </p>
        )}
        
        {hasError && (
          <p id={errorId} className="text-xs text-red-500 font-medium">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput';

export { AccessibleInput, inputVariants };
