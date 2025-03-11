import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AccessibilityExamples } from '@/components/ui/a11y-examples';
import { SkipLink } from '@/components/ui/a11y-improvements';

export const metadata = {
  title: 'Acessibilidade | Edunéxia Comunicação',
  description: 'Exemplos de recursos de acessibilidade do sistema de comunicação da Edunéxia',
};

export default function AccessibilityPage() {
  return (
    <>
      <SkipLink href="#main-content" />
      <PageLayout
        title="Acessibilidade"
        description="Exemplos de recursos de acessibilidade implementados no sistema"
      >
        <main id="main-content" tabIndex={-1} className="outline-none">
          <AccessibilityExamples />
        </main>
      </PageLayout>
    </>
  );
}
