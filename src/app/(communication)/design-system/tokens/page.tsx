import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { DesignTokens } from '@/components/ui/design-system/design-tokens';

export const metadata = {
  title: 'Design Tokens | Edunéxia Comunicação',
  description: 'Tokens de design do sistema de comunicação da Edunéxia',
};

export default function DesignTokensPage() {
  return (
    <PageLayout
      title="Design Tokens"
      description="Tokens de design do sistema de comunicação da Edunéxia"
    >
      <DesignTokens />
    </PageLayout>
  );
}
