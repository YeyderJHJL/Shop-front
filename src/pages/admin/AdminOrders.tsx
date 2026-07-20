import { useMemo, useState } from 'react'
import { Eye } from 'lucide-react'
import { useData } from '../../context/DataContext.tsx'
import type { Order, OrderStatus } from '../../types.ts'
import { formatPrice, formatDate } from '../../lib/format.ts'
import Modal from '../../components/admin/Modal.tsx'

const STATUSES: OrderStatus[] = [
  'pendiente',
  'preparando',
  'entregado',
  'cancelado',
]

const STATUS_STYLES: Record<OrderStatus, string> = {
  pendiente: 'bg-tertiary/15 text-tertiary',
  preparando: 'bg-primary/15 text-primary',
  entregado: 'bg-success-container text-success',
  cancelado: 'bg-error-container text-error',
}

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useData()
  const [filter, setFilter] = useState<OrderStatus | 'todos'>('todos')
  const [detail, setDetail] = useState<Order | null>(null)

  const filtered = useMemo(
    () =>
      filter === 'todos'
        ? orders
        : orders.filter((o) => o.status === filter),
    [orders, filter],
  )

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Pedidos</h1>
        <p className="text-on-surface-variant">
          Gestiona el estado de los pedidos de los clientes.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['todos', ...STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === s
                ? 'bg-primary text-white'
                : 'bg-white text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-outline/60 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-outline/60 text-xs uppercase tracking-wide text-on-surface-variant">
            <tr>
              <th className="px-4 py-3">Pedido</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-outline/40 last:border-0">
                <td className="px-4 py-3 font-mono text-on-surface">#{o.id}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-on-surface">{o.customerName}</p>
                  <p className="text-xs text-on-surface-variant">{o.customerEmail}</p>
                </td>
                <td className="px-4 py-3 text-on-surface-variant">
                  {formatDate(o.date)}
                </td>
                <td className="px-4 py-3 font-semibold text-on-surface">
                  {formatPrice(o.total)}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) =>
                      updateOrderStatus(o.id, e.target.value as OrderStatus)
                    }
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize outline-none ${STATUS_STYLES[o.status]}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-white text-on-surface">
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setDetail(o)}
                      aria-label={`Ver pedido ${o.id}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-primary"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-on-surface-variant">
                  No hay pedidos en este estado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={detail !== null}
        onClose={() => setDetail(null)}
        title={detail ? `Pedido #${detail.id}` : 'Pedido'}
      >
        {detail && (
          <div className="space-y-4">
            <div className="text-sm">
              <p className="font-medium text-on-surface">{detail.customerName}</p>
              <p className="text-on-surface-variant">{detail.customerEmail}</p>
              <p className="text-on-surface-variant">{formatDate(detail.date)}</p>
            </div>

            <div className="divide-y divide-outline/40 rounded-xl border border-outline/60">
              {detail.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <span className="text-on-surface">
                    {item.name}{' '}
                    <span className="text-on-surface-variant">× {item.quantity}</span>
                  </span>
                  <span className="font-medium text-on-surface">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-outline/60 pt-3">
              <span className="font-semibold text-on-surface">Total</span>
              <span className="text-lg font-extrabold text-on-surface">
                {formatPrice(detail.total)}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
