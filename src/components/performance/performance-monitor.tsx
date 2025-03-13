'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useComponentPerformance } from '@/hooks/use-performance';

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
}

/**
 * Component for displaying performance metrics in development mode
 */
export function PerformanceMonitor() {
  useComponentPerformance('PerformanceMonitor');
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development mode
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Override console.log to capture performance metrics
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      originalConsoleLog(...args);
      
      // Check if this is a performance log
      const logString = args.join(' ');
      if (logString.includes('Performance:') || 
          logString.includes('Component Render:') || 
          logString.includes('Measure:') ||
          logString.includes('Fetch:')) {
        
        // Extract metric name and duration
        const match = logString.match(/([^:]+): (.+) took ([0-9.]+)ms/);
        if (match) {
          const type = match[1];
          const name = match[2];
          const duration = parseFloat(match[3]);
          
          setMetrics(prev => [
            ...prev, 
            { 
              name: `${type}: ${name}`, 
              duration, 
              timestamp: Date.now() 
            }
          ].slice(-20)); // Keep only the last 20 metrics
        }
      }
    };

    // Add keyboard shortcut to toggle visibility (Ctrl+Shift+P)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      console.log = originalConsoleLog;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Don't render anything if not in development mode or not visible
  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 shadow-lg">
      <Card>
        <CardHeader className="py-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Performance Monitor</CardTitle>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-2 max-h-80 overflow-auto">
          {metrics.length === 0 ? (
            <p className="text-xs text-muted-foreground">No metrics recorded yet</p>
          ) : (
            <ul className="space-y-1">
              {metrics.map((metric, index) => (
                <li key={index} className="text-xs border-b pb-1">
                  <div className="flex justify-between">
                    <span className="font-medium truncate" title={metric.name}>
                      {metric.name}
                    </span>
                    <span className={metric.duration > 100 ? 'text-red-500' : 'text-green-500'}>
                      {metric.duration.toFixed(2)}ms
                    </span>
                  </div>
                  <div className="text-muted-foreground text-[10px]">
                    {new Date(metric.timestamp).toLocaleTimeString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Higher-order component that wraps a component with performance monitoring
 * 
 * @param Component Component to wrap
 * @param componentName Name of the component for performance tracking
 */
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.FC<P> {
  const WithPerformance: React.FC<P> = (props) => {
    useComponentPerformance(componentName);
    return <Component {...props} />;
  };
  
  WithPerformance.displayName = `WithPerformance(${componentName})`;
  return WithPerformance;
}
