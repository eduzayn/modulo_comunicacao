"use client";

/**
 * use-template.ts
 * 
 * Description: Hook for managing a single template
 * 
 * @module hooks/use-template
 * @author Devin AI
 * @created 2025-03-12
 */
import { useState, useEffect } from 'react';
import { getTemplateById, editTemplate, deleteTemplate } from '@/app/actions/template-actions';
import type { Template, UpdateTemplateInput } from '@/types/templates';

/**
 * Hook for managing a single template
 * 
 * @param id - Template ID
 * @returns Template state and methods
 */
export function useTemplate(id: string) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch template
   */
  const fetchTemplate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getTemplateById(id);
      
      if (result.error) {
        setError(result.error);
      } else {
        setTemplate(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update template
   * 
   * @param data - Template data to update
   */
  const updateTemplateData = async (data: UpdateTemplateInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await editTemplate(id, data);
      
      if (result.error) {
        setError(result.error);
      } else {
        setTemplate(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete template
   */
  const deleteTemplateData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await deleteTemplate(id);
      
      if (!result.success) {
        setError(result.error || 'Failed to delete template');
      } else {
        setTemplate(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch template on mount or when ID changes
  useEffect(() => {
    if (id) {
      fetchTemplate();
    }
  }, [id]);

  return {
    template,
    isLoading,
    error,
    fetchTemplate,
    updateTemplate: updateTemplateData,
    deleteTemplate: deleteTemplateData,
  };
}

export default useTemplate;
