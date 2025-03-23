/**
 * use-ai-settings.ts
 * 
 * Description: Hook for managing AI settings
 * 
 * @module hooks/use-ai-settings
 * @author Devin AI
 * @created 2025-03-12
 */
import { useState, useEffect } from 'react';
import { fetchAISettings, updateAISettings } from '@/app/actions/ai-actions';
import type { AISettings, UpdateAISettingsInput } from '@/types/ai';

/**
 * Hook for managing AI settings
 * 
 * @returns AI settings state and methods
 */
export function useAISettings() {
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch AI settings
   */
  const getSettings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchAISettings();
      
      if (result.error) {
        setError(result.error);
      } else {
        setSettings(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update AI settings
   * 
   * @param data - AI settings data to update
   */
  const updateSettings = async (data: UpdateAISettingsInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await updateAISettings(data);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSettings(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch settings on mount
  useEffect(() => {
    getSettings();
  }, []);

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    refreshSettings: getSettings,
  };
}

export default useAISettings;
