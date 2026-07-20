import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Package,
  ShoppingBag,
  Tag,
  TrendingDown,
  Users,
} from 'lucide-react'
import { useData } from '../../context/DataContext.tsx'
import { formatPrice, daysUntil } from '../../lib/format.ts'

export default function AdminDashboard() {
  const { products, users, orders, offers } = useData()

  const clientes = users.filter((u) => u.role === 'cliente').length
  const pendientes = orders.filter((o) => o.status === 'pendiente').length
  const ofertasActivas = offers.filter((o) => o.active).length
  const porVencer = products.filter((p) => {
    const d = daysUntil(p.expiryDate)
    return d >= 0 && d <= 3
  })
  const ventas = orders
    .filter((o) => o.status === 'entregado')
    .reduce((sum, o) => sum + o.total, 0)

  const cards = [
    {
      label: 'Productos',
      value: products.length,
      icon: Package,
      to: '/admin/productos',
    },
    {
      label: 'Usuarios',
      value: `${users.length} (${clientes} clientes)`,
      icon: Users,
      to: '/admin/usuarios',
    },
    {
      label: 'Ofertas activas',
      value: ofertasActivas,
      icon: Tag,
      to: '/admin/ofertas',
    },
    {
      label: 'Pedidos pendientes',
      value: pendientes,
      icon: ShoppingBag,
      to: '/admin/pedidos',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Panel general</h1>
        <p className="text-on-surface-variant">
          Resumen del inventario y la actividad de la tienda antidesperdicio.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className="flex items-center gap-4 rounded-2xl border border-outline/60 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-on-surface-variant">{label}</p>
              <p className="text-xl font-bold text-on-surface">{value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-outline/60 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-success">
            <TrendingDown className="h-5 w-5" />
            <h2 className="font-semibold">Ventas rescatadas (entregadas)</h2>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-on-surface">
            {formatPrice(ventas)}
          </p>
          <p className="text-sm text-on-surface-variant">
            Alimentos vendidos en lugar de desperdiciados.
          </p>
        </div>

        <div className="rounded-2xl border border-outline/60 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-error">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="font-semibold">Por vencer (≤ 3 días)</h2>
          </div>
          {porVencer.length === 0 ? (
            <p className="mt-2 text-sm text-on-surface-variant">
              No hay productos críticos por ahora.
            </p>
          ) : (
            <ul className="mt-2 space-y-1">
              {porVencer.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-on-surface">{p.name}</span>
                  <span className="font-medium text-error">
                    {daysUntil(p.expiryDate) === 0
                      ? 'vence hoy'
                      : `${daysUntil(p.expiryDate)} día(s)`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
