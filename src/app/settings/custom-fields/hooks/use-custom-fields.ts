import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCustomField,
  deleteCustomField,
  getCustomFields,
  updateCustomField,
} from '../services/custom-fields'
import type { CreateCustomFieldFormData } from '../schemas'

export function useCustomFields() {
  return useQuery({
    queryKey: ['custom-fields'],
    queryFn: getCustomFields,
  })
}

export function useCreateCustomField() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCustomField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] })
    },
  })
}

export function useUpdateCustomField() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCustomFieldFormData> }) =>
      updateCustomField(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] })
    },
  })
}

export function useDeleteCustomField() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCustomField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] })
    },
  })
} 