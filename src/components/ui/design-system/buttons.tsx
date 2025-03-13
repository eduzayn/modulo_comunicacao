"use client";

import React from "react";
import { Button } from "../button";

const Buttons: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Button Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <h3 className="text-sm font-medium mb-3 text-neutral-500 dark:text-neutral-400">Primary</h3>
            <div className="space-y-2">
              <Button module="communication">Primary Button</Button>
              <Button module="communication" disabled>Disabled</Button>
            </div>
          </div>
          
          <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <h3 className="text-sm font-medium mb-3 text-neutral-500 dark:text-neutral-400">Secondary</h3>
            <div className="space-y-2">
              <Button module="communication" variant="secondary">Secondary Button</Button>
              <Button module="communication" variant="secondary" disabled>Disabled</Button>
            </div>
          </div>
          
          <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <h3 className="text-sm font-medium mb-3 text-neutral-500 dark:text-neutral-400">Outline</h3>
            <div className="space-y-2">
              <Button module="communication" variant="outline">Outline Button</Button>
              <Button module="communication" variant="outline" disabled>Disabled</Button>
            </div>
          </div>
          
          <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <h3 className="text-sm font-medium mb-3 text-neutral-500 dark:text-neutral-400">Ghost</h3>
            <div className="space-y-2">
              <Button module="communication" variant="ghost">Ghost Button</Button>
              <Button module="communication" variant="ghost" disabled>Disabled</Button>
            </div>
          </div>
          
          <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <h3 className="text-sm font-medium mb-3 text-neutral-500 dark:text-neutral-400">Link</h3>
            <div className="space-y-2">
              <Button module="communication" variant="link">Link Button</Button>
              <Button module="communication" variant="link" disabled>Disabled</Button>
            </div>
          </div>
          
          <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <h3 className="text-sm font-medium mb-3 text-neutral-500 dark:text-neutral-400">Destructive</h3>
            <div className="space-y-2">
              <Button module="communication" variant="destructive">Destructive Button</Button>
              <Button module="communication" variant="destructive" disabled>Disabled</Button>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Button Sizes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <h3 className="text-sm font-medium mb-3 text-neutral-500 dark:text-neutral-400">Small</h3>
            <Button module="communication" size="sm">Small Button</Button>
          </div>
          
          <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <h3 className="text-sm font-medium mb-3 text-neutral-500 dark:text-neutral-400">Default</h3>
            <Button module="communication">Default Button</Button>
          </div>
          
          <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <h3 className="text-sm font-medium mb-3 text-neutral-500 dark:text-neutral-400">Large</h3>
            <Button module="communication" size="lg">Large Button</Button>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Button with Icon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <h3 className="text-sm font-medium mb-3 text-neutral-500 dark:text-neutral-400">Icon Left</h3>
            <Button module="communication">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Item
            </Button>
          </div>
          
          <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <h3 className="text-sm font-medium mb-3 text-neutral-500 dark:text-neutral-400">Icon Right</h3>
            <Button module="communication">
              Next Step
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Button States</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <h3 className="text-sm font-medium mb-3 text-neutral-500 dark:text-neutral-400">Loading</h3>
            <Button module="communication" disabled>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </Button>
          </div>
          
          <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <h3 className="text-sm font-medium mb-3 text-neutral-500 dark:text-neutral-400">Success</h3>
            <Button module="communication" className="bg-green-500 hover:bg-green-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Success
            </Button>
          </div>
          
          <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <h3 className="text-sm font-medium mb-3 text-neutral-500 dark:text-neutral-400">Error</h3>
            <Button module="communication" variant="destructive">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Error
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buttons;
