'use client';

import React from 'react';
import { Button as BaseButton } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/**
 * Enhanced Button component with improved accessibility
 */
export function Button({ children, className, ...props }: React.ComponentPropsWithoutRef<typeof BaseButton>) {
  return (
    <BaseButton
      {...props}
      className={cn(
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
        className
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

/**
 * AccessibleIcon component for adding accessible labels to icons
 */
interface AccessibleIconProps {
  children: React.ReactNode;
  label: string;
}

export function AccessibleIcon({ children, label }: AccessibleIconProps) {
  return (
    <span className="inline-flex items-center justify-center">
      {children}
      <span className="sr-only">{label}</span>
    </span>
  );
}

/**
 * FocusTrap component for trapping focus within a modal or dialog
 */
export function FocusTrap({ children }: { children: React.ReactNode }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [focusableElements, setFocusableElements] = React.useState<HTMLElement[]>([]);
  
  React.useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      setFocusableElements(Array.from(elements));
    }
  }, []);
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab' && focusableElements.length > 0) {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  return (
    <div ref={containerRef} onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
}

/**
 * Enhanced Form components with accessibility improvements
 */
export function FormLabel({ 
  children, 
  required, 
  htmlFor,
  className,
  ...props 
}: React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <>
          <span aria-hidden="true" className="text-destructive ml-1">*</span>
          <span className="sr-only"> (obrigatório)</span>
        </>
      )}
    </label>
  );
}

/**
 * Enhanced ErrorMessage component for form validation
 */
export function ErrorMessage({ 
  id, 
  children,
  className,
  ...props 
}: React.HTMLAttributes<HTMLParagraphElement> & { id?: string }) {
  if (!children) return null;
  
  return (
    <p
      id={id}
      role="alert"
      className={cn('text-sm font-medium text-destructive mt-1', className)}
      {...props}
    >
      {children}
    </p>
  );
}

/**
 * Enhanced Description component for form fields
 */
export function Description({ 
  id, 
  children,
  className,
  ...props 
}: React.HTMLAttributes<HTMLParagraphElement> & { id?: string }) {
  if (!children) return null;
  
  return (
    <p
      id={id}
      className={cn('text-sm text-muted-foreground mt-1', className)}
      {...props}
    >
      {children}
    </p>
  );
}
