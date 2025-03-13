/**
 * Performance monitoring utilities
 * 
 * This module provides utilities for tracking and measuring performance
 * of functions and components in the application.
 */

import React from 'react';

/**
 * Track performance of a synchronous callback function
 * 
 * @param name Name of the operation being tracked
 * @param callback Function to execute and measure
 */
export function trackPerformance<T>(name: string, callback: () => T): T {
  if (typeof window !== 'undefined' && window.performance) {
    const start = performance.now();
    const result = callback();
    const end = performance.now();
    const duration = end - start;
    
    console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
    
    // In production, we could send this data to an analytics service
    if (process.env.NODE_ENV === 'production') {
      // Implementation for production performance tracking
      // sendPerformanceMetric(name, duration);
    }
    
    return result;
  } else {
    return callback();
  }
}

/**
 * Higher-order function that wraps a function with performance tracking
 * 
 * @param name Name of the operation being tracked
 * @param fn Function to wrap with performance tracking
 * @returns Wrapped function with performance tracking
 */
export function withPerformanceTracking<T extends (...args: unknown[]) => any>(
  name: string,
  fn: T
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    if (typeof window !== 'undefined' && window.performance) {
      const start = performance.now();
      const result = fn(...args);
      
      if (result instanceof Promise) {
        return result.finally(() => {
          const end = performance.now();
          const duration = end - start;
          console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
          
          // In production, we could send this data to an analytics service
          if (process.env.NODE_ENV === 'production') {
            // sendPerformanceMetric(name, duration);
          }
        }) as ReturnType<T>;
      } else {
        const end = performance.now();
        const duration = end - start;
        console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
        
        // In production, we could send this data to an analytics service
        if (process.env.NODE_ENV === 'production') {
          // sendPerformanceMetric(name, duration);
        }
        
        return result;
      }
    } else {
      return fn(...args);
    }
  }) as T;
}

/**
 * React hook for measuring component render performance
 * 
 * @param componentName Name of the component being measured
 */
export function usePerformanceMonitoring(componentName: string): void {
  if (typeof window !== 'undefined' && window.performance) {
    const startTime = performance.now();
    
    // Use React's useEffect to measure render time
    React.useEffect(() => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log(`Component Render: ${componentName} took ${duration.toFixed(2)}ms`);
      
      // In production, we could send this data to an analytics service
      if (process.env.NODE_ENV === 'production') {
        // sendPerformanceMetric(`render_${componentName}`, duration);
      }
      
      // Cleanup function to measure unmount time
      return () => {
        const unmountStart = performance.now();
        
        // We need to use setTimeout to actually measure the unmount time
        // since the cleanup function is called before the actual DOM removal
        setTimeout(() => {
          const unmountEnd = performance.now();
          const unmountDuration = unmountEnd - unmountStart;
          console.log(`Component Unmount: ${componentName} took ${unmountDuration.toFixed(2)}ms`);
        }, 0);
      };
    }, []);
  }
}

/**
 * Track performance of a fetch request
 * 
 * @param url URL being fetched
 * @param options Fetch options
 * @returns Promise with fetch result
 */
export async function trackFetchPerformance<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  if (typeof window !== 'undefined' && window.performance) {
    const start = performance.now();
    
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      
      const end = performance.now();
      const duration = end - start;
      console.log(`Fetch: ${url} took ${duration.toFixed(2)}ms`);
      
      // In production, we could send this data to an analytics service
      if (process.env.NODE_ENV === 'production') {
        // sendPerformanceMetric(`fetch_${url}`, duration);
      }
      
      return data as T;
    } catch (error) {
      const end = performance.now();
      const duration = end - start;
      console.error(`Fetch Error: ${url} failed after ${duration.toFixed(2)}ms`, error);
      
      throw error;
    }
  } else {
    const response = await fetch(url, options);
    return await response.json() as T;
  }
}

/**
 * Create a performance marker
 * 
 * @param name Name of the marker
 */
export function markPerformance(name: string): void {
  if (typeof window !== 'undefined' && window.performance && performance.mark) {
    performance.mark(name);
  }
}

/**
 * Measure time between two performance markers
 * 
 * @param name Name of the measurement
 * @param startMark Start marker name
 * @param endMark End marker name
 */
export function measurePerformance(
  name: string,
  startMark: string,
  endMark: string
): void {
  if (
    typeof window !== 'undefined' &&
    window.performance &&
    performance.measure
  ) {
    try {
      performance.measure(name, startMark, endMark);
      const entries = performance.getEntriesByName(name, 'measure');
      
      if (entries.length > 0) {
        const duration = entries[0].duration;
        console.log(`Measure: ${name} took ${duration.toFixed(2)}ms`);
        
        // In production, we could send this data to an analytics service
        if (process.env.NODE_ENV === 'production') {
          // sendPerformanceMetric(name, duration);
        }
      }
    } catch (e) {
      console.error('Error measuring performance:', e);
    }
  }
}

/**
 * Clear all performance markers and measurements
 */
export function clearPerformanceMarkers(): void {
  if (typeof window !== 'undefined' && window.performance) {
    if (performance.clearMarks) performance.clearMarks();
    if (performance.clearMeasures) performance.clearMeasures();
  }
}
