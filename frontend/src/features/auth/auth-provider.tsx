import { useQueryClient } from '@tanstack/react-query'
import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { api, getToken, onUnauthorized, setToken } from '@/lib/api'
import { AuthContext, type AuthStatus, type User } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>(() => (getToken() ? 'loading' : 'anonymous'))

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    setStatus('anonymous')
    queryClient.clear()
  }, [queryClient])

  // Restaura a sessão a partir do token salvo
  useEffect(() => {
    if (!getToken()) return
    api<User>('/auth/me')
      .then((me) => {
        setUser(me)
        setStatus('authenticated')
      })
      .catch(() => logout())
  }, [logout])

  useEffect(() => {
    onUnauthorized(logout)
    return () => onUnauthorized(null)
  }, [logout])

  const login = useCallback(async (email: string, password: string) => {
    const result = await api<{ accessToken: string; user: User }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    setToken(result.accessToken)
    setUser(result.user)
    setStatus('authenticated')
  }, [])

  const value = useMemo(() => ({ status, user, login, logout }), [status, user, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
