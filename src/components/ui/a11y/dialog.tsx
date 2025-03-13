'use client';

import React from 'react';
import {
  Dialog as BaseDialog,
  DialogContent as BaseDialogContent,
  DialogDescription as BaseDialogDescription,
  DialogFooter as BaseDialogFooter,
  DialogHeader as BaseDialogHeader,
  DialogTitle as BaseDialogTitle,
  DialogTrigger as BaseDialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { FocusScope } from './index';

/**
 * Enhanced Dialog component with improved accessibility
 */
export const Dialog = BaseDialog;
export const DialogTrigger = BaseDialogTrigger;
export const DialogFooter = BaseDialogFooter;

/**
 * Enhanced DialogContent component with improved accessibility
 */
interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof BaseDialogContent> {
  closeLabel?: string;
}

export function DialogContent({
  children,
  closeLabel = 'Fechar',
  className,
  ...props
}: DialogContentProps) {
  return (
    <BaseDialogContent
      className={cn('focus:outline-none', className)}
      {...props}
    >
      <FocusScope>
        {children}
      </FocusScope>
    </BaseDialogContent>
  );
}

/**
 * Enhanced DialogHeader component with improved accessibility
 */
export function DialogHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseDialogHeader>) {
  return (
    <BaseDialogHeader
      className={cn('text-left', className)}
      {...props}
    />
  );
}

/**
 * Enhanced DialogTitle component with improved accessibility
 */
export function DialogTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseDialogTitle>) {
  return (
    <BaseDialogTitle
      className={cn('text-xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
}

/**
 * Enhanced DialogDescription component with improved accessibility
 */
export function DialogDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseDialogDescription>) {
  return (
    <BaseDialogDescription
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}
