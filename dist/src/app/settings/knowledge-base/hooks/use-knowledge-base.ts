import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  CreateKnowledgeBaseFormData,
  KnowledgeBase,
  KnowledgeBaseSearchOptions,
  UpdateKnowledgeBaseFormData,
  KnowledgeBaseContent,
} from '../types'
import * as knowledgeBaseService from '@/services/supabase/knowledge-base'

const QUERY_KEY = 'knowledge-base'

export function useKnowledgeBase(id?: string) {
  const queryClient = useQueryClient()

  const { data: knowledgeBase, isLoading } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => knowledgeBaseService.getKnowledgeBase(id!),
    enabled: !!id,
  })

  const { data: knowledgeBases, isLoading: isLoadingList } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => knowledgeBaseService.listKnowledgeBases(),
  })

  const createMutation = useMutation({
    mutationFn: (data: Omit<KnowledgeBase, 'id'>) => knowledgeBaseService.createKnowledgeBase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Base de conhecimento criada com sucesso')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<KnowledgeBase> }) =>
      knowledgeBaseService.updateKnowledgeBase(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Base de conhecimento atualizada com sucesso')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => knowledgeBaseService.deleteKnowledgeBase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Base de conhecimento excluída com sucesso')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const addContentMutation = useMutation({
    mutationFn: ({ knowledgeBaseId, content }: { knowledgeBaseId: string; content: Omit<KnowledgeBaseContent, 'id'> }) =>
      knowledgeBaseService.addContent(knowledgeBaseId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Conteúdo adicionado com sucesso')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const updateContentMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: Partial<KnowledgeBaseContent> }) =>
      knowledgeBaseService.updateContent(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Conteúdo atualizado com sucesso')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const deleteContentMutation = useMutation({
    mutationFn: (id: string) => knowledgeBaseService.deleteContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Conteúdo excluído com sucesso')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  return {
    knowledgeBase,
    knowledgeBases,
    isLoading,
    isLoadingList,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    addContent: addContentMutation.mutate,
    updateContent: updateContentMutation.mutate,
    deleteContent: deleteContentMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isAddingContent: addContentMutation.isPending,
    isUpdatingContent: updateContentMutation.isPending,
    isDeletingContent: deleteContentMutation.isPending,
  }
}

export function useKnowledgeBaseList(params: KnowledgeBaseSearchOptions) {
  return useQuery({
    queryKey: [QUERY_KEY, 'list', params],
    queryFn: () => searchKnowledgeBase(params),
  })
}

export function useTrainKnowledgeBase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => trainKnowledgeBase(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY, id],
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
    queryKey: [QUERY_KEY, id, 'training-status'],
    queryFn: () => getTrainingStatus(id),
    refetchInterval: (data) => {
      if (!data) return false
      if (!data.data?.success) return false
      return data.data.data.status === 'processing' ? 5000 : false
    },
  })
} 