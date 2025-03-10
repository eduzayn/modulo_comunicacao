'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AISettings } from '@/src/types';
import type { UpdateAISettingsInput } from '@/src/types/ai';

export function useAISettings() {
  const queryClient = useQueryClient();
  
  const aiSettingsQuery = useQuery({
    queryKey: ['aiSettings'],
    queryFn: async () => {
      const response = await fetch('/api/communication/ai/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch AI settings');
      }
      return response.json() as Promise<AISettings>;
    },
  });
  
  const updateAISettingsMutation = useMutation({
    mutationFn: async (data: UpdateAISettingsInput) => {
      const response = await fetch('/api/communication/ai/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update AI settings');
      }
      
      return response.json() as Promise<AISettings>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['aiSettings'], data);
    },
  });
  
  return {
    settings: aiSettingsQuery.data,
    isLoading: aiSettingsQuery.isLoading,
    isError: aiSettingsQuery.isError,
    error: aiSettingsQuery.error,
    updateSettings: updateAISettingsMutation.mutate,
    isUpdating: updateAISettingsMutation.isPending,
  };
}
