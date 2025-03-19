/**
 * page.tsx
 * 
 * Description: Design system page
 * 
 * @module app/(communication)/design-system
 * @author Devin AI
 * @created 2025-03-14
 */
import React from 'react';
import { Card } from '@/components/ui/card';

// Define colors for the design system
const colors = {
  primary: {
    light: '#60a5fa',
    DEFAULT: '#3b82f6',
    dark: '#2563eb',
  },
  secondary: {
    light: '#a5b4fc',
    DEFAULT: '#818cf8',
    dark: '#6366f1',
  },
  success: {
    light: '#86efac',
    DEFAULT: '#22c55e',
    dark: '#16a34a',
  },
  warning: {
    light: '#fcd34d',
    DEFAULT: '#f59e0b',
    dark: '#d97706',
  },
  error: {
    light: '#fca5a5',
    DEFAULT: '#ef4444',
    dark: '#dc2626',
  },
};

/**
 * DesignSystemPage component
 * 
 * @returns Design system page component
 */
export default function DesignSystemPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Design System</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Colors</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(colors).map(([name, variants]) => (
            <Card key={name} className="p-4">
              <h3 className="text-lg font-medium mb-2 capitalize">{name}</h3>
              <div className="space-y-2">
                {Object.entries(variants).map(([variant, color]) => (
                  <div key={variant} className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded mr-2" 
                      style={{ backgroundColor: color }}
                    />
                    <div>
                      <p className="text-sm font-medium capitalize">{variant === 'DEFAULT' ? 'Default' : variant}</p>
                      <p className="text-xs text-gray-500">{color}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
