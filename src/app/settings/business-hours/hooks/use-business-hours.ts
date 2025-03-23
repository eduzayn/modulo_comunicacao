import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type CreateBusinessHoursFormData } from '../types'
import {
  createBusinessHours,
  getBusinessHours,
  deleteBusinessHours,
} from '../services/business-hours'
import { type BusinessHours } from '../types'

export function useCreateBusinessHours() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBusinessHours,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessHours'] })
    },
  })
}

export function useBusinessHours() {
  return useQuery<BusinessHours[]>({
    queryKey: ['businessHours'],
    queryFn: getBusinessHours,
  })
}

export function useDeleteBusinessHours() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBusinessHours,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessHours'] })
    },
  })
} 