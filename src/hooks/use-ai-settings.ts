'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAISettings, updateAISettingsAction } from '../app/actions/ai-actions';
import type { AISettings } from '../types';
import type { UpdateAISettingsInput } from '../types/ai';

export function useAISettings() {
  const queryClient = useQueryClient();
  
  const aiSettingsQuery = useQuery({
    queryKey: ['aiSettings'],
    queryFn: () => fetchAISettings(),
  });
  
  const updateAISettingsMutation = useMutation({
    mutationFn: (data: UpdateAISettingsInput) => updateAISettingsAction(data),
    onSuccess: (result) => {
      if (result.data) {
        queryClient.setQueryData(['aiSettings'], result.data);
      }
    },
  });
  
  return {
    settings: aiSettingsQuery.data?.data,
    isLoading: aiSettingsQuery.isLoading,
    isError: aiSettingsQuery.isError,
    error: aiSettingsQuery.error || aiSettingsQuery.data?.error,
    updateSettings: updateAISettingsMutation.mutate,
    isUpdating: updateAISettingsMutation.isPending,
  };
}
