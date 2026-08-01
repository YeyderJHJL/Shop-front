import type {
  Order,
  OrderStatus,
  Offer,
  Product,
  User,
  UserRole,
  UserStatus,
} from '../types.ts'

/**
 * Capa de acceso a la API del backend (Shop-back).
 * La URL base se puede sobreescribir con VITE_API_URL; por defecto apunta al
 * servidor de desarrollo en http://localhost:3000/api.
 */
const API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000/api'

const TOKEN_KEY = 'shop-token'

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    /* almacenamiento no disponible */
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* almacenamiento no disponible */
  }
}

/** Error de API con el mensaje devuelto por el backend y el código HTTP. */
export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }
  if (token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers })
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. ¿Está encendido el backend?', 0)
  }

  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Error ${res.status}`
    throw new ApiError(typeof message === 'string' ? message : `Error ${res.status}`, res.status)
  }
  return data as T
}

// --------------------------------------------------------------------------
// Mapeos entre los DTO del backend y los tipos del frontend
// --------------------------------------------------------------------------

function toDateInput(iso: string | null | undefined): string {
  return iso ? String(iso).slice(0, 10) : ''
}

const STATUS_FE_TO_BE: Record<OrderStatus, string> = {
  pendiente: 'PENDING',
  preparando: 'PREPARING',
  entregado: 'COMPLETED',
  cancelado: 'CANCELLED',
}
const STATUS_BE_TO_FE: Record<string, OrderStatus> = {
  PENDING: 'pendiente',
  PREPARING: 'preparando',
  COMPLETED: 'entregado',
  CANCELLED: 'cancelado',
}

function roleToFe(role: string): UserRole {
  return role === 'ADMIN' ? 'admin' : 'cliente'
}
function roleToBe(role: UserRole): string {
  return role === 'admin' ? 'ADMIN' : 'CLIENT'
}
function statusToFe(status: string | undefined): UserStatus {
  return status === 'INACTIVE' ? 'inactivo' : 'activo'
}
function statusToBe(status: UserStatus): string {
  return status === 'inactivo' ? 'INACTIVE' : 'ACTIVE'
}

interface ProductDTO {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  category: string | null
  originalPrice: number
  currentPrice: number
  stock: number
  expirationDate: string | null
}

function mapProduct(p: ProductDTO): Product {
  return {
    id: p.id,
    name: p.name,
    price: p.currentPrice,
    originalPrice: p.originalPrice,
    category: p.category ?? 'General',
    description: p.description ?? '',
    image: p.imageUrl ?? '',
    stock: p.stock,
    expiryDate: toDateInput(p.expirationDate),
  }
}

function productPayload(data: Omit<Product, 'id'>) {
  return {
    name: data.name,
    description: data.description,
    imageUrl: data.image,
    category: data.category,
    originalPrice: data.originalPrice,
    currentPrice: data.price,
    stock: data.stock,
    expirationDate: data.expiryDate || null,
  }
}

interface UserDTO {
  id: string
  name: string
  email: string
  role: string
  status?: string
  createdAt: string
}

function mapUser(u: UserDTO): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: roleToFe(u.role),
    status: statusToFe(u.status),
    joinedAt: toDateInput(u.createdAt),
  }
}

interface OrderItemDTO {
  productId: string
  quantity: number
  priceAtPurchase: number
  product?: { name: string } | null
}
interface OrderDTO {
  id: string
  totalAmount: number
  status: string
  createdAt: string
  client?: { name: string; email: string } | null
  orderItems: OrderItemDTO[]
}

function mapOrder(o: OrderDTO): Order {
  return {
    id: o.id,
    customerName: o.client?.name ?? '',
    customerEmail: o.client?.email ?? '',
    items: (o.orderItems ?? []).map((it) => ({
      productId: it.productId,
      name: it.product?.name ?? 'Producto',
      price: it.priceAtPurchase,
      quantity: it.quantity,
    })),
    total: o.totalAmount,
    status: STATUS_BE_TO_FE[o.status] ?? 'pendiente',
    date: toDateInput(o.createdAt),
  }
}

interface OfferDTO {
  id: string
  title: string | null
  description: string | null
  category: string | null
  active: boolean
  productId: string | null
  discountPercentage: number
  startDate: string
  endDate: string
  product?: { name: string } | null
}

function mapOffer(o: OfferDTO): Offer {
  return {
    id: o.id,
    title: o.title ?? '',
    description: o.description ?? '',
    discountPercent: o.discountPercentage,
    category: o.category ?? 'Todos',
    active: o.active,
    productId: o.productId ?? undefined,
    productName: o.product?.name,
    startDate: toDateInput(o.startDate),
    endDate: toDateInput(o.endDate),
  }
}

function offerPayload(data: Omit<Offer, 'id'>) {
  return {
    title: data.title,
    description: data.description,
    category: data.category,
    active: data.active,
    productId: data.productId || null,
    discountPercentage: data.discountPercent,
    startDate: data.startDate || undefined,
    endDate: data.endDate,
  }
}

// --------------------------------------------------------------------------
// Autenticación
// --------------------------------------------------------------------------

export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
  const data = await request<{ token: string; user: UserDTO }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return { token: data.token, user: mapUser(data.user) }
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: UserRole = 'cliente',
): Promise<User> {
  const data = await request<{ user: UserDTO }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role: roleToBe(role) }),
  })
  return mapUser(data.user)
}

// --------------------------------------------------------------------------
// Productos
// --------------------------------------------------------------------------

export async function getProducts(): Promise<Product[]> {
  const data = await request<ProductDTO[]>('/products')
  return data.map(mapProduct)
}

export async function createProduct(data: Omit<Product, 'id'>): Promise<void> {
  await request('/products', { method: 'POST', body: JSON.stringify(productPayload(data)) })
}

export async function updateProduct(id: string, data: Omit<Product, 'id'>): Promise<void> {
  await request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(productPayload(data)) })
}

export async function deleteProduct(id: string): Promise<void> {
  await request(`/products/${id}`, { method: 'DELETE' })
}

// --------------------------------------------------------------------------
// Usuarios
// --------------------------------------------------------------------------

export async function getUsers(): Promise<User[]> {
  const data = await request<UserDTO[]>('/users')
  return data.map(mapUser)
}

export async function updateUser(
  id: string,
  data: { name: string; email: string; role: UserRole; status: UserStatus },
): Promise<void> {
  await request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      role: roleToBe(data.role),
      status: statusToBe(data.status),
    }),
  })
}

export async function deleteUser(id: string): Promise<void> {
  await request(`/users/${id}`, { method: 'DELETE' })
}

// --------------------------------------------------------------------------
// Ofertas
// --------------------------------------------------------------------------

export async function getOffers(): Promise<Offer[]> {
  const data = await request<OfferDTO[]>('/offers')
  return data.map(mapOffer)
}

export async function createOffer(data: Omit<Offer, 'id'>): Promise<void> {
  await request('/offers', { method: 'POST', body: JSON.stringify(offerPayload(data)) })
}

export async function updateOffer(id: string, data: Omit<Offer, 'id'>): Promise<void> {
  await request(`/offers/${id}`, { method: 'PUT', body: JSON.stringify(offerPayload(data)) })
}

export async function deleteOffer(id: string): Promise<void> {
  await request(`/offers/${id}`, { method: 'DELETE' })
}

// --------------------------------------------------------------------------
// Pedidos
// --------------------------------------------------------------------------

export async function getOrders(): Promise<Order[]> {
  const data = await request<OrderDTO[]>('/orders')
  return data.map(mapOrder)
}

export async function createOrder(items: { productId: string; quantity: number }[]): Promise<void> {
  await request('/orders', { method: 'POST', body: JSON.stringify({ items }) })
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await request(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status: STATUS_FE_TO_BE[status] }),
  })
}

// --------------------------------------------------------------------------
// Dashboard / métricas
// --------------------------------------------------------------------------

/**
 * Forma REAL que devuelve el backend desplegado en /dashboard/metrics: un
 * subconjunto reducido y variable (garantiza al menos totalRevenue y
 * totalOrders). Por eso el panel de admin NO consume este endpoint: calcula
 * todas sus métricas en el cliente a partir de productos / usuarios / pedidos /
 * ofertas (ver AdminDashboard.tsx). Este wrapper queda disponible por si se
 * necesita el resumen del servidor.
 */
export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  lowStockProducts?: { id: string; name: string; stock: number }[]
  highStockProducts?: { id: string; name: string; stock: number }[]
  topSellingProducts?: { productId: string; name: string; totalSold: number }[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return request<DashboardStats>('/dashboard/metrics')
}
