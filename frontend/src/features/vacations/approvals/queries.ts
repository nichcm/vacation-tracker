import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Vacation } from '../shared/types'

export const pendingVacationsKey = ['vacations', 'pending'] as const

export function usePendingVacations(enabled = true) {
  return useQuery({
    queryKey: pendingVacationsKey,
    queryFn: () => api<Vacation[]>('/vacations/pending'),
    enabled,
  })
}

export function useApproveVacation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api<Vacation>(`/vacations/${id}/approve`, { method: 'PATCH' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vacations'] }),
  })
}

export function useRejectVacation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      api<Vacation>(`/vacations/${id}/reject`, { method: 'PATCH', body: { reason } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vacations'] }),
  })
}
