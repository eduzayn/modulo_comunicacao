import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  CreateKnowledgeBaseFormData,
  KnowledgeBase,
  KnowledgeBaseSearchOptions,
  UpdateKnowledgeBaseFormData,
} from '../types'
import {
  createKnowledgeBase,
  deleteKnowledgeBase,
  getKnowledgeBase,
  getTrainingStatus,
  searchKnowledgeBase,
  trainKnowledgeBase,
  updateKnowledgeBase,
} from '../services/knowledge-base'

const KNOWLEDGE_BASE_QUERY_KEY = 'knowledge-base'

export function useKnowledgeBase(id: string) {
  return useQuery({
    queryKey: [KNOWLEDGE_BASE_QUERY_KEY, id],
    queryFn: () => getKnowledgeBase(id),
  })
}

export function useKnowledgeBaseList(params: KnowledgeBaseSearchOptions) {
  return useQuery({
    queryKey: [KNOWLEDGE_BASE_QUERY_KEY, 'list', params],
    queryFn: () => searchKnowledgeBase(params),
  })
}

export function useCreateKnowledgeBase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateKnowledgeBaseFormData) => createKnowledgeBase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KNOWLEDGE_BASE_QUERY_KEY] })
      toast.success('Base de conhecimento criada com sucesso')
    },
    onError: () => {
      toast.error('Erro ao criar base de conhecimento')
    },
  })
}

export function useUpdateKnowledgeBase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateKnowledgeBaseFormData) => updateKnowledgeBase(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [KNOWLEDGE_BASE_QUERY_KEY, variables.id],
      })
      toast.success('Base de conhecimento atualizada com sucesso')
    },
    onError: () => {
      toast.error('Erro ao atualizar base de conhecimento')
    },
  })
}

export function useDeleteKnowledgeBase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteKnowledgeBase(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [KNOWLEDGE_BASE_QUERY_KEY] })
      queryClient.removeQueries({
        queryKey: [KNOWLEDGE_BASE_QUERY_KEY, id],
      })
      toast.success('Base de conhecimento excluída com sucesso')
    },
    onError: () => {
      toast.error('Erro ao excluir base de conhecimento')
    },
  })
}

export function useTrainKnowledgeBase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => trainKnowledgeBase(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: [KNOWLEDGE_BASE_QUERY_KEY, id],
      })
      toast.success('Treinamento iniciado com sucesso')
    },
    onError: () => {
      toast.error('Erro ao iniciar treinamento')
    },
  })
}

export function useTrainingStatus(id: string) {
  return useQuery({
    queryKey: [KNOWLEDGE_BASE_QUERY_KEY, id, 'training-status'],
    queryFn: () => getTrainingStatus(id),
    refetchInterval: (data) => {
      if (!data) return false
      if (!data.data?.success) return false
      return data.data.data.status === 'processing' ? 5000 : false
    },
  })
} 