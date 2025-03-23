'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTemplates, getTemplate, createTemplate, updateTemplate } from '../actions/template-actions';
import type { Template } from '../../src/modules/communication/types';

export function useTemplates() {
  const queryClient = useQueryClient();
  
  const templatesQuery = useQuery({
    queryKey: ['templates'],
    queryFn: getTemplates,
  });
  
  const createTemplateMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
  
  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateTemplate(id, data),
    onSuccess: (data) => {
      if (data.success && data.data) {
        queryClient.setQueryData(['templates', data.data.id], data.data);
        queryClient.invalidateQueries({ queryKey: ['templates'] });
      }
    },
  });
  
  return {
    templates: templatesQuery.data || [],
    isLoading: templatesQuery.isLoading,
    isError: templatesQuery.isError,
    error: templatesQuery.error,
    createTemplate: createTemplateMutation.mutate,
    updateTemplate: updateTemplateMutation.mutate,
    isCreating: createTemplateMutation.isLoading,
    isUpdating: updateTemplateMutation.isLoading,
  };
}

export function useTemplate(id: string) {
  const queryClient = useQueryClient();
  
  const templateQuery = useQuery({
    queryKey: ['templates', id],
    queryFn: () => getTemplate(id),
    enabled: !!id,
  });
  
  const updateTemplateMutation = useMutation({
    mutationFn: (data: any) => updateTemplate(id, data),
    onSuccess: (data) => {
      if (data.success && data.data) {
        queryClient.setQueryData(['templates', id], data.data);
        queryClient.invalidateQueries({ queryKey: ['templates'] });
      }
    },
  });
  
  return {
    template: templateQuery.data,
    isLoading: templateQuery.isLoading,
    isError: templateQuery.isError,
    error: templateQuery.error,
    updateTemplate: updateTemplateMutation.mutate,
    isUpdating: updateTemplateMutation.isLoading,
  };
}
