import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  Package,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Users,
} from 'lucide-react'
import { formatPrice, formatDate, daysUntil } from '../../lib/format.ts'
import { useData } from '../../context/DataContext.tsx'
import type { Order, OrderStatus } from '../../types.ts'

// Etiquetas y colores de cada estado de pedido.
const STATUS_META: { key: OrderStatus; label: string; bar: string; text: string }[] = [
  { key: 'pendiente', label: 'Pendientes', bar: 'bg-tertiary', text: 'text-tertiary' },
  { key: 'preparando', label: 'Preparando', bar: 'bg-primary', text: 'text-primary' },
  { key: 'entregado', label: 'Entregados', bar: 'bg-success', text: 'text-success' },
  { key: 'cancelado', label: 'Cancelados', bar: 'bg-error', text: 'text-error' },
]

/** Últimas 14 fechas (yyyy-mm-dd) terminando hoy, en orden cronológico. */
function lastFourteenDays(): string[] {
  const days: string[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    )
  }
  return days
}

/**
 * Métricas del panel calculadas en el cliente a partir de los datos que ya
 * expone el DataContext (productos, usuarios, pedidos, ofertas). No dependemos
 * de la forma del endpoint /dashboard/metrics, que en el backend desplegado
 * devuelve un subconjunto variable de campos.
 */
function computeStats(
  products: ReturnType<typeof useData>['products'],
  users: ReturnType<typeof useData>['users'],
  orders: Order[],
  offers: ReturnType<typeof useData>['offers'],
) {
  const ordersByStatus: Record<OrderStatus, number> = {
    pendiente: 0,
    preparando: 0,
    entregado: 0,
    cancelado: 0,
  }
  let totalSales = 0
  for (const o of orders) {
    ordersByStatus[o.status] = (ordersByStatus[o.status] ?? 0) + 1
    if (o.status === 'entregado') totalSales += o.total
  }

  // Ventas por fecha (últimos 14 días), excluyendo pedidos cancelados.
  const dayTotals = new Map<string, { total: number; orders: number }>()
  for (const o of orders) {
    if (o.status === 'cancelado') continue
    const key = o.date
    const bucket = dayTotals.get(key) ?? { total: 0, orders: 0 }
    bucket.total += o.total
    bucket.orders += 1
    dayTotals.set(key, bucket)
  }
  const salesByDate = lastFourteenDays().map((date) => ({
    date,
    total: dayTotals.get(date)?.total ?? 0,
    orders: dayTotals.get(date)?.orders ?? 0,
  }))

  // Productos más vendidos (unidades), excluyendo pedidos cancelados.
  const sold = new Map<string, { productId: string; name: string; totalSold: number }>()
  for (const o of orders) {
    if (o.status === 'cancelado') continue
    for (const it of o.items) {
      const entry = sold.get(it.productId) ?? { productId: it.productId, name: it.name, totalSold: 0 }
      entry.totalSold += it.quantity
      sold.set(it.productId, entry)
    }
  }
  const topSellingProducts = [...sold.values()]
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5)

  // Productos por vencer (0 a 3 días).
  const expiringSoon = products
    .filter((p) => {
      if (!p.expiryDate) return false
      const d = daysUntil(p.expiryDate)
      return d >= 0 && d <= 3
    })
    .sort((a, b) => daysUntil(a.expiryDate) - daysUntil(b.expiryDate))
    .slice(0, 8)

  return {
    totalSales,
    totalOrders: orders.length,
    ordersByStatus,
    salesByDate,
    topSellingProducts,
    expiringSoon,
    totalUsers: users.length,
    totalClients: users.filter((u) => u.role === 'cliente').length,
    totalProducts: products.length,
    activeOffers: offers.filter((o) => o.active).length,
  }
}

export default function AdminDashboard() {
  const { products, users, orders, offers, error, refresh } = useData()
  const [refreshing, setRefreshing] = useState(false)

  const stats = useMemo(
    () => computeStats(products, users, orders, offers),
    [products, users, orders, offers],
  )

  const handleRefresh = () => {
    setRefreshing(true)
    refresh().finally(() => setRefreshing(false))
  }

  const maxOrders = Math.max(1, ...STATUS_META.map((s) => stats.ordersByStatus[s.key] ?? 0))
  const maxDaily = Math.max(1, ...stats.salesByDate.map((d) => d.total))
  const maxSold = Math.max(1, ...stats.topSellingProducts.map((p) => p.totalSold))

  const cards = [
    { label: 'Ventas totales', value: formatPrice(stats.totalSales), hint: 'Pedidos entregados', icon: TrendingUp },
    { label: 'Pedidos', value: String(stats.totalOrders), hint: `${stats.ordersByStatus.pendiente ?? 0} pendientes`, icon: ShoppingBag },
    { label: 'Usuarios registrados', value: String(stats.totalUsers), hint: `${stats.totalClients} clientes`, icon: Users },
    { label: 'Productos', value: String(stats.totalProducts), hint: `${stats.activeOffers} ofertas activas`, icon: Package },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Panel general</h1>
          <p className="text-on-surface-variant">Métricas de la tienda antidesperdicio.</p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl border border-outline bg-white px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-variant disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> Actualizar
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, hint, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl border border-outline/60 bg-white p-5 shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-on-surface-variant">{label}</p>
              <p className="text-xl font-bold text-on-surface">{value}</p>
              <p className="text-xs text-on-surface-variant">{hint}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Pedidos por estado */}
        <div className="rounded-2xl border border-outline/60 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-on-surface">Pedidos por estado</h2>
          </div>
          <div className="space-y-3">
            {STATUS_META.map((s) => {
              const count = stats.ordersByStatus[s.key] ?? 0
              return (
                <div key={s.key} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-sm text-on-surface-variant">{s.label}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-variant">
                    <div
                      className={`h-full rounded-full ${s.bar}`}
                      style={{ width: `${(count / maxOrders) * 100}%` }}
                    />
                  </div>
                  <span className={`w-8 shrink-0 text-right text-sm font-bold ${s.text}`}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Métricas por fecha */}
        <div className="rounded-2xl border border-outline/60 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            <h2 className="font-semibold text-on-surface">Ventas por fecha (14 días)</h2>
          </div>
          <div className="flex h-40 items-end gap-1">
            {stats.salesByDate.map((d) => (
              <div key={d.date} className="group flex flex-1 flex-col items-center justify-end gap-1">
                <div
                  className="w-full rounded-t bg-success/80 transition-colors group-hover:bg-success"
                  style={{ height: `${Math.max(2, (d.total / maxDaily) * 100)}%` }}
                  title={`${formatDate(d.date)}: ${formatPrice(d.total)} · ${d.orders} pedido(s)`}
                />
                <span className="text-[10px] text-on-surface-variant">{d.date.slice(8, 10)}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-on-surface-variant">
            Máximo diario: {formatPrice(maxDaily)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Productos más vendidos */}
        <div className="rounded-2xl border border-outline/60 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-on-surface">Productos más vendidos</h2>
          </div>
          {stats.topSellingProducts.length === 0 ? (
            <p className="text-sm text-on-surface-variant">Aún no hay ventas registradas.</p>
          ) : (
            <ul className="space-y-3">
              {stats.topSellingProducts.map((p) => (
                <li key={p.productId} className="flex items-center gap-3">
                  <span className="min-w-0 flex-1 truncate text-sm text-on-surface">{p.name}</span>
                  <div className="h-2.5 w-24 overflow-hidden rounded-full bg-surface-variant">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(p.totalSold / maxSold) * 100}%` }}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right text-sm font-bold text-on-surface">
                    {p.totalSold} u.
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Productos por vencer */}
        <div className="rounded-2xl border border-outline/60 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-error" />
            <h2 className="font-semibold text-on-surface">Por vencer (≤ 3 días)</h2>
          </div>
          {stats.expiringSoon.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No hay productos críticos por ahora.</p>
          ) : (
            <ul className="space-y-1">
              {stats.expiringSoon.map((p) => {
                const d = daysUntil(p.expiryDate)
                return (
                  <li key={p.id} className="flex items-center justify-between text-sm">
                    <span className="text-on-surface">{p.name}</span>
                    <span className="font-medium text-error">
                      {d === 0 ? 'vence hoy' : `${d} día(s)`}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
