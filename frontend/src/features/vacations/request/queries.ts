import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Vacation } from '../shared/types'

export const myVacationsKey = ['vacations', 'mine'] as const

export function useMyVacations() {
  return useQuery({
    queryKey: myVacationsKey,
    queryFn: () => api<Vacation[]>('/vacations/mine'),
  })
}

export function useRequestVacation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: { startDate: string; endDate: string }) => api<Vacation>('/vacations', { method: 'POST', body }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vacations'] }),
  })
}
