import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Order, OrderStatus, Offer, Product, User, UserRole } from '../types.ts'
import * as api from '../lib/api.ts'
import { useAuth } from './AuthContext.tsx'

interface DataContextValue {
  products: Product[]
  addProduct: (data: Omit<Product, 'id'>) => Promise<void>
  updateProduct: (id: string, data: Omit<Product, 'id'>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>

  users: User[]
  addUser: (data: Omit<User, 'id'>, password: string) => Promise<void>
  updateUser: (id: string, data: Omit<User, 'id'>) => Promise<void>
  deleteUser: (id: string) => Promise<void>

  orders: Order[]
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>

  offers: Offer[]
  addOffer: (data: Omit<Offer, 'id'>) => Promise<void>
  updateOffer: (id: string, data: Omit<Offer, 'id'>) => Promise<void>
  deleteOffer: (id: string) => Promise<void>

  /** Carga inicial del catálogo público en curso. */
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

function message(e: unknown): string {
  return e instanceof Error ? e.message : 'Error inesperado'
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, isAdmin } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = useCallback(async () => {
    setProducts(await api.getProducts())
  }, [])
  const loadOffers = useCallback(async () => {
    setOffers(await api.getOffers())
  }, [])
  const loadUsers = useCallback(async () => {
    setUsers(await api.getUsers())
  }, [])
  const loadOrders = useCallback(async () => {
    setOrders(await api.getOrders())
  }, [])

  // Catálogo público: productos y ofertas (siempre).
  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([api.getProducts(), api.getOffers()])
      .then(([p, o]) => {
        if (!active) return
        setProducts(p)
        setOffers(o)
        setError(null)
      })
      .catch((e) => active && setError(message(e)))
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  // Datos privados del panel: usuarios y pedidos (solo admin autenticado).
  useEffect(() => {
    if (!isAdmin) {
      setUsers([])
      setOrders([])
      return
    }
    loadUsers().catch((e) => setError(message(e)))
    loadOrders().catch((e) => setError(message(e)))
  }, [isAdmin, user, loadUsers, loadOrders])

  const value = useMemo<DataContextValue>(
    () => ({
      products,
      addProduct: async (data) => {
        await api.createProduct(data)
        await loadProducts()
      },
      updateProduct: async (id, data) => {
        await api.updateProduct(id, data)
        await loadProducts()
      },
      deleteProduct: async (id) => {
        await api.deleteProduct(id)
        await loadProducts()
      },

      users,
      addUser: async (data, password) => {
        await api.register(data.name, data.email, password, data.role as UserRole)
        await loadUsers()
      },
      updateUser: async (id, data) => {
        await api.updateUser(id, {
          name: data.name,
          email: data.email,
          role: data.role,
          status: data.status,
        })
        await loadUsers()
      },
      deleteUser: async (id) => {
        await api.deleteUser(id)
        await loadUsers()
      },

      orders,
      updateOrderStatus: async (id, status) => {
        await api.updateOrderStatus(id, status)
        await loadOrders()
      },

      offers,
      addOffer: async (data) => {
        await api.createOffer(data)
        await loadOffers()
      },
      updateOffer: async (id, data) => {
        await api.updateOffer(id, data)
        await loadOffers()
      },
      deleteOffer: async (id) => {
        await api.deleteOffer(id)
        await loadOffers()
      },

      loading,
      error,
      refresh: async () => {
        await Promise.all([loadProducts(), loadOffers()])
        if (isAdmin) await Promise.all([loadUsers(), loadOrders()])
      },
    }),
    [products, users, orders, offers, loading, error, isAdmin, loadProducts, loadOffers, loadUsers, loadOrders],
  )

  return <DataContext value={value}>{children}</DataContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData debe usarse dentro de <DataProvider>')
  return ctx
}
