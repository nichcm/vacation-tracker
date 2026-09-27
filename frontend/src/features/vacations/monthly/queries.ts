import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Vacation } from '../shared/types'

type MonthlyResponse = { month: string; items: Vacation[] }

export function useMonthlyVacations(month: string) {
  return useQuery({
    queryKey: ['vacations', 'monthly', month],
    queryFn: () => api<MonthlyResponse>(`/vacations/monthly?month=${month}`),
  })
}
