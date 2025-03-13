'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAISettings, updateAISettingsAction } from '../app/actions/ai-actions';
import type { UpdateAISettingsInput } from '../types/ai';

export function useAISettings() {
  const queryClient = useQueryClient();
  
  const settingsQuery = useQuery({
    queryKey: ['ai-settings'],
    queryFn: fetchAISettings,
  });
  
  const updateSettingsMutation = useMutation({
    mutationFn: (data: UpdateAISettingsInput) => updateAISettingsAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-settings'] });
    },
  });
  
  return {
    settings: settingsQuery.data?.data,
    isLoading: settingsQuery.isLoading,
    isError: settingsQuery.isError,
    error: settingsQuery.error || settingsQuery.data?.error,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
  };
}
