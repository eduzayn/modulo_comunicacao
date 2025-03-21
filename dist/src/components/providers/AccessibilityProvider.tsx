'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { shouldUseHighContrast, setHighContrastMode } from '../../lib/accessibility-utils';

type AccessibilityContextType = {
  highContrastMode: boolean;
  toggleHighContrastMode: () => void;
  announceToScreenReader: (message: string, politeness?: 'polite' | 'assertive') => void;
  focusableElements: HTMLElement[];
  registerFocusableElement: (element: HTMLElement) => void;
  unregisterFocusableElement: (element: HTMLElement) => void;
  reducedMotion: boolean;
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export interface AccessibilityProviderProps {
  children: React.ReactNode;
  defaultHighContrast?: boolean;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
  defaultHighContrast = false,
}) => {
  const [highContrastMode, setHighContrastMode] = useState(defaultHighContrast);
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);
  const [announcements, setAnnouncements] = useState<{
    polite: string[];
    assertive: string[];
  }>({
    polite: [],
    assertive: [],
  });
  const [reducedMotion, setReducedMotion] = useState(false);
  
  let t: any;
  try {
    t = useTranslations('accessibility');
  } catch (error) {
    // Fallback if translations are not available
    t = (key: string) => key;
  }

  // Toggle high contrast mode
  const toggleHighContrastMode = useCallback(() => {
    setHighContrastMode((prev) => {
      const newValue = !prev;
      setHighContrastMode(newValue);
      
      // Announce change to screen readers
      announceToScreenReader(
        newValue 
          ? t('highContrastEnabled') 
          : t('highContrastDisabled'),
        'polite'
      );
      
      return newValue;
    });
  }, [t]);

  // Announce message to screen readers
  const announceToScreenReader = useCallback((
    message: string,
    politeness: 'polite' | 'assertive' = 'polite'
  ) => {
    setAnnouncements((prev) => ({
      ...prev,
      [politeness]: [...prev[politeness], message],
    }));
  }, []);

  // Register focusable element
  const registerFocusableElement = useCallback((element: HTMLElement) => {
    setFocusableElements((prev) => [...prev, element]);
  }, []);

  // Unregister focusable element
  const unregisterFocusableElement = useCallback((element: HTMLElement) => {
    setFocusableElements((prev) => prev.filter((el) => el !== element));
  }, []);

  // Initialize high contrast mode based on user preference
  useEffect(() => {
    const userPreference = shouldUseHighContrast();
    setHighContrastMode(userPreference);
    
    // Apply high contrast mode to document
    if (userPreference) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Check for reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setReducedMotion(prefersReducedMotion);
      
      // Listen for changes in reduced motion preference
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handleReducedMotionChange = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches);
      };
      
      mediaQuery.addEventListener('change', handleReducedMotionChange);
      return () => {
        mediaQuery.removeEventListener('change', handleReducedMotionChange);
      };
    }
  }, []);

  // Apply high contrast mode when state changes
  useEffect(() => {
    if (highContrastMode) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Store user preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('high-contrast-mode', highContrastMode.toString());
    }
  }, [highContrastMode]);

  // Clean up announcements after they've been read
  useEffect(() => {
    const cleanupAnnouncements = setTimeout(() => {
      setAnnouncements({
        polite: [],
        assertive: [],
      });
    }, 5000);
    
    return () => {
      clearTimeout(cleanupAnnouncements);
    };
  }, [announcements]);

  return (
    <AccessibilityContext.Provider
      value={{
        highContrastMode,
        toggleHighContrastMode,
        announceToScreenReader,
        focusableElements,
        registerFocusableElement,
        unregisterFocusableElement,
        reducedMotion,
      }}
    >
      {children}
      
      {/* Skip navigation links */}
      <a
        href="#main-content"
        className="skip-link"
      >
        {t('skipToContent')}
      </a>
      
      <a
        href="#navigation"
        className="skip-link"
      >
        {t('skipToNavigation')}
      </a>
      
      <a
        href="#search"
        className="skip-link"
      >
        {t('skipToSearch')}
      </a>
      
      {/* Screen reader announcements - polite */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
        id="accessibility-announcer-polite"
      >
        {announcements.polite.slice(-3).map((announcement, index) => (
          <div key={`polite-${index}`}>{announcement}</div>
        ))}
      </div>
      
      {/* Screen reader announcements - assertive */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        role="alert"
        id="accessibility-announcer-assertive"
      >
        {announcements.assertive.slice(-3).map((announcement, index) => (
          <div key={`assertive-${index}`}>{announcement}</div>
        ))}
      </div>
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider;
