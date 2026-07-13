export type UserRole = 'cliente' | 'admin'
export type UserStatus = 'activo' | 'inactivo'

export interface Product {
  id: number
  name: string
  /** Precio rebajado al que se ofrece el producto próximo a vencer. */
  price: number
  /** Precio original antes del descuento por vencimiento. */
  originalPrice: number
  category: string
  description: string
  image: string
  /** Unidades disponibles en el inventario. */
  stock: number
  /** Fecha de vencimiento en formato ISO (yyyy-mm-dd). */
  expiryDate: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  /** Fecha de registro en formato ISO (yyyy-mm-dd). */
  joinedAt: string
}

export type OrderStatus = 'pendiente' | 'preparando' | 'entregado' | 'cancelado'

export interface OrderItem {
  productId: number
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: number
  customerName: string
  customerEmail: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  /** Fecha del pedido en formato ISO (yyyy-mm-dd). */
  date: string
}

export interface Offer {
  id: number
  title: string
  description: string
  /** Porcentaje de descuento aplicado (0-100). */
  discountPercent: number
  /** Categoría a la que aplica la oferta, o 'Todos'. */
  category: string
  active: boolean
  startDate: string
  endDate: string
}
