import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Order, OrderStatus, Offer, Product, User } from '../types.ts'
import { PRODUCTS } from '../data/products.ts'
import { USERS } from '../data/users.ts'
import { ORDERS } from '../data/orders.ts'
import { OFFERS } from '../data/offers.ts'

interface DataContextValue {
  products: Product[]
  addProduct: (data: Omit<Product, 'id'>) => void
  updateProduct: (id: number, data: Omit<Product, 'id'>) => void
  deleteProduct: (id: number) => void

  users: User[]
  addUser: (data: Omit<User, 'id'>) => void
  updateUser: (id: number, data: Omit<User, 'id'>) => void
  deleteUser: (id: number) => void

  orders: Order[]
  updateOrderStatus: (id: number, status: OrderStatus) => void

  offers: Offer[]
  addOffer: (data: Omit<Offer, 'id'>) => void
  updateOffer: (id: number, data: Omit<Offer, 'id'>) => void
  deleteOffer: (id: number) => void
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

const STORAGE_KEY = 'shop-admin-data'

interface Persisted {
  products: Product[]
  users: User[]
  orders: Order[]
  offers: Offer[]
}

function loadInitial(): Persisted {
  const seed: Persisted = {
    products: PRODUCTS,
    users: USERS,
    orders: ORDERS,
    offers: OFFERS,
  }
  if (typeof localStorage === 'undefined') return seed
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed
    const parsed = JSON.parse(raw) as Partial<Persisted>
    return {
      products: parsed.products ?? seed.products,
      users: parsed.users ?? seed.users,
      orders: parsed.orders ?? seed.orders,
      offers: parsed.offers ?? seed.offers,
    }
  } catch {
    return seed
  }
}

function nextId(items: { id: number }[]): number {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1
}

export function DataProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(loadInitial, [])
  const [products, setProducts] = useState<Product[]>(initial.products)
  const [users, setUsers] = useState<User[]>(initial.users)
  const [orders, setOrders] = useState<Order[]>(initial.orders)
  const [offers, setOffers] = useState<Offer[]>(initial.offers)

  useEffect(() => {
    const payload: Persisted = { products, users, orders, offers }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // Ignorar cuotas de almacenamiento o modo privado.
    }
  }, [products, users, orders, offers])

  const value = useMemo<DataContextValue>(
    () => ({
      products,
      addProduct: (data) =>
        setProducts((prev) => [...prev, { ...data, id: nextId(prev) }]),
      updateProduct: (id, data) =>
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...data, id } : p)),
        ),
      deleteProduct: (id) =>
        setProducts((prev) => prev.filter((p) => p.id !== id)),

      users,
      addUser: (data) =>
        setUsers((prev) => [...prev, { ...data, id: nextId(prev) }]),
      updateUser: (id, data) =>
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...data, id } : u))),
      deleteUser: (id) => setUsers((prev) => prev.filter((u) => u.id !== id)),

      orders,
      updateOrderStatus: (id, status) =>
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status } : o)),
        ),

      offers,
      addOffer: (data) =>
        setOffers((prev) => [...prev, { ...data, id: nextId(prev) }]),
      updateOffer: (id, data) =>
        setOffers((prev) =>
          prev.map((o) => (o.id === id ? { ...data, id } : o)),
        ),
      deleteOffer: (id) => setOffers((prev) => prev.filter((o) => o.id !== id)),
    }),
    [products, users, orders, offers],
  )

  return <DataContext value={value}>{children}</DataContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData debe usarse dentro de <DataProvider>')
  return ctx
}
