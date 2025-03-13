'use client';

import React from 'react';
import { useTemplates } from '@/hooks/use-templates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Template } from '@/types/templates';
import { useRouter } from 'next/navigation';

interface TemplateListProps {
  onSelectTemplate?: (template: Template) => void;
  templateType?: string;
}

export function TemplateList({ onSelectTemplate, templateType }: TemplateListProps) {
  const { templates, isLoading, isError, refetch } = useTemplates(templateType);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 bg-muted rounded-md animate-pulse" />
        <div className="h-24 bg-muted rounded-md animate-pulse" />
        <div className="h-24 bg-muted rounded-md animate-pulse" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
        <p>Failed to load templates</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="p-4 border border-gray-200 bg-gray-50 rounded-md text-gray-500">
        <p>No templates found</p>
        <Button 
          onClick={() => router.push('/templates/new')} 
          className="mt-2"
        >
          Create Template
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {templates.map((template) => (
        <Card 
          key={template.id} 
          className="hover:shadow-md transition-shadow"
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <Badge variant={getStatusVariant(template.status)}>
                {template.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              <p>Type: {template.type}</p>
              <p className="mt-2 line-clamp-2">{template.content}</p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onSelectTemplate?.(template)}
              >
                Preview
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => router.push(`/templates/${template.id}`)}
              >
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'active':
      return 'default';
    case 'draft':
      return 'outline';
    case 'archived':
      return 'secondary';
    default:
      return 'default';
  }
}
