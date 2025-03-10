'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchTemplates, 
  fetchTemplateById, 
  addTemplate, 
  editTemplate, 
  removeTemplate 
} from '../app/actions/template-actions';
import type { Template } from '../types';
import type { 
  CreateTemplateInput, 
  UpdateTemplateInput,
  GetTemplatesInput
} from '../types/templates';

export function useTemplates(params?: GetTemplatesInput) {
  const queryClient = useQueryClient();
  
  const templatesQuery = useQuery({
    queryKey: ['templates', params],
    queryFn: () => fetchTemplates(params),
  });
  
  const createTemplateMutation = useMutation({
    mutationFn: (data: CreateTemplateInput) => addTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
  
  const deleteTemplateMutation = useMutation({
    mutationFn: (id: string) => removeTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    }
  });
  
  return {
    templates: templatesQuery.data?.data || [],
    isLoading: templatesQuery.isLoading,
    isError: templatesQuery.isError,
    error: templatesQuery.error || templatesQuery.data?.error,
    createTemplate: createTemplateMutation.mutate,
    deleteTemplate: deleteTemplateMutation.mutate,
    isCreating: createTemplateMutation.isPending,
    isDeleting: deleteTemplateMutation.isPending
  };
}

export function useTemplate(id: string) {
  const queryClient = useQueryClient();
  
  const templateQuery = useQuery({
    queryKey: ['template', id],
    queryFn: () => fetchTemplateById(id),
    enabled: !!id,
  });
  
  const updateTemplateMutation = useMutation({
    mutationFn: (data: UpdateTemplateInput) => editTemplate(id, data),
    onSuccess: (result) => {
      if (result.data) {
        queryClient.setQueryData(['template', id], result.data);
        queryClient.invalidateQueries({ queryKey: ['templates'] });
      }
    },
  });
  
  return {
    template: templateQuery.data?.data,
    isLoading: templateQuery.isLoading,
    isError: templateQuery.isError,
    error: templateQuery.error || templateQuery.data?.error,
    updateTemplate: updateTemplateMutation.mutate,
    isUpdating: updateTemplateMutation.isPending,
  };
}
