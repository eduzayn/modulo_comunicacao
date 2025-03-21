import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createGroup, deleteGroup, getGroups, updateGroup } from '../services/groups'
import type { CreateGroupFormData } from '../schemas'

export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: getGroups
  })
}

export function useCreateGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    }
  })
}

export function useUpdateGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateGroupFormData> }) =>
      updateGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    }
  })
}

export function useDeleteGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    }
  })
} 