'use client';

import React from 'react';

export interface PerformanceMarker {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

// Store performance markers
const performanceMarkers: Record<string, PerformanceMarker> = {};

/**
 * Start a performance measurement
 */
export function startPerformanceMarker(name: string): void {
  performanceMarkers[name] = {
    name,
    startTime: performance.now(),
  };
}

/**
 * End a performance measurement and calculate duration
 */
export function endPerformanceMarker(name: string): PerformanceMarker | null {
  const marker = performanceMarkers[name];
  if (!marker) {
    console.warn(`Performance marker "${name}" not found`);
    return null;
  }
  
  marker.endTime = performance.now();
  marker.duration = marker.endTime - marker.startTime;
  
  // Log the performance measurement
  console.log(`Performance: ${name} - ${marker.duration.toFixed(2)}ms`);
  
  return marker;
}

/**
 * Get a performance marker
 */
export function getPerformanceMarker(name: string): PerformanceMarker | null {
  return performanceMarkers[name] || null;
}

/**
 * Higher-order function to measure performance of a function
 * @param name Name of the performance measurement
 * @param fn Function to wrap with performance tracking
 * @returns Wrapped function with performance tracking
 */
export function withPerformanceTracking<T extends (...args: unknown[]) => unknown>(
  name: string,
  fn: T
): T {
  return ((...args: unknown[]) => {
    startPerformanceMarker(name);
    try {
      const result = fn(...args);
      
      // Handle promises
      if (result instanceof Promise) {
        return result.finally(() => {
          endPerformanceMarker(name);
        });
      }
      
      endPerformanceMarker(name);
      return result;
    } catch (error) {
      endPerformanceMarker(name);
      throw error;
    }
  }) as T;
}

/**
 * React hook to measure component render performance
 */
export function usePerformanceTracking(componentName: string): void {
  // Store the start time in a ref to persist across renders
  const startTimeRef = React.useRef<number>(performance.now());
  
  // Always define hooks at the top level
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const renderTime = performance.now() - startTime;
      console.log(`Component render time: ${componentName} - ${renderTime.toFixed(2)}ms`);
    }
    
    return () => {
      if (process.env.NODE_ENV === "development") {
        const unmountTime = performance.now() - startTime;
        console.log(`Component lifecycle time: ${componentName} - ${unmountTime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);
}
