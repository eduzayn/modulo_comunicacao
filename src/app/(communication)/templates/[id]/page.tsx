"use client";

/**
 * page.tsx
 * 
 * Description: Template detail page
 * 
 * @module app/(communication)/templates/[id]
 * @author Devin AI
 * @created 2025-03-12
 */
import React from 'react';
import { useTemplate } from '@/hooks/use-template';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Template detail page component
 * 
 * @param params - Page parameters
 * @returns Template detail page
 */
export default function TemplateDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { template, isLoading, error, updateTemplate, deleteTemplate } = useTemplate(id);

  if (isLoading) {
    return <div>Loading template...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!template) {
    return <div>Template not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Template Details</h1>
      
      <Card className="mb-4">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{template.name}</h2>
          <p className="mb-2"><strong>Channel Type:</strong> {template.channelType}</p>
          <p className="mb-2"><strong>Status:</strong> {template.status}</p>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Content</h3>
            <pre className="bg-gray-100 p-2 rounded">
              {template.content}
            </pre>
          </div>
          
          {template.variables && template.variables.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Variables</h3>
              <ul className="list-disc pl-5">
                {template.variables.map((variable, index) => (
                  <li key={index}>{variable}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-4 flex space-x-2">
            <Button
              variant="default"
              onClick={() => {
                // Handle edit
              }}
            >
              Edit Template
            </Button>
            
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm('Are you sure you want to delete this template?')) {
                  deleteTemplate();
                }
              }}
            >
              Delete Template
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
