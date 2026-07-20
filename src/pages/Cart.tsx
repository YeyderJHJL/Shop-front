import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext.tsx'
import { formatPrice } from '../lib/format.ts'
import AsyncImage from '../components/AsyncImage.tsx'
import QuantitySelector from '../components/QuantitySelector.tsx'

export default function Cart() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <ShoppingBag className="h-14 w-14 text-outline" />
        <div>
          <p className="text-lg font-semibold">Tu carrito está vacío</p>
          <p className="text-on-surface-variant">Agrega productos para continuar.</p>
        </div>
        <Link
          to="/"
          className="rounded-xl bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Explorar productos
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold">Carrito de compras</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items list */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-2xl border border-outline/60 bg-white p-4 shadow-sm"
            >
              <Link to={`/product/${item.id}`} className="shrink-0">
                <AsyncImage
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 rounded-xl"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium uppercase tracking-wide text-primary">
                  {item.category}
                </span>
                <Link
                  to={`/product/${item.id}`}
                  className="block truncate font-medium hover:text-primary"
                >
                  {item.name}
                </Link>
                <p className="font-extrabold">{formatPrice(item.price)}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <QuantitySelector
                  value={item.quantity}
                  onChange={(q) => updateQuantity(item.id, q)}
                  size="sm"
                />
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="flex items-center gap-1 text-sm text-error transition-colors hover:text-error/80"
                >
                  <Trash2 className="h-4 w-4" /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary card */}
        <aside className="h-fit rounded-2xl border border-outline/60 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="mb-4 text-lg font-bold">Resumen</h2>
          <div className="space-y-2 border-b border-outline/60 pb-4">
            <div className="flex justify-between text-on-surface-variant">
              <span>Subtotal</span>
              <span className="font-medium text-on-surface">
                {formatPrice(subtotal)}
              </span>
            </div>
          </div>
          <div className="flex justify-between py-4 text-lg">
            <span className="font-semibold">Total</span>
            <span className="font-extrabold">{formatPrice(subtotal)}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="w-full rounded-2xl bg-primary px-6 py-4 font-semibold text-white shadow-md transition-colors hover:bg-primary-dark"
          >
            Finalizar Compra
          </button>
          <Link
            to="/"
            className="mt-3 block text-center text-sm font-medium text-primary hover:underline"
          >
            Seguir comprando
          </Link>
        </aside>
      </div>
    </div>
  )
}
