'use client';

import { useEffect, useRef } from 'react';
import { markPerformance, measurePerformance, clearPerformanceMarkers } from '@/lib/performance';

/**
 * Hook for measuring component performance
 * 
 * @param componentName Name of the component being measured
 */
export function useComponentPerformance(componentName: string) {
  const renderCount = useRef(0);
  
  useEffect(() => {
    // Mark the start of the render
    const renderMarkName = `${componentName}_render_${renderCount.current}`;
    markPerformance(renderMarkName);
    
    // Mark the end of the render in the next frame
    const timeoutId = setTimeout(() => {
      const renderEndMarkName = `${componentName}_render_end_${renderCount.current}`;
      markPerformance(renderEndMarkName);
      measurePerformance(
        `${componentName}_render_duration_${renderCount.current}`,
        renderMarkName,
        renderEndMarkName
      );
      renderCount.current += 1;
    }, 0);
    
    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutId);
      markPerformance(`${componentName}_unmount`);
    };
  }, [componentName]);
}

/**
 * Hook for measuring effect performance
 * 
 * @param effectName Name of the effect being measured
 * @param dependencies Effect dependencies
 * @param effectCallback Effect callback function
 */
export function usePerformanceEffect(
  effectName: string,
  dependencies: unknown[],
  effectCallback: () => void | (() => void)
) {
  useEffect(() => {
    const startMarkName = `${effectName}_start`;
    markPerformance(startMarkName);
    
    const cleanup = effectCallback();
    
    const endMarkName = `${effectName}_end`;
    markPerformance(endMarkName);
    measurePerformance(
      `${effectName}_duration`,
      startMarkName,
      endMarkName
    );
    
    return () => {
      if (cleanup) cleanup();
      markPerformance(`${effectName}_cleanup`);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}

/**
 * Hook for measuring data fetching performance
 * 
 * @param fetchName Name of the fetch operation
 * @returns Object with start and end functions
 */
export function useFetchPerformance(fetchName: string) {
  return {
    startFetch: () => {
      markPerformance(`${fetchName}_start`);
    },
    endFetch: () => {
      markPerformance(`${fetchName}_end`);
      measurePerformance(
        `${fetchName}_duration`,
        `${fetchName}_start`,
        `${fetchName}_end`
      );
    }
  };
}

/**
 * Hook for measuring interaction performance
 * 
 * @param interactionName Name of the interaction
 * @returns Object with start and end functions
 */
export function useInteractionPerformance(interactionName: string) {
  return {
    startInteraction: () => {
      markPerformance(`${interactionName}_start`);
    },
    endInteraction: () => {
      markPerformance(`${interactionName}_end`);
      measurePerformance(
        `${interactionName}_duration`,
        `${interactionName}_start`,
        `${interactionName}_end`
      );
    }
  };
}

/**
 * Hook for measuring route change performance
 */
export function useRouteChangePerformance() {
  useEffect(() => {
    // For Next.js route changes
    if (typeof window !== 'undefined') {
      const handleRouteChangeStart = (url: string) => {
        markPerformance(`route_change_start_${url}`);
      };
      
      const handleRouteChangeComplete = (url: string) => {
        markPerformance(`route_change_complete_${url}`);
        measurePerformance(
          `route_change_duration_${url}`,
          `route_change_start_${url}`,
          `route_change_complete_${url}`
        );
      };
      
      // Add event listeners
      if (window.next) {
        window.next.router.events.on('routeChangeStart', handleRouteChangeStart);
        window.next.router.events.on('routeChangeComplete', handleRouteChangeComplete);
        
        // Cleanup
        return () => {
          window.next.router.events.off('routeChangeStart', handleRouteChangeStart);
          window.next.router.events.off('routeChangeComplete', handleRouteChangeComplete);
        };
      }
    }
  }, []);
}
