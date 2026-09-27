import { createContext, useContext } from 'react'

export type UserRole = 'EMPLOYEE' | 'MANAGER'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
}

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

export type AuthContextValue = {
  status: AuthStatus
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return context
}
