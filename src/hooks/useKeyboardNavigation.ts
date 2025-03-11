'use client';

import { useEffect, useRef, KeyboardEvent as ReactKeyboardEvent } from 'react';

type KeyboardNavigationOptions = {
  onArrowUp?: (event: KeyboardEvent) => void;
  onArrowDown?: (event: KeyboardEvent) => void;
  onArrowLeft?: (event: KeyboardEvent) => void;
  onArrowRight?: (event: KeyboardEvent) => void;
  onEnter?: (event: KeyboardEvent) => void;
  onEscape?: (event: KeyboardEvent) => void;
  onTab?: (event: KeyboardEvent) => void;
  onSpace?: (event: KeyboardEvent) => void;
  onHome?: (event: KeyboardEvent) => void;
  onEnd?: (event: KeyboardEvent) => void;
  onPageUp?: (event: KeyboardEvent) => void;
  onPageDown?: (event: KeyboardEvent) => void;
  onDelete?: (event: KeyboardEvent) => void;
  onBackspace?: (event: KeyboardEvent) => void;
};

/**
 * Hook to handle keyboard navigation
 * @param options Object with callback functions for different key presses
 * @returns Object with handleKeyDown function to attach to elements
 */
export const useKeyboardNavigation = (options: KeyboardNavigationOptions) => {
  const optionsRef = useRef(options);

  // Update options ref when options change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const handleKeyDown = (event: KeyboardEvent) => {
    const currentOptions = optionsRef.current;

    switch (event.key) {
      case 'ArrowUp':
        currentOptions.onArrowUp?.(event);
        break;
      case 'ArrowDown':
        currentOptions.onArrowDown?.(event);
        break;
      case 'ArrowLeft':
        currentOptions.onArrowLeft?.(event);
        break;
      case 'ArrowRight':
        currentOptions.onArrowRight?.(event);
        break;
      case 'Enter':
        currentOptions.onEnter?.(event);
        break;
      case 'Escape':
        currentOptions.onEscape?.(event);
        break;
      case 'Tab':
        currentOptions.onTab?.(event);
        break;
      case ' ':
        currentOptions.onSpace?.(event);
        break;
      case 'Home':
        currentOptions.onHome?.(event);
        break;
      case 'End':
        currentOptions.onEnd?.(event);
        break;
      case 'PageUp':
        currentOptions.onPageUp?.(event);
        break;
      case 'PageDown':
        currentOptions.onPageDown?.(event);
        break;
      case 'Delete':
        currentOptions.onDelete?.(event);
        break;
      case 'Backspace':
        currentOptions.onBackspace?.(event);
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return {
    handleKeyDown: (event: ReactKeyboardEvent) => handleKeyDown(event.nativeEvent),
  };
};

export default useKeyboardNavigation;
