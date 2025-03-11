'use client';

import React, { useEffect, useState } from 'react';
import ApiDocumentation from '@/components/api-docs/swagger-ui';

/**
 * API Documentation page
 */
export default function ApiDocsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
      <ApiDocumentation specUrl="/api/docs" />
    </div>
  );
}
