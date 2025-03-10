'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Template } from '@/src/modules/communication/types';
import type { 
  CreateTemplateInput, 
  UpdateTemplateInput,
  GetTemplatesInput
} from '@/src/modules/communication/types/templates';

export function useTemplates(params?: GetTemplatesInput) {
  const queryClient = useQueryClient();
  
  const queryString = params 
    ? `?${Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join('&')}`
    : '';
  
  const templatesQuery = useQuery({
    queryKey: ['templates', params],
    queryFn: async () => {
      const response = await fetch(`/api/communication/templates${queryString}`);
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      return response.json() as Promise<Template[]>;
    },
  });
  
  const createTemplateMutation = useMutation({
    mutationFn: async (data: CreateTemplateInput) => {
      const response = await fetch('/api/communication/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create template');
      }
      
      return response.json() as Promise<Template>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
  
  return {
    templates: templatesQuery.data || [],
    isLoading: templatesQuery.isLoading,
    isError: templatesQuery.isError,
    error: templatesQuery.error,
    createTemplate: createTemplateMutation.mutate,
    isCreating: createTemplateMutation.isPending,
  };
}

export function useTemplate(id: string) {
  const queryClient = useQueryClient();
  
  const templateQuery = useQuery({
    queryKey: ['template', id],
    queryFn: async () => {
      const response = await fetch(`/api/communication/templates/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch template');
      }
      return response.json() as Promise<Template>;
    },
    enabled: !!id,
  });
  
  const updateTemplateMutation = useMutation({
    mutationFn: async (data: UpdateTemplateInput) => {
      const response = await fetch(`/api/communication/templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update template');
      }
      
      return response.json() as Promise<Template>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['template', id], data);
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
  
  return {
    template: templateQuery.data,
    isLoading: templateQuery.isLoading,
    isError: templateQuery.isError,
    error: templateQuery.error,
    updateTemplate: updateTemplateMutation.mutate,
    isUpdating: updateTemplateMutation.isPending,
  };
}
