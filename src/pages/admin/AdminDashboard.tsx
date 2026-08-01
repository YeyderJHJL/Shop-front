import { useEffect, useState } from 'react'
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
import * as api from '../../lib/api.ts'
import type { DashboardStats } from '../../lib/api.ts'

// Etiquetas y colores de cada estado de pedido (claves del backend).
const STATUS_META: { key: string; label: string; bar: string; text: string }[] = [
  { key: 'PENDING', label: 'Pendientes', bar: 'bg-tertiary', text: 'text-tertiary' },
  { key: 'PREPARING', label: 'Preparando', bar: 'bg-primary', text: 'text-primary' },
  { key: 'COMPLETED', label: 'Entregados', bar: 'bg-success', text: 'text-success' },
  { key: 'CANCELLED', label: 'Cancelados', bar: 'bg-error', text: 'text-error' },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    api
      .getDashboardStats()
      .then((s) => active && setStats(s))
      .catch((e) => active && setError(e instanceof Error ? e.message : 'Error cargando métricas'))
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [reloadKey])

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-on-surface-variant">
        <RefreshCw className="h-5 w-5 animate-spin" /> Cargando métricas...
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <AlertTriangle className="h-12 w-12 text-error" />
        <div>
          <p className="text-lg font-semibold">No se pudieron cargar las métricas</p>
          <p className="text-on-surface-variant">{error || 'Verifica que el backend esté encendido.'}</p>
        </div>
        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
        >
          <RefreshCw className="h-4 w-4" /> Reintentar
        </button>
      </div>
    )
  }

  const maxOrders = Math.max(1, ...STATUS_META.map((s) => stats.ordersByStatus[s.key] ?? 0))
  const maxDaily = Math.max(1, ...stats.salesByDate.map((d) => d.total))
  const maxSold = Math.max(1, ...stats.topSellingProducts.map((p) => p.totalSold))

  const cards = [
    { label: 'Ventas totales', value: formatPrice(stats.totalSales), hint: 'Pedidos entregados', icon: TrendingUp },
    { label: 'Pedidos', value: String(stats.totalOrders), hint: `${stats.ordersByStatus.PENDING ?? 0} pendientes`, icon: ShoppingBag },
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
          onClick={() => setReloadKey((k) => k + 1)}
          className="flex items-center gap-2 rounded-xl border border-outline bg-white px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-variant"
        >
          <RefreshCw className="h-4 w-4" /> Actualizar
        </button>
      </div>

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
                const iso = p.expirationDate ? p.expirationDate.slice(0, 10) : ''
                const d = daysUntil(iso)
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
