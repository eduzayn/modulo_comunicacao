'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
// FocusTrap is imported but not used in this file, so we'll comment it out
// import { FocusTrap } from '@headlessui/react';

/**
 * Component showcasing various accessibility examples
 */
export function AccessibilityExamples() {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Keyboard Navigation Example</CardTitle>
        </CardHeader>
        <CardContent>
          <div role="tablist" className="flex space-x-2 border-b">
            <button
              role="tab"
              aria-selected={activeTab === 0}
              aria-controls="panel-1"
              id="tab-1"
              className={`px-4 py-2 ${activeTab === 0 ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab(0)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                  setActiveTab(1);
                  document.getElementById('tab-2')?.focus();
                }
              }}
            >
              Tab 1
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 1}
              aria-controls="panel-2"
              id="tab-2"
              className={`px-4 py-2 ${activeTab === 1 ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab(1)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') {
                  setActiveTab(0);
                  document.getElementById('tab-1')?.focus();
                }
              }}
            >
              Tab 2
            </button>
          </div>
          
          <div className="mt-4">
            <div
              role="tabpanel"
              id="panel-1"
              aria-labelledby="tab-1"
              hidden={activeTab !== 0}
            >
              <p>This is the content for Tab 1.</p>
              <p>Use arrow keys to navigate between tabs.</p>
            </div>
            <div
              role="tabpanel"
              id="panel-2"
              aria-labelledby="tab-2"
              hidden={activeTab !== 1}
            >
              <p>This is the content for Tab 2.</p>
              <p>This example demonstrates keyboard navigation.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Screen Reader Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              Click the button below to trigger a screen reader announcement.
            </p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => {
                // Create or get the live region
                let liveRegion = document.getElementById('sr-announcement');
                if (!liveRegion) {
                  liveRegion = document.createElement('div');
                  liveRegion.id = 'sr-announcement';
                  liveRegion.setAttribute('aria-live', 'polite');
                  liveRegion.className = 'sr-only';
                  document.body.appendChild(liveRegion);
                }
                
                // Clear and set the announcement
                liveRegion.textContent = '';
                setTimeout(() => {
                  liveRegion.textContent = 'This message was announced to screen readers.';
                }, 100);
              }}
            >
              Announce to Screen Readers
            </button>
            <div id="sr-announcement" aria-live="polite" className="sr-only"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
