'use client';

import React from 'react';
import { Button as BaseButton, ButtonProps } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/**
 * Enhanced Button component with improved accessibility
 */
export function Button({ children, ...props }: ButtonProps) {
  return (
    <BaseButton
      {...props}
      className={cn(
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
        props.className
      )}
    >
      {children}
    </BaseButton>
  );
}

/**
 * Skip link component for keyboard navigation
 */
interface SkipLinkProps {
  href: string;
  className?: string;
}

export function SkipLink({ href, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-primary',
        className
      )}
    >
      Pular para o conteúdo
    </a>
  );
}

/**
 * VisuallyHidden component for screen readers
 */
interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: React.ElementType;
}

export function VisuallyHidden({
  children,
  as: Component = 'span',
  ...props
}: VisuallyHiddenProps & React.HTMLAttributes<HTMLElement>) {
  return (
    <Component
      className="sr-only"
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * FocusScope component for managing focus within a modal or dialog
 */
interface FocusScopeProps {
  children: React.ReactNode;
  autoFocus?: boolean;
  restoreFocus?: boolean;
}

export function FocusScope({
  children,
  autoFocus = true,
  restoreFocus = true,
}: FocusScopeProps) {
  const scopeRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    if (autoFocus && scopeRef.current) {
      const focusableElements = scopeRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }

    return () => {
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [autoFocus, restoreFocus]);

  return <div ref={scopeRef}>{children}</div>;
}

/**
 * LiveRegion component for announcing dynamic content changes
 */
interface LiveRegionProps {
  children: React.ReactNode;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-atomic'?: boolean;
  role?: string;
}

export function LiveRegion({
  children,
  'aria-live': ariaLive = 'polite',
  'aria-atomic': ariaAtomic = true,
  role = 'status',
  ...props
}: LiveRegionProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
      role={role}
      {...props}
    >
      {children}
    </div>
  );
}
