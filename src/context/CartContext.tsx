import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { CartItem, Product } from '../types.ts'

interface CartContextValue {
  items: CartItem[]
  count: number
  subtotal: number
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  function addToCart(product: Product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }

  function removeFromCart(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity < 1) return
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    )
  }

  function clearCart() {
    setItems([])
  }

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )
    return {
      items,
      count,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }
  }, [items])

  return <CartContext value={value}>{children}</CartContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
