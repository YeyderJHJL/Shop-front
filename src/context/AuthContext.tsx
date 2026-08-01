import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types.ts'
import * as api from '../lib/api.ts'

interface AuthContextValue {
  user: User | null
  /** Verdadero mientras se rehidrata la sesión guardada al cargar la app. */
  loading: boolean
  /** Inicia sesión contra el backend. Devuelve el usuario o lanza ApiError. */
  login: (email: string, password: string) => Promise<User>
  /** Registra un cliente y deja la sesión iniciada. */
  register: (name: string, email: string, password: string) => Promise<User>
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const USER_KEY = 'shop-user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Rehidratar la sesión desde localStorage si hay token + usuario guardados.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      if (raw && api.getToken()) setUser(JSON.parse(raw) as User)
    } catch {
      /* datos corruptos: se ignora */
    }
    setLoading(false)
  }, [])

  function persist(u: User) {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(u))
    } catch {
      /* almacenamiento no disponible */
    }
  }

  async function login(email: string, password: string): Promise<User> {
    const { token, user: resolved } = await api.login(email, password)
    api.setToken(token)
    persist(resolved)
    setUser(resolved)
    return resolved
  }

  async function register(name: string, email: string, password: string): Promise<User> {
    await api.register(name, email, password)
    // El registro no devuelve token: iniciamos sesión para obtenerlo.
    return login(email, password)
  }

  function logout() {
    api.clearToken()
    try {
      localStorage.removeItem(USER_KEY)
    } catch {
      /* ignore */
    }
    setUser(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAdmin: user?.role === 'admin',
    }),
    [user, loading],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
