import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UserRole } from '@/features/auth/auth-context'
import { api } from '@/lib/api'

export type ManagedUser = {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

export type CreateUserInput = {
  name: string
  email: string
  password: string
  role: UserRole
}

const usersKey = ['users'] as const

export function useUsers() {
  return useQuery({
    queryKey: usersKey,
    queryFn: () => api<ManagedUser[]>('/users'),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateUserInput) => api<ManagedUser>('/users', { method: 'POST', body }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersKey }),
  })
}
