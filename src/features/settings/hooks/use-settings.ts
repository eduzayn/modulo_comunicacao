/**
 * Hook para gerenciar as configurações gerais e categorias específicas
 */

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as settingsService from '../services/settings-service'

/**
 * Hook para gerenciar bots
 */
export function useBots() {
  const queryClient = useQueryClient()

  const {
    data: bots = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['bots'],
    queryFn: settingsService.getBots
  })

  const { mutate: toggleBotStatus, isPending: isTogglingBot } = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => 
      settingsService.toggleBot(id, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] })
    }
  })

  const { mutate: createBot, isPending: isCreatingBot } = useMutation({
    mutationFn: settingsService.createBot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] })
    }
  })

  return {
    bots,
    isLoading,
    error,
    toggleBotStatus,
    isTogglingBot,
    createBot,
    isCreatingBot
  }
}

/**
 * Hook para gerenciar automações
 */
export function useAutomations() {
  const queryClient = useQueryClient()

  const {
    data: automations = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['automations'],
    queryFn: settingsService.getAutomations
  })

  const { mutate: toggleAutomationStatus, isPending: isTogglingAutomation } = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => 
      settingsService.toggleAutomation(id, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] })
    }
  })

  const { mutate: createAutomation, isPending: isCreatingAutomation } = useMutation({
    mutationFn: settingsService.createAutomation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] })
    }
  })

  return {
    automations,
    isLoading,
    error,
    toggleAutomationStatus,
    isTogglingAutomation,
    createAutomation,
    isCreatingAutomation
  }
}

/**
 * Hook para gerenciar canais (relacionados à caixa de entrada)
 */
export function useChannels() {
  const queryClient = useQueryClient()

  const {
    data: channels = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['channels'],
    queryFn: settingsService.getChannels
  })

  return {
    channels,
    isLoading,
    error
  }
}

/**
 * Hook para gerenciar pipelines (relacionados ao CRM)
 */
export function usePipelines() {
  const queryClient = useQueryClient()

  const {
    data: pipelines = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['pipelines'],
    queryFn: settingsService.getPipelines
  })

  const { mutate: createPipeline, isPending: isCreatingPipeline } = useMutation({
    mutationFn: settingsService.createPipeline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipelines'] })
    }
  })

  return {
    pipelines,
    isLoading,
    error,
    createPipeline,
    isCreatingPipeline
  }
} 