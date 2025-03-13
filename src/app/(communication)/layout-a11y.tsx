'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SkipLink } from '@/components/ui/a11y';

/**
 * Enhanced layout with accessibility improvements
 */
export default function CommunicationLayoutWithA11y({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SkipLink href="#main-content" />
      <MainLayout>
        <main id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </main>
      </MainLayout>
    </>
  );
}
