'use client';

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  errorMessage?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  hideLabel?: boolean;
  name?: string;
  id?: string;
}

const AccessibleSelect = forwardRef<HTMLDivElement, SelectProps>(
  ({ 
    options, 
    value, 
    onChange, 
    placeholder = 'Selecione uma opção',
    label,
    errorMessage,
    helperText,
    disabled = false,
    required = false,
    fullWidth = false,
    hideLabel = false,
    name,
    id,
    className,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | undefined>(value);
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);
    const selectRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);
    const { announceToScreenReader } = useAccessibility();
    
    // Generate unique ID if not provided
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
    const labelId = `${selectId}-label`;
    const listboxId = `${selectId}-listbox`;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;
    
    // Determine if we should show an error state
    const hasError = !!errorMessage;
    
    // Determine which description ID to use for aria-describedby
    const descriptionId = hasError ? errorId : helperText ? helperId : undefined;
    
    // Get selected option label
    const selectedOption = options.find(option => option.value === selectedValue);
    const selectedLabel = selectedOption ? selectedOption.label : placeholder;
    
    // Handle keyboard navigation
    const { handleKeyDown } = useKeyboardNavigation({
      onArrowDown: (event) => {
        if (!isOpen) {
          event.preventDefault();
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          event.preventDefault();
          setFocusedIndex(prev => (prev < options.length - 1 ? prev + 1 : prev));
        }
      },
      onArrowUp: (event) => {
        if (!isOpen) {
          event.preventDefault();
          setIsOpen(true);
          setFocusedIndex(options.length - 1);
        } else {
          event.preventDefault();
          setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
        }
      },
      onEnter: (event) => {
        if (isOpen && focusedIndex >= 0 && focusedIndex < options.length) {
          event.preventDefault();
          const option = options[focusedIndex];
          if (!option.disabled) {
            handleSelect(option.value);
          }
        } else if (!isOpen) {
          event.preventDefault();
          setIsOpen(true);
        }
      },
      onEscape: (event) => {
        if (isOpen) {
          event.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          selectRef.current?.focus();
        }
      },
      onTab: (event) => {
        if (isOpen) {
          event.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
        }
      },
      onSpace: (event) => {
        if (!isOpen) {
          event.preventDefault();
          setIsOpen(true);
        } else if (focusedIndex >= 0 && focusedIndex < options.length) {
          event.preventDefault();
          const option = options[focusedIndex];
          if (!option.disabled) {
            handleSelect(option.value);
          }
        }
      },
      onHome: (event) => {
        if (isOpen) {
          event.preventDefault();
          setFocusedIndex(0);
        }
      },
      onEnd: (event) => {
        if (isOpen) {
          event.preventDefault();
          setFocusedIndex(options.length - 1);
        }
      },
    });
    
    // Handle click outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node) &&
          optionsRef.current &&
          !optionsRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setFocusedIndex(-1);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
    
    // Sync value with props
    useEffect(() => {
      setSelectedValue(value);
    }, [value]);
    
    // Scroll focused option into view
    useEffect(() => {
      if (isOpen && focusedIndex >= 0 && optionsRef.current) {
        const optionElements = optionsRef.current.querySelectorAll('[role="option"]');
        if (optionElements[focusedIndex]) {
          optionElements[focusedIndex].scrollIntoView({
            block: 'nearest',
          });
        }
      }
    }, [isOpen, focusedIndex]);
    
    // Handle select
    const handleSelect = (value: string) => {
      setSelectedValue(value);
      setIsOpen(false);
      setFocusedIndex(-1);
      onChange?.(value);
      
      // Announce selection to screen readers
      const option = options.find(option => option.value === value);
      if (option) {
        announceToScreenReader(`Selecionado: ${option.label}`, 'polite');
      }
      
      // Focus back on the select
      selectRef.current?.focus();
    };
    
    // Toggle dropdown
    const toggleDropdown = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        if (!isOpen) {
          // Set focus to the selected option or the first option
          const selectedIndex = options.findIndex(option => option.value === selectedValue);
          setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
        } else {
          setFocusedIndex(-1);
        }
      }
    };
    
    return (
      <div className={cn(
        "relative",
        fullWidth && "w-full",
        className
      )} {...props}>
        {label && (
          <label
            id={labelId}
            htmlFor={selectId}
            className={cn(
              "text-sm font-medium text-neutral-900 mb-1.5 block",
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
        
        <div
          ref={selectRef}
          role="combobox"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={descriptionId}
          aria-required={required ? 'true' : undefined}
          aria-invalid={hasError ? 'true' : undefined}
          aria-disabled={disabled ? 'true' : undefined}
          tabIndex={disabled ? -1 : 0}
          className={cn(
            "flex items-center justify-between w-full h-10 px-3 py-2 text-sm rounded-md border",
            disabled ? "bg-neutral-100 text-neutral-400 cursor-not-allowed" : "bg-white text-neutral-900 cursor-pointer",
            hasError ? "border-red-500 focus:ring-red-500" : "border-neutral-300 focus:ring-primary-500",
            "focus:outline-none focus:ring-2 focus:ring-offset-2"
          )}
          onClick={toggleDropdown}
          onKeyDown={(e) => handleKeyDown(e)}
          id={selectId}
        >
          <span className={cn(
            "truncate",
            !selectedValue && "text-neutral-500"
          )}>
            {selectedLabel}
          </span>
          
          <span className="pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "transition-transform",
                isOpen && "transform rotate-180"
              )}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
          
          {/* Hidden native select for form submission */}
          {name && (
            <select
              name={name}
              value={selectedValue}
              onChange={(e) => handleSelect(e.target.value)}
              required={required}
              disabled={disabled}
              className="sr-only"
              aria-hidden="true"
              tabIndex={-1}
            >
              <option value="" disabled hidden>
                {placeholder}
              </option>
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
        
        {isOpen && (
          <div
            ref={optionsRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={label ? labelId : undefined}
            className="absolute z-10 w-full mt-1 bg-white border border-neutral-300 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {options.length === 0 ? (
              <div className="py-2 px-3 text-sm text-neutral-500">
                Nenhuma opção disponível
              </div>
            ) : (
              options.map((option, index) => (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={selectedValue === option.value}
                  aria-disabled={option.disabled ? 'true' : undefined}
                  id={`${selectId}-option-${index}`}
                  className={cn(
                    "px-3 py-2 text-sm cursor-pointer",
                    selectedValue === option.value && "bg-primary-100 text-primary-900",
                    focusedIndex === index && "bg-neutral-100",
                    option.disabled && "opacity-50 cursor-not-allowed",
                    !option.disabled && "hover:bg-neutral-100"
                  )}
                  onClick={() => {
                    if (!option.disabled) {
                      handleSelect(option.value);
                    }
                  }}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        )}
        
        {helperText && !hasError && (
          <p id={helperId} className="mt-1 text-xs text-neutral-500">
            {helperText}
          </p>
        )}
        
        {hasError && (
          <p id={errorId} className="mt-1 text-xs text-red-500 font-medium">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

AccessibleSelect.displayName = 'AccessibleSelect';

export { AccessibleSelect };
