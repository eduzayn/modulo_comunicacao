'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

type AccessibilityContextType = {
  highContrastMode: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderAnnouncements: string[];
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleReducedMotion: () => void;
  announceToScreenReader: (message: string) => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  // Persistent preferences
  const [highContrastMode, setHighContrastMode] = useLocalStorage('accessibility-high-contrast', false);
  const [largeText, setLargeText] = useLocalStorage('accessibility-large-text', false);
  const [reducedMotion, setReducedMotion] = useLocalStorage('accessibility-reduced-motion', false);
  
  // Screen reader announcements
  const [screenReaderAnnouncements, setScreenReaderAnnouncements] = useState<string[]>([]);
  
  // Toggle functions
  const toggleHighContrast = useCallback(() => {
    setHighContrastMode(!highContrastMode);
  }, [highContrastMode, setHighContrastMode]);
  
  const toggleLargeText = useCallback(() => {
    setLargeText(!largeText);
  }, [largeText, setLargeText]);
  
  const toggleReducedMotion = useCallback(() => {
    setReducedMotion(!reducedMotion);
  }, [reducedMotion, setReducedMotion]);
  
  // Screen reader announcement function
  const announceToScreenReader = useCallback((message: string) => {
    setScreenReaderAnnouncements(prev => [...prev, message]);
  }, []);
  
  // Apply accessibility settings to document
  useEffect(() => {
    // Apply high contrast mode
    document.documentElement.classList.toggle('high-contrast', highContrastMode);
    
    // Apply large text
    document.documentElement.classList.toggle('large-text', largeText);
    
    // Apply reduced motion
    document.documentElement.classList.toggle('reduced-motion', reducedMotion);
    
    // Try to load translations if available
    try {
      // Using dynamic import instead of require
      import('@/locales/accessibility.json')
        .then(translations => {
          console.log('Loaded accessibility translations:', translations);
        })
        .catch(() => {
          // Translations not available, continue without them
        });
    } catch {
      // Translations not available, continue without them
    }
  }, [highContrastMode, largeText, reducedMotion]);
  
  // Clear screen reader announcements after they've been read
  useEffect(() => {
    if (screenReaderAnnouncements.length > 0) {
      const timer = setTimeout(() => {
        setScreenReaderAnnouncements([]);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [screenReaderAnnouncements]);
  
  const value = {
    highContrastMode,
    largeText,
    reducedMotion,
    screenReaderAnnouncements,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    announceToScreenReader
  };
  
  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      {/* Screen reader announcements */}
      {screenReaderAnnouncements.length > 0 && (
        <div 
          role="status" 
          aria-live="polite" 
          className="sr-only"
        >
          {screenReaderAnnouncements.map((announcement, i) => (
            <div key={`${i}-${announcement}`}>{announcement}</div>
          ))}
        </div>
      )}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
