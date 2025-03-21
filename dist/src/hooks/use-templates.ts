/**
 * use-templates.ts
 * 
 * Description: Hook for managing templates
 * 
 * @module hooks/use-templates
 * @author Devin AI
 * @created 2025-03-12
 */
import { useState, useEffect } from 'react';
import { getTemplates, getTemplateById, createTemplate, editTemplate, deleteTemplate } from '@/app/actions/template-actions';
import type { Template, CreateTemplateInput, UpdateTemplateInput } from '@/types/templates';

/**
 * Hook for managing templates
 * 
 * @returns Templates state and methods
 */
export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch templates
   */
  const fetchAllTemplates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getTemplates();
      
      if (result.error) {
        setError(result.error);
      } else {
        setTemplates(result.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch template by ID
   * 
   * @param id - Template ID
   */
  const fetchTemplateById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getTemplateById(id);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSelectedTemplate(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Add template
   * 
   * @param data - Template data to create
   */
  const addTemplate = async (data: CreateTemplateInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await createTemplate(data);
      
      if (result.error) {
        setError(result.error);
      } else {
        setTemplates(prev => [...prev, result.data as Template]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Edit template
   * 
   * @param id - Template ID
   * @param data - Template data to update
   */
  const updateTemplate = async (id: string, data: UpdateTemplateInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await editTemplate(id, data);
      
      if (result.error) {
        setError(result.error);
      } else {
        setTemplates(prev => prev.map(template => template.id === id ? result.data as Template : template));
        if (selectedTemplate && selectedTemplate.id === id) {
          setSelectedTemplate(result.data);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Remove template
   * 
   * @param id - Template ID
   */
  const removeTemplate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await deleteTemplate(id);
      
      if (!result.success) {
        setError(result.error || 'Failed to delete template');
      } else {
        setTemplates(prev => prev.filter(template => template.id !== id));
        if (selectedTemplate && selectedTemplate.id === id) {
          setSelectedTemplate(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch templates on mount
  useEffect(() => {
    fetchAllTemplates();
  }, []);

  return {
    templates,
    selectedTemplate,
    isLoading,
    error,
    fetchTemplates: fetchAllTemplates,
    fetchTemplateById,
    addTemplate,
    updateTemplate,
    removeTemplate,
    refreshTemplates: fetchAllTemplates,
  };
}

export default useTemplates;
