'use client';

import React, { forwardRef, useState } from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onValidSubmit?: (data: Record<string, any>) => void;
  onInvalidSubmit?: (errors: Record<string, string>) => void;
  ariaDescribedBy?: string;
  loading?: boolean;
  loadingText?: string;
  successMessage?: string;
  errorMessage?: string;
}

const AccessibleForm = forwardRef<HTMLFormElement, FormProps>(
  ({ 
    children, 
    onValidSubmit, 
    onInvalidSubmit,
    ariaDescribedBy,
    loading = false,
    loadingText = 'Enviando formulário...',
    successMessage,
    errorMessage,
    className,
    ...props 
  }, ref) => {
    const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const { announceToScreenReader } = useAccessibility();
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      
      // Reset form state
      setFormState('loading');
      setValidationErrors({});
      
      // Announce loading state to screen readers
      announceToScreenReader(loadingText, 'polite');
      
      // Get form data
      const formData = new FormData(event.currentTarget);
      const data: Record<string, any> = {};
      
      // Convert FormData to object
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
      
      // Validate form
      const errors = validateForm(event.currentTarget);
      
      if (Object.keys(errors).length > 0) {
        // Form is invalid
        setFormState('error');
        setValidationErrors(errors);
        
        // Announce validation errors to screen readers
        const errorCount = Object.keys(errors).length;
        const errorMessage = `O formulário contém ${errorCount} ${errorCount === 1 ? 'erro' : 'erros'}. Por favor, corrija os campos destacados.`;
        announceToScreenReader(errorMessage, 'assertive');
        
        // Call onInvalidSubmit callback
        onInvalidSubmit?.(errors);
        
        return;
      }
      
      try {
        // Call onValidSubmit callback
        await onValidSubmit?.(data);
        
        // Set form state to success
        setFormState('success');
        
        // Announce success to screen readers
        if (successMessage) {
          announceToScreenReader(successMessage, 'polite');
        } else {
          announceToScreenReader('Formulário enviado com sucesso.', 'polite');
        }
      } catch (error) {
        // Set form state to error
        setFormState('error');
        
        // Announce error to screen readers
        if (errorMessage) {
          announceToScreenReader(errorMessage, 'assertive');
        } else {
          announceToScreenReader('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.', 'assertive');
        }
      }
    };
    
    // Validate form using HTML5 validation API
    const validateForm = (form: HTMLFormElement): Record<string, string> => {
      const errors: Record<string, string> = {};
      
      // Get all form elements
      const elements = Array.from(form.elements) as HTMLInputElement[];
      
      // Validate each element
      elements.forEach((element) => {
        // Skip elements without a name attribute
        if (!element.name) return;
        
        // Skip elements that are not inputs, selects, or textareas
        if (!['input', 'select', 'textarea'].includes(element.tagName.toLowerCase())) return;
        
        // Check validity
        if (!element.validity.valid) {
          // Get error message
          let errorMessage = element.validationMessage;
          
          // If element has a custom error message, use it
          if (element.dataset.errorMessage) {
            errorMessage = element.dataset.errorMessage;
          }
          
          errors[element.name] = errorMessage;
          
          // Add aria-invalid attribute
          element.setAttribute('aria-invalid', 'true');
          
          // Add error message to aria-describedby
          const errorId = `${element.id}-error`;
          const describedBy = element.getAttribute('aria-describedby');
          
          if (describedBy) {
            if (!describedBy.includes(errorId)) {
              element.setAttribute('aria-describedby', `${describedBy} ${errorId}`);
            }
          } else {
            element.setAttribute('aria-describedby', errorId);
          }
        } else {
          // Remove aria-invalid attribute
          element.removeAttribute('aria-invalid');
          
          // Remove error message from aria-describedby
          const errorId = `${element.id}-error`;
          const describedBy = element.getAttribute('aria-describedby');
          
          if (describedBy && describedBy.includes(errorId)) {
            element.setAttribute(
              'aria-describedby',
              describedBy.replace(errorId, '').trim()
            );
          }
        }
      });
      
      return errors;
    };
    
    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        noValidate
        aria-busy={loading || formState === 'loading'}
        aria-describedby={ariaDescribedBy}
        className={className}
        {...props}
      >
        {/* Form content */}
        {children}
        
        {/* Form status for screen readers */}
        <div className="sr-only" aria-live="polite">
          {formState === 'loading' && loadingText}
          {formState === 'success' && successMessage}
          {formState === 'error' && errorMessage}
        </div>
        
        {/* Validation errors summary for screen readers */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="sr-only" aria-live="assertive">
            <p>O formulário contém os seguintes erros:</p>
            <ul>
              {Object.entries(validationErrors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    );
  }
);

AccessibleForm.displayName = 'AccessibleForm';

export { AccessibleForm };
