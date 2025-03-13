'use client';

import React, { forwardRef, useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { useAccessibility } from '../providers/AccessibilityProvider';
import useFocusTrap from '../../hooks/useFocusTrap';

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'center' | 'top' | 'right' | 'bottom' | 'left';
  showCloseButton?: boolean;
  preventScroll?: boolean;
}

const AccessibleDialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ 
    open, 
    onOpenChange, 
    title,
    description,
    children,
    footer,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    size = 'md',
    position = 'center',
    showCloseButton = true,
    preventScroll = true,
    className,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(open);
    const { announceToScreenReader } = useAccessibility();
    const containerRef = React.useRef<HTMLDivElement>(null);
    
    // Use focus trap
    useFocusTrap(isOpen, true);
    
    // Sync internal state with props
    useEffect(() => { // Include handleClose in dependencies  // Include handleClose in dependencies
      setIsOpen(open);
      
      // Announce dialog state to screen readers
      if (open) {
        announceToScreenReader(`Diálogo aberto: ${title}`, 'assertive');
      } else {
        announceToScreenReader('Diálogo fechado', 'polite');
      }
    }, [open, title, announceToScreenReader]);
    
    // Prevent body scroll when dialog is open
    useEffect(() => { // Include handleClose in dependencies  // Include handleClose in dependencies
      if (preventScroll) {
        if (isOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      }
      
      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen, preventScroll]);
    
    // Handle escape key press
    useEffect(() => { // Include handleClose in dependencies  // Include handleClose in dependencies
      const handleKeyDown = (event: KeyboardEvent) => {
        if (closeOnEscape && event.key === 'Escape' && isOpen) {
          handleClose();
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [closeOnEscape, isOpen]);
    
    // Handle close
    const handleClose = () => {
      setIsOpen(false);
      onOpenChange(false);
    };
    
    // Handle outside click
    const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOutsideClick && event.target === event.currentTarget) {
        handleClose();
      }
    };
    
    // Generate unique IDs for accessibility
    const dialogId = React.useId();
    const titleId = `${dialogId}-title`;
    const descriptionId = `${dialogId}-description`;
    
    // Size classes
    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-full',
    };
    
    // Position classes
    const positionClasses = {
      center: 'items-center justify-center',
      top: 'items-start justify-center pt-16',
      right: 'items-center justify-end',
      bottom: 'items-end justify-center pb-16',
      left: 'items-center justify-start',
    };
    
    if (!isOpen) {
      return null;
    }
    
    return (
      <div
        className="fixed inset-0 z-50 bg-black/50 flex"
        onClick={handleOutsideClick}
        aria-hidden="true"
      >
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          className={cn(
            "relative bg-white rounded-lg shadow-lg w-full m-4 overflow-hidden flex flex-col",
            sizeClasses[size],
            positionClasses[position],
            className
          )}
          {...props}
        >
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <h2 id={titleId} className="text-lg font-semibold text-neutral-900">
              {title}
            </h2>
            
            {showCloseButton && (
              <button
                type="button"
                onClick={handleClose}
                className="text-neutral-500 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1"
                aria-label="Fechar diálogo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {description && (
            <div id={descriptionId} className="px-4 pt-2 text-sm text-neutral-500">
              {description}
            </div>
          )}
          
          <div className="p-4 overflow-y-auto flex-1">
            {children}
          </div>
          
          {footer && (
            <div className="p-4 border-t border-neutral-200 flex justify-end gap-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }
);

AccessibleDialog.displayName = 'AccessibleDialog';

export { AccessibleDialog };
