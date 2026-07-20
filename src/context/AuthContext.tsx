import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types.ts'
import { USERS } from '../data/users.ts'

interface AuthContextValue {
  user: User | null
  /** Inicia sesión resolviendo el rol desde los usuarios semilla. Devuelve el usuario. */
  login: (email: string) => User
  register: (name: string, email: string) => User
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function findByEmail(email: string): User | undefined {
  const target = email.trim().toLowerCase()
  return USERS.find((u) => u.email.toLowerCase() === target)
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // La app arranca sin sesión para poder demostrar el login de cliente y de admin.
  const [user, setUser] = useState<User | null>(null)

  function login(email: string): User {
    const existing = findByEmail(email)
    const resolved: User = existing ?? {
      id: Date.now(),
      name: email.split('@')[0] || 'Usuario',
      email,
      role: 'cliente',
      status: 'activo',
      joinedAt: todayISO(),
    }
    setUser(resolved)
    return resolved
  }

  function register(name: string, email: string): User {
    const resolved: User = {
      id: Date.now(),
      name,
      email,
      role: 'cliente',
      status: 'activo',
      joinedAt: todayISO(),
    }
    setUser(resolved)
    return resolved
  }

  function logout() {
    setUser(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login,
      register,
      logout,
      isAdmin: user?.role === 'admin',
    }),
    [user],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
