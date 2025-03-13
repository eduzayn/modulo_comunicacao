'use client';

import { useCallback } from 'react';

/**
 * Utility function to get accessibility translation keys
 * @param locale Current locale
 * @param key Translation key path
 * @returns Translated string or fallback
 */
export const getAccessibilityTranslation = async (
  locale: string,
  key: string
): Promise<string> => {
  try {
    // Dynamic import of locale file
    // const translationModule = await import(`../app/messages/accessibility/${locale}.json`);
    
    // Split the key path and traverse the object
    const keys = key.split('.');
    let value: unknown = module;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Key not found, try fallback to en-US
        if (locale !== 'en-US') {
          return getAccessibilityTranslation('en-US', key);
        }
        return key; // Last resort fallback
      }
    }
    
    if (typeof value === 'string') {
      return value;
    }
    
    // If value is not a string, try fallback to en-US
    if (locale !== 'en-US') {
      return getAccessibilityTranslation('en-US', key);
    }
    
    return key; // Last resort fallback
  } catch (_error) {
    // If file not found or error, try fallback to en-US
    if (locale !== 'en-US') {
      return getAccessibilityTranslation('en-US', key);
    }
    return key; // Last resort fallback
  }
};

/**
 * React hook for accessibility translations
 * @param locale Current locale
 * @returns Object with translation functions
 */
export const useAccessibilityTranslations = (locale: string = 'pt-BR') => {
  const t = useCallback(
    async (key: string, fallback?: string): Promise<string> => {
      try {
        return await getAccessibilityTranslation(locale, key);
      } catch (_error) {
        return fallback || key;
      }
    },
    [locale]
  );
  
  return { t };
};

/**
 * Format date according to locale
 * @param date Date to format
 * @param locale Current locale
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | number,
  locale: string = 'pt-BR',
  options: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }
): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Format currency according to locale
 * @param value Number to format
 * @param locale Current locale
 * @param currency Currency code
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number,
  locale: string = 'pt-BR',
  currency: string = 'BRL'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};

/**
 * Format number according to locale
 * @param value Number to format
 * @param locale Current locale
 * @param options Intl.NumberFormatOptions
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number,
  locale: string = 'pt-BR',
  options: Intl.NumberFormatOptions = {}
): string => {
  return new Intl.NumberFormat(locale, options).format(value);
};

/**
 * Format percentage according to locale
 * @param value Number to format
 * @param locale Current locale
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number,
  locale: string = 'pt-BR',
  decimals: number = 2
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

/**
 * Get appropriate ARIA label for required fields
 * @param label Field label
 * @param locale Current locale
 * @returns Label with required indicator
 */
export const getRequiredFieldLabel = async (
  label: string,
  locale: string = 'pt-BR'
): Promise<string> => {
  const requiredText = await getAccessibilityTranslation(locale, 'aria.required');
  return `${label} (${requiredText})`;
};

/**
 * Announce message to screen readers
 * @param message Message to announce
 * @param politeness Politeness level
 */
export const announceToScreenReader = (
  message: string,
  politeness: 'polite' | 'assertive' = 'polite'
): void => {
  // Create or get announcer element
  let announcer = document.getElementById(`accessibility-announcer-${politeness}`);
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = `accessibility-announcer-${politeness}`;
    announcer.className = 'sr-only';
    announcer.setAttribute('aria-live', politeness);
    document.body.appendChild(announcer);
  }
  
  // Clear previous announcements
  announcer.textContent = '';
  
  // Small delay to ensure screen readers register the change
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
};

/**
 * Check if high contrast mode should be enabled
 * @returns Boolean indicating if high contrast should be used
 */
export const shouldUseHighContrast = (): boolean => {
  // Check if user has set preference in localStorage
  const storedPreference = typeof window !== 'undefined' 
    ? localStorage.getItem('high-contrast-mode') 
    : null;
  
  if (storedPreference !== null) {
    return storedPreference === 'true';
  }
  
  // Check if user has high contrast mode enabled in system
  if (typeof window !== 'undefined' && window.matchMedia) {
    // Check for Windows high contrast mode
    const isHighContrastMode = window.matchMedia('(-ms-high-contrast: active)').matches;
    
    // Check for general high contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
    
    return isHighContrastMode || prefersHighContrast;
  }
  
  return false;
};

/**
 * Set high contrast mode preference
 * @param enabled Boolean indicating if high contrast should be enabled
 */
export const setHighContrastMode = (enabled: boolean): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('high-contrast-mode', enabled.toString());
    
    // Add or remove class from document body
    if (enabled) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }
};

/**
 * Check if reduced motion should be used
 * @returns Boolean indicating if reduced motion should be used
 */
export const shouldUseReducedMotion = (): boolean => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};

/**
 * Generate unique ID for accessibility elements
 * @param prefix ID prefix
 * @returns Unique ID string
 */
export const generateAccessibilityId = (prefix: string = 'a11y'): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Filter undefined ARIA attributes
 * @param attributes Object with ARIA attributes
 * @returns Filtered object with only defined attributes
 */
export const filterAriaAttributes = (
  attributes: Record<string, string | undefined>
): Record<string, string> => {
  return Object.entries(attributes)
    .filter(([_, value]) => value !== undefined)
    .reduce((acc, [key, value]) => {
      acc[key] = value as string;
      return acc;
    }, {} as Record<string, string>);
};

/**
 * Get appropriate error message for form validation
 * @param errorType Type of validation error
 * @param locale Current locale
 * @param params Additional parameters for the message
 * @returns Localized error message
 */
export const getValidationErrorMessage = async (
  errorType: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'validate' | string,
  locale: string = 'pt-BR',
  params?: Record<string, string | number | boolean>
): Promise<string> => {
  let key = '';
  
  switch (errorType) {
    case 'required':
      key = 'form.requiredField';
      break;
    case 'email':
      key = 'form.invalidEmail';
      break;
    case 'minLength':
      key = 'form.minLength';
      break;
    case 'maxLength':
      key = 'form.maxLength';
      break;
    default:
      key = `form.${errorType}`;
  }
  
  let message = await getAccessibilityTranslation(locale, key);
  
  // Replace parameters in the message
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      message = message.replace(`{${key}}`, value);
    });
  }
  
  return message;
};
