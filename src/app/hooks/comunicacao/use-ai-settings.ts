'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAISettings, updateAISettings } from '../actions/ai-actions';
import type { AISettings } from '../../src/modules/communication/types';

export function useAISettings() {
  const queryClient = useQueryClient();
  
  const settingsQuery = useQuery({
    queryKey: ['ai-settings'],
    queryFn: getAISettings,
  });
  
  const updateSettingsMutation = useMutation({
    mutationFn: updateAISettings,
    onSuccess: (data) => {
      if (data.success && data.data) {
        queryClient.setQueryData(['ai-settings'], data.data);
      }
    },
  });
  
  return {
    settings: settingsQuery.data,
    isLoading: settingsQuery.isLoading,
    isError: settingsQuery.isError,
    error: settingsQuery.error,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isLoading,
  };
}
